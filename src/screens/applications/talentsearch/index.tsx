import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import Typography from '../../../components/atoms/typography';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../../theme/colors';
import { useBrandTheme } from '../../../hooks/useBrandTheme';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
  getCopilotSessionsRequestAction,
  getCopilotSuggestionsRequestAction,
  chatStreamRequestAction,
  chatStreamResetAction,
  getCopilotSessionDetailRequestAction,
  renameSessionRequestAction,
  deleteCopilotSessionRequestAction,
  clearAllSessionsRequestAction,
  clearCopilotSessionDetailAction,
} from '../../../features/copilot/actions';
import {
  selectCopilotSessions,
  selectCopilotSuggestions,
  selectCopilotIsStreaming,
  selectCopilotStreamStatusMessage,
  selectCopilotStreamResult,
  selectCopilotStreamCandidates,
  selectCopilotStreamSessionId,
  selectCopilotStreamError,
  selectCopilotCurrentSession,
  selectCopilotCurrentSessionLoading,
  selectCopilotCurrentSessionError,
} from '../../../features/copilot/selectors';
import { CopilotCandidateResult } from '../../../features/copilot/types';
import { navigate } from '../../../utils/navigationUtils';
import {
  searchIconSvg,
  clockOutlineIcon,
  starOutlineIcon,
  chevronRightIconSvg,
  sendIconSvg,
  hamburgerIconSvg,
  pinIconSvg,
  plusIconSvg,
} from '../applicant/components/talentSearchIcons';
import TalentSearchDrawer from '../applicant/components/TalentSearchDrawer';
import { getStatusColor, formatStatus } from '../../../components/organisms/applicantlist/helper';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { useStyles } from './styles';

interface SuggestionCardItem {
  id: string;
  text: string;
  iconType: 'search' | 'clock' | 'star';
}

const TalentSearchScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { brandColors, primaryColor } = useBrandTheme();
  const styles = useStyles(brandColors);
  const { insetsTop } = useRNSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>([]);

  // Copilot Redux Selectors
  const apiSuggestions = useAppSelector(selectCopilotSuggestions);
  const apiSessions = useAppSelector(selectCopilotSessions);
  const isStreaming = useAppSelector(selectCopilotIsStreaming);
  const streamStatusMessage = useAppSelector(selectCopilotStreamStatusMessage);
  const streamResult = useAppSelector(selectCopilotStreamResult);
  const candidates = useAppSelector(selectCopilotStreamCandidates);
  const streamSessionId = useAppSelector(selectCopilotStreamSessionId);
  const streamError = useAppSelector(selectCopilotStreamError);

  const currentSession = useAppSelector(selectCopilotCurrentSession);
  const currentSessionLoading = useAppSelector(selectCopilotCurrentSessionLoading);
  const currentSessionError = useAppSelector(selectCopilotCurrentSessionError);

  const activeBrandColor = primaryColor || brandColors[600] || colors.brand[600];

  // Fetch initial copilot sessions and suggestions on mount
  useEffect(() => {
    dispatch(getCopilotSuggestionsRequestAction());
    dispatch(getCopilotSessionsRequestAction());
  }, [dispatch]);

  // Sync API sessions to drawer history list
  useEffect(() => {
    if (apiSessions && apiSessions.length > 0) {
      const sessionTitles = apiSessions
        .map((s) => (s.title || s.query || s.name || '').trim())
        .filter((t) => Boolean(t));
      setHistoryList(sessionTitles);
    } else {
      setHistoryList([]);
    }
  }, [apiSessions]);

  // Dynamic suggestion cards from API
  const suggestionCards: SuggestionCardItem[] = useMemo(() => {
    if (apiSuggestions && apiSuggestions.length > 0) {
      return apiSuggestions.map((text, index) => {
        const lower = text.toLowerCase();
        let iconType: 'search' | 'clock' | 'star' = 'search';
        if (lower.includes('recent') || lower.includes('latest')) {
          iconType = 'clock';
        } else if (lower.includes('top') || lower.includes('score') || lower.includes('best')) {
          iconType = 'star';
        } else if (index % 2 === 1) {
          iconType = 'star';
        }
        return {
          id: `copilot-sugg-${index}`,
          text,
          iconType,
        };
      });
    }
    return [];
  }, [apiSuggestions]);

  // Execute Copilot Chat Stream search
  const handleExecuteSearch = useCallback(
    (searchQuery: string, sessionId?: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      const activeSessionId =
        sessionId ||
        (currentSession ? String(currentSession.id) : undefined) ||
        (streamSessionId ? String(streamSessionId) : undefined);

      setSubmittedQuery(trimmed);
      setQuery('');
      setIsHistoryOpen(false);

      // Trigger chat stream saga
      dispatch(chatStreamRequestAction({ query: trimmed, session_id: activeSessionId }));
    },
    [currentSession, streamSessionId, dispatch]
  );

  // New Search reset
  const handleNewSearch = useCallback(() => {
    setSubmittedQuery(null);
    setQuery('');
    dispatch(chatStreamResetAction());
    dispatch(clearCopilotSessionDetailAction());
    setIsHistoryOpen(false);
  }, [dispatch]);

  const handleCardPress = useCallback(
    (itemText: string) => {
      handleExecuteSearch(itemText);
    },
    [handleExecuteSearch]
  );

  const handleSelectHistory = useCallback(
    (itemText: string, sessionId?: string) => {
      let targetSessionId = sessionId;
      if (!targetSessionId && apiSessions && apiSessions.length > 0) {
        const matched = apiSessions.find(
          (s) => (s.title || s.query || s.name || '').trim() === itemText.trim()
        );
        if (matched) {
          targetSessionId = String(matched.id);
        }
      }

      if (targetSessionId) {
        setSubmittedQuery(null);
        setQuery('');
        setIsHistoryOpen(false);
        dispatch(chatStreamResetAction());
        dispatch(getCopilotSessionDetailRequestAction(targetSessionId));
      } else {
        handleExecuteSearch(itemText);
      }
    },
    [apiSessions, dispatch, handleExecuteSearch]
  );

  const handleRemoveHistoryItem = useCallback(
    (itemText: string, sessionId?: string) => {
      console.log('[handleRemoveHistoryItem] Removing session:', { itemText, sessionId });
      let targetId = sessionId;

      if (!targetId && itemText) {
        const matched = apiSessions.find(
          (s) =>
            (s.title || s.query || s.name || '').trim().toLowerCase() ===
            itemText.trim().toLowerCase()
        );
        if (matched) {
          targetId = String(matched.id);
        }
      }

      if (!targetId && currentSession?.id) {
        targetId = String(currentSession.id);
      }

      if (targetId) {
        console.log('[handleRemoveHistoryItem] Dispatching delete session action for ID:', targetId);
        dispatch(deleteCopilotSessionRequestAction(targetId));
      } else {
        console.warn('[handleRemoveHistoryItem] No sessionId could be resolved for deletion');
      }

      setHistoryList((prev) => prev.filter((item) => item !== itemText));
      if (
        (targetId && currentSession && String(currentSession.id) === String(targetId)) ||
        (targetId && streamSessionId && String(streamSessionId) === String(targetId))
      ) {
        handleNewSearch();
      }
    },
    [apiSessions, currentSession, streamSessionId, dispatch, handleNewSearch]
  );

  const handleRenameSession = useCallback(
    (newTitle: string, sessionId?: string, oldTitle?: string) => {
      console.log('[handleRenameSession] Renaming chat:', { newTitle, sessionId, oldTitle });
      let targetId = sessionId;

      if (!targetId && oldTitle) {
        const found = apiSessions.find(
          (s) =>
            (s.title || s.query || s.name || '').trim().toLowerCase() ===
            oldTitle.trim().toLowerCase()
        );
        if (found) {
          targetId = String(found.id);
        }
      }

      if (!targetId && currentSession?.id) {
        targetId = String(currentSession.id);
      }

      if (!targetId && streamSessionId) {
        targetId = String(streamSessionId);
      }

      if (targetId) {
        console.log('[handleRenameSession] Dispatching rename action with targetId:', targetId);
        dispatch(renameSessionRequestAction({ id: targetId, title: newTitle }));
      } else {
        console.warn('[handleRenameSession] No sessionId could be resolved for rename');
      }

      setHistoryList((prev) =>
        prev.map((item) => (oldTitle && item === oldTitle ? newTitle : item))
      );
    },
    [dispatch, apiSessions, currentSession, streamSessionId]
  );

  const handleTogglePinSession = useCallback((_sessionId?: string, _isPinned?: boolean) => {
    // Call GET /api/v1/copilot/sessions/ when pin and unpin is done
    dispatch(getCopilotSessionsRequestAction());
  }, [dispatch]);

  const handleClearAllHistory = useCallback(() => {
    dispatch(clearAllSessionsRequestAction());
    setHistoryList([]);
    handleNewSearch();
  }, [dispatch, handleNewSearch]);

  const handleSelectCandidate = useCallback((candidate: CopilotCandidateResult) => {
    if (candidate.application_id) {
      navigate('ApplicantDetails', {
        application_id: candidate.application_id,
        applicantId: candidate.candidate_id,
      });
    }
  }, []);

  const renderCardIcon = useCallback(
    (iconType: 'search' | 'clock' | 'star') => {
      switch (iconType) {
        case 'clock':
          return <SvgXml xml={clockOutlineIcon(activeBrandColor)} width={18} height={18} />;
        case 'star':
          return <SvgXml xml={starOutlineIcon(activeBrandColor)} width={18} height={18} />;
        case 'search':
        default:
          return <SvgXml xml={searchIconSvg(activeBrandColor)} width={18} height={18} />;
      }
    },
    [activeBrandColor]
  );

  const renderCandidateTableCard = useCallback(
    (
      candList: CopilotCandidateResult[],
      messageText?: string,
      totalCount?: number,
      keyPrefix = 'stream'
    ) => {
      const hasCandidates = Boolean(candList && candList.length > 0);
      if (!hasCandidates && !messageText) return null;

      return (
        <View key={`${keyPrefix}-card-wrap`}>
          {/* Results Header with Search Badge */}
          {messageText ? (
            <View style={styles.resultHeaderRow}>
              <View style={styles.searchIconBadge}>
                <SvgXml xml={searchIconSvg(activeBrandColor)} width={16} height={16} />
              </View>
              <Typography
                variant="semiBoldTxtsm"
                color={colors.gray[900]}
                style={styles.resultHeaderText}
              >
                {messageText}
              </Typography>
            </View>
          ) : null}

          {/* Table Card (rendered only when candidates exist) */}
          {hasCandidates ? (
            <View style={styles.resultsCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableInner}>
                {/* Table Header Row */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.colCandidate}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      CANDIDATE
                    </Typography>
                  </View>
                  <View style={styles.colJob}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      JOB
                    </Typography>
                  </View>
                  <View style={styles.colCity}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      CITY
                    </Typography>
                  </View>
                  <View style={styles.colSummary}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      SUMMARY
                    </Typography>
                  </View>
                  <View style={styles.colResume}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      RESUME...
                    </Typography>
                  </View>
                  <View style={styles.colStatus}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[500]}>
                      STATUS
                    </Typography>
                  </View>
                </View>

                {/* Candidate Rows */}
                {candList.map((cand, idx) => {
                  const initial = cand.name ? cand.name.charAt(0).toUpperCase() : '?';
                  const hasProfilePic = Boolean(cand.profile_pic);
                  const isAlt = idx % 2 === 1;

                  return (
                    <Pressable
                      key={`${keyPrefix}-cand-${cand.application_id || cand.candidate_id || 'item'}-${idx}`}
                      style={[styles.tableRow, isAlt && styles.tableRowAlt]}
                      onPress={() => handleSelectCandidate(cand)}
                      accessibilityRole="button"
                      accessibilityLabel={`View candidate ${cand.name}`}
                    >
                      {/* CANDIDATE */}
                      <View style={styles.colCandidate}>
                        {hasProfilePic ? (
                          <Image
                            source={{ uri: cand.profile_pic as string }}
                            style={styles.avatarImg}
                          />
                        ) : (
                          <View style={styles.avatarCircle}>
                            <Typography variant="semiBoldTxtxs" color={brandColors[700] || activeBrandColor}>
                              {initial}
                            </Typography>
                          </View>
                        )}
                        <View style={styles.candidateInfo}>
                          <Typography
                            variant="semiBoldTxtsm"
                            color={colors.gray[900]}
                            numberOfLines={1}
                          >
                            {cand.name || 'Unknown'}
                          </Typography>
                          {cand.email ? (
                            <Typography
                              variant="regularTxtxs"
                              color={colors.gray[500]}
                              numberOfLines={1}
                            >
                              {cand.email}
                            </Typography>
                          ) : null}
                        </View>
                      </View>

                      {/* JOB */}
                      <View style={styles.colJob}>
                        <Typography
                          variant="regularTxtsm"
                          color={colors.gray[700]}
                          numberOfLines={1}
                        >
                          {cand.applied_job_title || 'Software Engineer'}
                        </Typography>
                      </View>

                      {/* CITY */}
                      <View style={styles.colCity}>
                        <SvgXml xml={pinIconSvg(colors.gray[500])} width={13} height={13} />
                        <Typography
                          variant="regularTxtsm"
                          color={colors.gray[600]}
                          numberOfLines={1}
                        >
                          {cand.city || '—'}
                        </Typography>
                      </View>

                      {/* SUMMARY */}
                      <View style={styles.colSummary}>
                        <Typography
                          variant="regularTxtsm"
                          color={colors.gray[500]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {cand.ai_summary || '—'}
                        </Typography>
                      </View>

                      {/* RESUME */}
                      <View style={styles.colResume}>
                        <Typography
                          variant="regularTxtsm"
                          color={colors.gray[500]}
                          numberOfLines={1}
                        >
                          {cand.resume_score ? String(cand.resume_score) : '—'}
                        </Typography>
                      </View>

                      {/* STATUS */}
                      <View style={styles.colStatus}>
                        <View style={styles.statusBadge}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: getStatusColor(cand.application_status || 'applied') },
                            ]}
                          />
                          <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                            {formatStatus(cand.application_status || 'applied')}
                          </Typography>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.tableFooter}>
              <Typography variant="regularTxtxs" color={colors.gray[500]}>
                Showing{' '}
                <Typography variant="semiBoldTxtxs" color={colors.gray[700]}>
                  {candList.length}
                </Typography>{' '}
                of{' '}
                <Typography variant="semiBoldTxtxs" color={colors.gray[700]}>
                  {totalCount ?? candList.length}
                </Typography>
              </Typography>
            </View>
          </View>
        ) : null}
      </View>
    );
    },
    [activeBrandColor, handleSelectCandidate, styles]
  );

  const isSearchActive = Boolean(
    submittedQuery ||
    isStreaming ||
    candidates.length > 0 ||
    currentSession ||
    currentSessionLoading
  );

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        {/* Sleek Top Navigation Bar */}
        <View style={styles.headerBar}>
          <Pressable
            onPress={() => setIsHistoryOpen(true)}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel="Open search history"
          >
            <SvgXml xml={hamburgerIconSvg(colors.gray[800])} />
          </Pressable>

          <View style={styles.headerCenterContainer}>
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
              Talent Search
            </Typography>
          </View>

          <Pressable
            onPress={handleNewSearch}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel="Start a new search"
          >
            <SvgXml xml={plusIconSvg(activeBrandColor)} width={20} height={20} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insetsTop : 0}
          style={styles.keyboardAvoidingView}
        >
          {/* Scrollable Content */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.contentScrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {isSearchActive ? (
              // Active Search Results / Selected Session View
              <View>
                {/* Session Loading Spinner */}
                {currentSessionLoading && (
                  <View style={styles.streamingStatusBox}>
                    <ActivityIndicator size="small" color={activeBrandColor} />
                    <Typography
                      variant="mediumTxtsm"
                      color={colors.gray[700]}
                      style={styles.streamingText}
                    >
                      Loading search details...
                    </Typography>
                  </View>
                )}

                {/* Session Error Banner */}
                {currentSessionError && !currentSessionLoading && (
                  <View style={[styles.streamingStatusBox, { borderColor: colors.error[300] }]}>
                    <Typography variant="regularTxtsm" color={colors.error[600]}>
                      {currentSessionError}
                    </Typography>
                  </View>
                )}

                {/* If currentSession is loaded, render its conversation messages */}
                {currentSession && currentSession.messages && currentSession.messages.length > 0 ? (
                  <View>
                    {currentSession.messages.map((msg, index) => {
                      if (msg.role === 'user') {
                        return (
                          <View
                            key={msg.id ? `user-msg-${msg.id}-${index}` : `user-msg-${index}`}
                            style={styles.userBubbleContainer}
                          >
                            <View style={styles.userBubble}>
                              <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                {msg.content}
                              </Typography>
                            </View>
                          </View>
                        );
                      }

                      if (msg.role === 'assistant') {
                        const assistantCandidates = msg.results || [];
                        return (
                          <View key={msg.id ? `asst-msg-${msg.id}-${index}` : `asst-msg-${index}`}>
                            {renderCandidateTableCard(
                              assistantCandidates,
                              msg.content,
                              assistantCandidates.length,
                              msg.id || `sess-${index}`
                            )}
                          </View>
                        );
                      }

                      return null;
                    })}
                  </View>
                ) : null}

                {/* Active live stream section (renders in-flight user prompt and progressive status) */}
                {isStreaming || streamError ? (
                  <View>
                    {/* User Prompt Message Bubble (Top Right) - only shown while streaming if not yet in currentSession */}
                    {submittedQuery &&
                    (!currentSession?.messages?.length ||
                      currentSession.messages[currentSession.messages.length - 1].content !== submittedQuery) ? (
                      <View style={styles.userBubbleContainer}>
                        <View style={styles.userBubble}>
                          <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                            {submittedQuery}
                          </Typography>
                        </View>
                      </View>
                    ) : null}

                    {/* Progressive Streaming Status Indicator */}
                    {isStreaming ? (
                      <View style={styles.streamingStatusBox}>
                        <ActivityIndicator size="small" color={activeBrandColor} />
                        <Typography
                          variant="mediumTxtsm"
                          color={colors.gray[700]}
                          style={styles.streamingText}
                        >
                          {streamStatusMessage || 'Searching candidates...'}
                        </Typography>
                      </View>
                    ) : null}

                    {/* Error Banner */}
                    {streamError ? (
                      <View style={[styles.streamingStatusBox, { borderColor: colors.error[300] }]}>
                        <Typography variant="regularTxtsm" color={colors.error[600]}>
                          {streamError}
                        </Typography>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  /* Fallback if currentSession is not loaded yet, but live stream produced candidates */
                  (!currentSession?.messages || currentSession.messages.length === 0) && candidates.length > 0 ? (
                    <View>
                      {submittedQuery ? (
                        <View style={styles.userBubbleContainer}>
                          <View style={styles.userBubble}>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                              {submittedQuery}
                            </Typography>
                          </View>
                        </View>
                      ) : null}
                      {renderCandidateTableCard(
                        candidates,
                        streamResult?.message ||
                          `Showing 1–${candidates.length} of ${streamResult?.result_total ?? candidates.length} candidates.`,
                        streamResult?.result_total ?? candidates.length,
                        'stream'
                      )}
                    </View>
                  ) : null
                )}
              </View>
            ) : (
              // Initial State: Hero + "Try Asking" Cards from API
              <View>
                {/* Center Hero Section */}
                <View style={styles.heroSection}>
                  <View style={styles.heroIconContainer}>
                    <SvgXml xml={searchIconSvg(activeBrandColor)} width={24} height={24} />
                  </View>

                  <Typography variant="semiBoldTxtxl" color={colors.gray[900]} style={styles.heroTitle}>
                    What kind of applicant are you looking for?
                  </Typography>

                  <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.heroSubtitle}>
                    Describe them in plain language — skills, experience, or location — and Copilot finds matching candidates.
                  </Typography>
                </View>

                {/* Prompt Cards Section (strictly from API) */}
                {suggestionCards.length > 0 && (
                  <View>
                    <View style={styles.sectionHeaderRow}>
                      <Typography variant="semiBoldTxtxs" color={colors.gray[400]} style={styles.sectionLabel}>
                        Try Asking
                      </Typography>
                    </View>

                    <View style={styles.cardsContainer}>
                      {suggestionCards.map((item) => (
                        <Pressable
                          key={item.id}
                          style={styles.suggestionCard}
                          onPress={() => handleCardPress(item.text)}
                          accessibilityRole="button"
                          accessibilityLabel={item.text}
                        >
                          <View style={styles.cardIconCircle}>
                            {renderCardIcon(item.iconType)}
                          </View>

                          <Typography variant="mediumTxtsm" color={colors.gray[800]} style={styles.cardText} numberOfLines={2}>
                            {item.text}
                          </Typography>

                          <View style={styles.chevronBox}>
                            <SvgXml xml={chevronRightIconSvg(colors.gray[400])} width={14} height={14} />
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Bottom Chat / Copilot Input Bar */}
          <View style={styles.bottomSection}>
            <Typography variant="regularTxtxs" color={colors.gray[400]} style={styles.disclaimerText}>
              Copilot searches your applicant pool. Please double-check results.
            </Typography>

            <View style={styles.inputContainer}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={'Message Copilot... e.g. "Find React developers in Bangalore with 5+ years"'}
                placeholderTextColor={colors.gray[400]}
                style={styles.inputField}
                returnKeyType="search"
                onSubmitEditing={() => handleExecuteSearch(query)}
              />

              <Pressable
                style={[
                  styles.sendButton,
                  {
                    backgroundColor:
                      query.trim().length > 0
                        ? activeBrandColor
                        : brandColors[300] || colors.brand[300],
                  },
                ]}
                onPress={() => handleExecuteSearch(query)}
                accessibilityRole="button"
                accessibilityLabel="Send search query"
              >
                <SvgXml xml={sendIconSvg('#FFFFFF')} />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Side Drawer Navigation for Search History */}
        <TalentSearchDrawer
          visible={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          sessions={apiSessions}
          historyList={historyList}
          onSelectHistory={handleSelectHistory}
          onRemoveHistoryItem={handleRemoveHistoryItem}
          onClearAllHistory={handleClearAllHistory}
          onNewSearch={handleNewSearch}
          onRenameSession={handleRenameSession}
          onTogglePinSession={handleTogglePinSession}
        />
      </View>
    </CustomSafeAreaView>
  );
};

export default TalentSearchScreen;
