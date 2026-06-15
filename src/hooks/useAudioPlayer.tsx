import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';
import Video, { OnLoadData, OnProgressData } from 'react-native-video';

/**
 * Audio player hook powered by react-native-video (AVPlayer on iOS).
 *
 * Why not react-native-sound?
 * – react-native-sound uses AVAudioPlayer which CANNOT reliably play remote
 *   URLs on iOS (especially .wav). AVPlayer (used by react-native-video) handles
 *   remote streaming natively on both Simulator and real devices.
 *
 * Usage:
 *   const { ..., AudioPlayerView } = useAudioPlayer();
 *   // Render <AudioPlayerView /> somewhere in your JSX (it's invisible, zero-size).
 */
export const useAudioPlayer = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [progressMap, setProgressMap] = useState<
    Record<number, { current: number; duration: number }>
  >({});

  const progressAnimMap = useRef<Record<number, Animated.Value>>({}).current;
  const positionRef = useRef<Record<number, number>>({});
  const progressBarWidthRef = useRef<number>(200);

  // Video player state
  const videoRef = useRef<React.ElementRef<typeof Video>>(null);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const [paused, setPaused] = useState(true);
  const activeIdRef = useRef<number | null>(null);
  const timersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // ──────────────────────── cleanup ────────────────────────

  const cleanup = useCallback((savePosition = true) => {
    const currentId = activeIdRef.current;

    if (currentId !== null && savePosition) {
      // Position is already tracked via onProgress
    }

    setPaused(true);

    if (currentId !== null && timersRef.current[currentId]) {
      clearInterval(timersRef.current[currentId]);
      delete timersRef.current[currentId];
    }

    if (currentId !== null && progressAnimMap[currentId]) {
      progressAnimMap[currentId].stopAnimation();
    }
  }, [progressAnimMap]);

  // ──────────────────────── Video callbacks ────────────────────────

  const onVideoLoad = useCallback((data: OnLoadData) => {
    const id = activeIdRef.current;
    if (id === null) return;

    const duration = data.duration || 0;
    const startFrom = positionRef.current[id] ?? 0;

    setProgressMap((prev) => ({
      ...prev,
      [id]: { current: startFrom, duration },
    }));

    // Seek to saved position if resuming
    if (startFrom > 0 && videoRef.current) {
      videoRef.current.seek(startFrom);
    }

    // Setup progress animation
    const safeDuration = duration > 0 ? duration : 1;
    if (!progressAnimMap[id]) {
      progressAnimMap[id] = new Animated.Value(startFrom / safeDuration);
    } else {
      progressAnimMap[id].setValue(startFrom / safeDuration);
    }

    const remaining = Math.max(0, duration - startFrom);
    Animated.timing(progressAnimMap[id], {
      toValue: 1,
      duration: remaining * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Start playing
    setPaused(false);
  }, [progressAnimMap]);

  const onVideoProgress = useCallback((data: OnProgressData) => {
    const id = activeIdRef.current;
    if (id === null) return;

    const current = data.currentTime;
    positionRef.current[id] = current;

    setProgressMap((prev) => ({
      ...prev,
      [id]: { current, duration: prev[id]?.duration ?? 0 },
    }));
  }, []);

  const onVideoEnd = useCallback(() => {
    const id = activeIdRef.current;
    if (id !== null) {
      positionRef.current[id] = 0;

      if (progressAnimMap[id]) {
        progressAnimMap[id].stopAnimation();
        progressAnimMap[id].setValue(0);
      }

      setProgressMap((prev) => ({
        ...prev,
        [id]: { current: 0, duration: prev[id]?.duration ?? 0 },
      }));
    }

    setPaused(true);
    setPlayingId(null);
    activeIdRef.current = null;
  }, [progressAnimMap]);

  const onVideoError = useCallback((error: any) => {
    console.log('[AudioPlayer] Video playback error:', error);
    const id = activeIdRef.current;
    if (id !== null) {
      setPaused(true);
      setPlayingId(null);
      activeIdRef.current = null;
    }
  }, []);

  // ──────────────────────── public API ────────────────────────

  const togglePlay = useCallback((id: number, url?: string) => {
    if (!url) return;

    // If same item is playing → pause/stop it
    if (activeIdRef.current === id) {
      // Save current position (already tracked via onProgress)
      cleanup(true);
      setPlayingId(null);
      activeIdRef.current = null;
      return;
    }

    // Stop any current playback
    cleanup(true);

    // Start new playback
    activeIdRef.current = id;
    setPlayingId(id);
    setAudioSource(url);
    // paused will be set to false in onVideoLoad after loading
    setPaused(true);
  }, [cleanup]);

  const handleSeek = useCallback((itemId: number, tapX: number) => {
    const prog = progressMap[itemId];
    if (!prog || prog.duration <= 0) return;

    const width = progressBarWidthRef.current;
    const seekTime = Math.max(0, Math.min(prog.duration, (tapX / width) * prog.duration));

    positionRef.current[itemId] = seekTime;

    if (activeIdRef.current === itemId && videoRef.current) {
      videoRef.current.seek(seekTime);

      progressAnimMap[itemId].stopAnimation();
      progressAnimMap[itemId].setValue(seekTime / prog.duration);

      setProgressMap((prev) => ({
        ...prev,
        [itemId]: { current: seekTime, duration: prog.duration },
      }));

      const remaining = Math.max(0, prog.duration - seekTime);
      Animated.timing(progressAnimMap[itemId], {
        toValue: 1,
        duration: remaining * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    } else {
      setProgressMap((prev) => ({
        ...prev,
        [itemId]: { current: seekTime, duration: prog.duration },
      }));
      if (progressAnimMap[itemId]) {
        progressAnimMap[itemId].setValue(seekTime / prog.duration);
      }
    }
  }, [progressMap, progressAnimMap]);

  const setProgressBarWidth = useCallback((width: number) => {
    progressBarWidthRef.current = width;
  }, []);

  // ──────────────────────── Hidden Video component ────────────────────────

  const AudioPlayerView = useMemo(() => {
    const AudioPlayer = () => {
      if (!audioSource) return null;

      return (
        <View style={{ width: 0, height: 0, overflow: 'hidden' }}>
          <Video
            ref={videoRef}
            source={{ uri: audioSource }}
            paused={paused}
            audioOnly={true}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
            onLoad={onVideoLoad}
            onProgress={onVideoProgress}
            onEnd={onVideoEnd}
            onError={onVideoError}
            progressUpdateInterval={300}
            style={{ width: 0, height: 0 }}
          />
        </View>
      );
    };

    return AudioPlayer;
  }, [audioSource, paused, onVideoLoad, onVideoProgress, onVideoEnd, onVideoError]);

  return {
    playingId,
    progressMap,
    progressAnimMap,
    togglePlay,
    handleSeek,
    setProgressBarWidth,
    AudioPlayerView,
  };
};
