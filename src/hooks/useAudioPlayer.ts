import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const useAudioPlayer = () => {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [progressMap, setProgressMap] = useState<
    Record<number, { current: number; duration: number }>
  >({});

  const soundRef = useRef<Sound | null>(null);
  const timersRef = useRef<Record<number, NodeJS.Timeout>>({});
  const progressAnimMap = useRef<Record<number, Animated.Value>>({}).current;
  const positionRef = useRef<Record<number, number>>({});
  const progressBarWidthRef = useRef<number>(200);

  const cleanup = (savePosition = true) => {
    const currentPlayingId = playingId;

    if (soundRef.current && currentPlayingId !== null && savePosition) {
      const sound = soundRef.current;
      soundRef.current = null;

      sound.getCurrentTime((sec) => {
        positionRef.current[currentPlayingId] = sec;
        sound.stop();
        sound.release();
      });
    } else if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    if (currentPlayingId !== null && timersRef.current[currentPlayingId]) {
      clearInterval(timersRef.current[currentPlayingId]);
      delete timersRef.current[currentPlayingId];
    }

    if (currentPlayingId !== null && progressAnimMap[currentPlayingId]) {
      progressAnimMap[currentPlayingId].stopAnimation();
    }
  };

  const togglePlay = (id: number, url?: string) => {
    if (!url) return;

    if (playingId === id) {
      cleanup(true);
      setPlayingId(null);
      return;
    }

    cleanup(true);

    const sound = new Sound(url, undefined, (err) => {
      if (err) {
        console.log('Sound load error:', err);
        return;
      }

      soundRef.current = sound;
      setPlayingId(id);

      const startFrom = positionRef.current[id] ?? 0;
      const duration = sound.getDuration();

      setProgressMap((prev) => ({
        ...prev,
        [id]: {
          current: startFrom,
          duration: duration > 0 ? duration : prev[id]?.duration ?? 0,
        },
      }));

      sound.setCurrentTime(startFrom);

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

      timersRef.current[id] = setInterval(() => {
        sound.getCurrentTime((current) => {
          positionRef.current[id] = current;
          setProgressMap((prev) => ({
            ...prev,
            [id]: { current, duration: prev[id]?.duration ?? duration },
          }));
        });
      }, 300);

      // Ensure duration is captured and shown immediately
      const durationNow = sound.getDuration();
      setProgressMap((prev) => ({
        ...prev,
        [id]: {
          current: startFrom,
          duration: durationNow > 0 ? durationNow : prev[id]?.duration ?? 0,
        },
      }));

      sound.play(() => {
        positionRef.current[id] = 0;
        cleanup(false);
        setPlayingId(null);
      });
    });
  };

  const handleSeek = (itemId: number, tapX: number) => {
    const prog = progressMap[itemId];
    if (!prog || prog.duration <= 0) return;

    const width = progressBarWidthRef.current;
    const seekTime = Math.max(0, Math.min(prog.duration, (tapX / width) * prog.duration));

    positionRef.current[itemId] = seekTime;

    if (soundRef.current && playingId === itemId) {
      soundRef.current.setCurrentTime(seekTime);

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
  };

  const setProgressBarWidth = (width: number) => {
    progressBarWidthRef.current = width;
  };

  useEffect(() => {
    return () => cleanup(false);
  }, []);

  return {
    playingId,
    progressMap,
    progressAnimMap,
    togglePlay,
    handleSeek,
    setProgressBarWidth,
  };
};
