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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import Typography from '../../../components/atoms/typography';
import { ResumeScoreBadge } from '../../../components/atoms';
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
import { CopilotCandidateResult, CopilotSessionMessage } from '../../../features/copilot/types';
import { navigate, goBack } from '../../../utils/navigationUtils';
import {
  searchIconSvg,
  clockOutlineIcon,
  starOutlineIcon,
  chevronRightIconSvg,
  sendIconSvg,
  hamburgerIconSvg,
  plusIconSvg,
  closeIconSvg,
  pinIconSvg,
  briefcaseIconSvg,
} from '../applicant/components/talentSearchIcons';
import TalentSearchDrawer from '../applicant/components/TalentSearchDrawer';
import { getStatusColor, formatStatus } from '../../../components/organisms/applicantlist/helper';
import { useRNSafeAreaInsets } from '../../../hooks/useRNSafeAreaInsets';
import { useStyles } from './styles';

const getLocationText = (cand: CopilotCandidateResult): string | null => {
  if (cand.city && typeof cand.city === 'string' && cand.city.trim()) {
    return cand.city.trim();
  }
  const rawLoc = (cand as Record<string, unknown>).location;
  if (typeof rawLoc === 'string' && rawLoc.trim()) {
    return rawLoc.trim();
  }
  if (rawLoc && typeof rawLoc === 'object') {
    const locObj = rawLoc as { city?: string; state?: string; country?: string };
    const parts = [locObj.city, locObj.state, locObj.country].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return null;
};

interface ParsedCandidateMessage {
  start: number;
  end: number;
  total: number;
  hasMore: boolean;
  cleanMessage: string;
  isRangeMessage: boolean;
}

const parseCandidateMessageInfo = (
  messageText: string | undefined,
  candidatesCount: number,
  fallbackTotal?: number
): ParsedCandidateMessage => {
  if (!messageText) {
    const total = fallbackTotal ?? candidatesCount;
    const hasMore = candidatesCount < total;
    const clean =
      total === 0
        ? ''
        : total === 1
        ? 'Showing 1 candidate.'
        : `Showing top 1–${candidatesCount} of ${total} candidates.`;
    return {
      start: 1,
      end: candidatesCount,
      total,
      hasMore,
      cleanMessage: clean,
      isRangeMessage: false,
    };
  }

  let clean = messageText
    .replace(/Showing\s+top\s+Showing/gi, 'Showing top')
    .replace(/Showing\s+Showing/gi, 'Showing')
    .replace(/(\d+)candidates/gi, '$1 candidates')
    .replace(/\s*Say\s+['"][^'"]*['"]\s*.*$/i, '')
    .trim();

  // Normalize all unicode dashes and 'to' to standard '-'
  const normalized = clean.replace(/[\u2010-\u2015\u2212]/g, '-').replace(/\s+to\s+/i, '-');

  // Pattern 1: "Showing top 1–50 of 312 candidates..." or "Showing 1-50 of 111 candidates..." or "Showing top 51–68 of 68 candidates."
  const rangeMatch = normalized.match(
    /Showing\s+(?:top\s+)?(?:Showing\s+)?(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/i
  );

  if (rangeMatch) {
    const parsedStart = parseInt(rangeMatch[1], 10);
    const parsedEnd = parseInt(rangeMatch[2], 10);
    const total = parseInt(rangeMatch[3], 10);
    const end = Math.min(total, Math.max(parsedEnd, candidatesCount));
    const hasMore = candidatesCount < total && end < total;

    // The container displays candidates accumulated from 1 up to end (or candidatesCount)
    clean =
      total === 1
        ? 'Showing 1 candidate.'
        : `Showing top 1–${end} of ${total} candidates.`;

    return {
      start: parsedStart,
      end,
      total,
      hasMore,
      cleanMessage: clean,
      isRangeMessage: true,
    };
  }

  // Pattern 2: "Showing top 50 of 312 candidates..." or "Showing 17 of 17" or "Showing 172 of 172 candidates"
  const countOfMatch = normalized.match(
    /Showing\s+(?:top\s+)?(?:Showing\s+)?(\d+)\s+of\s+(\d+)/i
  );

  if (countOfMatch) {
    const matchedCount = parseInt(countOfMatch[1], 10);
    const total = parseInt(countOfMatch[2], 10);
    const end = Math.min(total, Math.max(matchedCount, candidatesCount));
    const hasMore = candidatesCount < total && end < total;

    clean =
      total === 1
        ? 'Showing 1 candidate.'
        : `Showing top 1–${end} of ${total} candidates.`;

    return {
      start: 1,
      end,
      total,
      hasMore,
      cleanMessage: clean,
      isRangeMessage: true,
    };
  }

  // Pattern 3: "No more candidates — that's all 68."
  const allDoneMatch = normalized.match(/(?:that's|thats)\s+all\s+(\d+)/i);
  if (allDoneMatch) {
    const total = parseInt(allDoneMatch[1], 10);
    const end = Math.min(total, Math.max(total, candidatesCount));
    return {
      start: 1,
      end,
      total,
      hasMore: false,
      cleanMessage:
        total === 1
          ? 'Showing 1 candidate.'
          : `Showing top 1–${end} of ${total} candidates.`,
      isRangeMessage: true,
    };
  }

  // Fallback: Conversational explanation, guidance, or unsupported response
  const total = fallbackTotal ?? candidatesCount;
  const hasMore = candidatesCount < total;

  return {
    start: 1,
    end: candidatesCount,
    total,
    hasMore,
    cleanMessage: clean,
    isRangeMessage: false,
  };
};

export interface ConversationSearchBlock {
  id: string;
  userQuery: string;
  assistantCandidates: CopilotCandidateResult[];
  latestMessage?: string;
  totalCount?: number;
  hasMore: boolean;
  sessionId?: string;
}

const isPaginationQuery = (text?: string): boolean => {
  if (!text) return false;
  const normalized = text.trim().toLowerCase().replace(/[.!?,]/g, '');
  return (
    normalized === 'show more' ||
    normalized === 'more' ||
    normalized === 'next' ||
    normalized === 'next page' ||
    normalized === 'load more' ||
    normalized === 'more candidates' ||
    normalized === 'show more candidates' ||
    normalized === 'load more candidates' ||
    normalized.startsWith('show more') ||
    normalized.startsWith('load more') ||
    normalized.startsWith('next page')
  );
};

const isContinuationAssistantMessage = (content?: string): boolean => {
  if (!content) return false;
  const normalized = content.replace(/[\u2010-\u2015\u2212]/g, '-').replace(/\s+to\s+/i, '-');
  const rangeMatch = normalized.match(/Showing\s+(?:top\s+)?(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/i);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    return start > 1;
  }
  if (/no\s+more\s+candidates/i.test(normalized)) {
    return true;
  }
  return false;
};

const getCandidateUniqueKey = (cand: CopilotCandidateResult): string | null => {
  if (cand.application_id != null && String(cand.application_id).trim() !== '') {
    return `app-${String(cand.application_id).trim()}`;
  }
  if (cand.candidate_id != null && String(cand.candidate_id).trim() !== '') {
    return `cand-${String(cand.candidate_id).trim()}`;
  }
  return null;
};

const groupSessionIntoSearchBlocks = (
  messages: CopilotSessionMessage[],
  fallbackSessionId?: string
): ConversationSearchBlock[] => {
  const blocks: ConversationSearchBlock[] = [];
  let currentBlock: ConversationSearchBlock | null = null;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const role = (msg.role || '').toLowerCase().trim();

    if (role === 'user' || role === 'human') {
      if (isPaginationQuery(msg.content)) {
        // Pagination command - belongs to the current block, do not create a new block
        continue;
      }

      // If the NEXT message is an assistant continuation message (start > 1 or no more candidates),
      // this user message was asking for pagination/more results, so do not create a new block
      const nextMsg = messages[i + 1];
      if (
        nextMsg &&
        (nextMsg.role || '').toLowerCase().trim() === 'assistant' &&
        isContinuationAssistantMessage(nextMsg.content) &&
        blocks.length > 0
      ) {
        continue;
      }

      currentBlock = {
        id: msg.id || `query-${i}`,
        userQuery: msg.content,
        assistantCandidates: [],
        latestMessage: undefined,
        totalCount: undefined,
        hasMore: false,
        sessionId: fallbackSessionId,
      };
      blocks.push(currentBlock);
    } else if (role === 'assistant' || role === 'ai' || role === 'bot') {
      const incomingCandidates = msg.results || [];
      const parsedInfo = parseCandidateMessageInfo(
        msg.content,
        incomingCandidates.length
      );

      // If this assistant message indicates pagination continuation (start > 1 or no more candidates) and a block exists,
      // attach it to the preceding search block
      if (
        (parsedInfo.start > 1 || isContinuationAssistantMessage(msg.content)) &&
        blocks.length > 0
      ) {
        currentBlock = blocks[blocks.length - 1];
      } else if (!currentBlock) {
        currentBlock = {
          id: msg.id || `asst-block-${i}`,
          userQuery: '',
          assistantCandidates: [],
          latestMessage: undefined,
          totalCount: undefined,
          hasMore: false,
          sessionId: fallbackSessionId,
        };
        blocks.push(currentBlock);
      }

      if (incomingCandidates.length > 0) {
        currentBlock.assistantCandidates.push(...incomingCandidates);
      }

      const total = Math.max(
        parsedInfo.total,
        currentBlock.totalCount || 0,
        currentBlock.assistantCandidates.length
      );
      const count = currentBlock.assistantCandidates.length;
      currentBlock.totalCount = total;
      if (parsedInfo.isRangeMessage || count > 0) {
        currentBlock.latestMessage =
          total === 1
            ? 'Showing 1 candidate.'
            : `Showing top 1–${count} of ${total} candidates.`;
      } else {
        currentBlock.latestMessage = parsedInfo.cleanMessage;
      }
      currentBlock.hasMore = parsedInfo.hasMore && count < total;
    }
  }

  return blocks;
};

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
  const [isPaginating, setIsPaginating] = useState(false);
  const [liveAccumulatedCandidates, setLiveAccumulatedCandidates] = useState<CopilotCandidateResult[]>([]);

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

  // Auto-reset paginating status when streaming finishes
  useEffect(() => {
    if (!isStreaming) {
      setIsPaginating(false);
    }
  }, [isStreaming]);

  // Accumulate live streaming candidates across pagination calls into one list
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setLiveAccumulatedCandidates((prev) => {
        if (prev.length === 0) return [...candidates];
        return [...prev, ...candidates];
      });
    }
  }, [candidates]);

  // Execute Copilot Chat Stream search
  const handleExecuteSearch = useCallback(
    (searchQuery: string, sessionId?: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed || isStreaming) return;

      const activeSessionId =
        sessionId ||
        (currentSession ? String(currentSession.id) : undefined) ||
        (streamSessionId ? String(streamSessionId) : undefined);

      setIsPaginating(false);
      setLiveAccumulatedCandidates([]);
      setSubmittedQuery(trimmed);
      setQuery('');
      setIsHistoryOpen(false);

      // Trigger chat stream saga
      dispatch(chatStreamRequestAction({ query: trimmed, session_id: activeSessionId }));
    },
    [isStreaming, currentSession, streamSessionId, dispatch]
  );

  // Trigger pagination / load more candidates into the SAME container
  const handleLoadMore = useCallback(
    (sessionId?: string | number) => {
      const targetSessionId =
        sessionId ||
        (currentSession ? String(currentSession.id) : undefined) ||
        (streamSessionId ? String(streamSessionId) : undefined);

      if (!targetSessionId || isStreaming || isPaginating) {
        return;
      }

      setIsPaginating(true);
      dispatch(
        chatStreamRequestAction({
          query: 'show more',
          session_id: String(targetSessionId),
        })
      );
    },
    [currentSession, streamSessionId, isStreaming, isPaginating, dispatch]
  );

  // New Search reset
  const handleNewSearch = useCallback(() => {
    setIsPaginating(false);
    setLiveAccumulatedCandidates([]);
    setSubmittedQuery(null);
    setQuery('');
    dispatch(chatStreamResetAction());
    dispatch(clearCopilotSessionDetailAction());
    setIsHistoryOpen(false);
  }, [dispatch]);

  // Close talent search and go back
  const handleClose = useCallback(() => {
    goBack();
  }, []);

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

      setIsPaginating(false);
      setLiveAccumulatedCandidates([]);
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
      keyPrefix = 'stream',
      hasMore = false,
      isLoadingMore = false,
      onLoadMore?: () => void
    ) => {
      const hasCandidates = Boolean(candList && candList.length > 0);
      if (!hasCandidates && !messageText) return null;

      const parsedInfo = parseCandidateMessageInfo(messageText, candList.length, totalCount);
      const displayTotal = totalCount || parsedInfo.total || candList.length;

      const displayText =
        hasCandidates && parsedInfo.isRangeMessage
          ? parsedInfo.cleanMessage
          : messageText || parsedInfo.cleanMessage;

      return (
        <View key={`${keyPrefix}-card-wrap`}>
          {/* Results Header with Search Badge */}
          {displayText ? (
            <View style={styles.resultHeaderRow}>
              <View style={styles.searchIconBadge}>
                <SvgXml xml={searchIconSvg(activeBrandColor)} width={16} height={16} />
              </View>
              <Typography
                variant="regularTxtsm"
                color={colors.gray[900]}
                style={styles.resultHeaderText}
              >
                {displayText}
              </Typography>
            </View>
          ) : null}

          {/* Candidate Cards Container matching 3rd screenshot style */}
          {hasCandidates ? (
            <View
              style={[
                styles.resultsCard,
                candList.length === 1 && styles.resultsCardSingle,
                candList.length === 2 && styles.resultsCardDouble,
              ]}
            >
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                style={styles.resultsScroll}
                contentContainerStyle={styles.resultsScrollContent}
                scrollEventThrottle={16}
                onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                  if (!hasMore || isLoadingMore || !onLoadMore) return;
                  const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                  const isCloseToBottom =
                    layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
                  if (isCloseToBottom) {
                    onLoadMore();
                  }
                }}
              >
                {candList.map((cand, idx) => {
                  const jobTitle =
                    cand.applied_job_title ||
                    (typeof cand.job_title === 'string' ? cand.job_title : null) ||
                    'Software Engineer';
                  const locationText = getLocationText(cand);

                  return (
                    <Pressable
                      key={`${keyPrefix}-cand-${cand.application_id || cand.candidate_id || 'item'}-${idx}`}
                      style={styles.candidateCard}
                      onPress={() => handleSelectCandidate(cand)}
                      accessibilityRole="button"
                      accessibilityLabel={`View candidate ${cand.name}`}
                    >
                      <View style={styles.candidateCardLeft}>
                        <Typography
                          variant="semiBoldTxtmd"
                          color={colors.gray[900]}
                          numberOfLines={1}
                          style={styles.candidateName}
                        >
                          {cand.name || 'Unknown'}
                        </Typography>

                        {cand.email ? (
                          <Typography
                            variant="regularTxtxs"
                            color={colors.gray[500]}
                            numberOfLines={1}
                            style={styles.candidateEmail}
                          >
                            {cand.email}
                          </Typography>
                        ) : null}

                        <View style={styles.candidateMetaWrap}>
                          <View style={styles.candidateJobRow}>
                            <SvgXml xml={briefcaseIconSvg(activeBrandColor)} width={14} height={14} />
                            <Typography
                              variant="regularTxtsm"
                              color={colors.gray[700]}
                              numberOfLines={1}
                              style={styles.candidateJobText}
                            >
                              {jobTitle}
                            </Typography>
                          </View>

                          {locationText ? (
                            <View style={styles.candidateLocationRow}>
                              <SvgXml xml={pinIconSvg(colors.gray[500])} width={13} height={13} />
                              <Typography
                                variant="regularTxtsm"
                                color={colors.gray[600]}
                                numberOfLines={1}
                                style={styles.candidateLocationText}
                              >
                                {locationText}
                              </Typography>
                            </View>
                          ) : null}
                        </View>
                      </View>

                      <ResumeScoreBadge candidate={cand} />
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Container Footer with Pagination Count and Actions */}
              <View style={styles.tableFooter}>
                <Typography variant="regularTxtxs" color={colors.gray[500]}>
                  Showing{' '}
                  <Typography variant="semiBoldTxtxs" color={colors.gray[800]}>
                    {candList.length}
                  </Typography>{' '}
                  of{' '}
                  <Typography variant="semiBoldTxtxs" color={colors.gray[800]}>
                    {displayTotal}
                  </Typography>
                </Typography>

                {isLoadingMore ? (
                  <View style={styles.paginationLoadingRow}>
                    <ActivityIndicator size="small" color={activeBrandColor} />
                    <Typography variant="mediumTxtxs" color={activeBrandColor}>
                      Loading more candidates...
                    </Typography>
                  </View>
                ) : hasMore && onLoadMore ? (
                  <Pressable
                    style={styles.loadMoreButton}
                    onPress={onLoadMore}
                    accessibilityRole="button"
                    accessibilityLabel="Load more candidates"
                  >
                    <Typography variant="semiBoldTxtxs" color={activeBrandColor}>
                      Load more candidates ({Math.min(50, displayTotal - candList.length)} more)
                    </Typography>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      );
    },
    [activeBrandColor, brandColors, handleSelectCandidate, styles]
  );

  const activeSearchBlocks = useMemo(() => {
    const rawMessages = currentSession?.messages || [];
    const sessionIdStr = currentSession?.id ? String(currentSession.id) : undefined;
    const blocks = groupSessionIntoSearchBlocks(rawMessages, sessionIdStr);

    if (blocks.length > 0) {
      if (isPaginating && candidates.length > 0) {
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock.assistantCandidates.length < (lastBlock.totalCount || 0)) {
          lastBlock.assistantCandidates = [
            ...lastBlock.assistantCandidates,
            ...candidates,
          ];
        }

        const total = Math.max(lastBlock.totalCount || 0, lastBlock.assistantCandidates.length);
        const count = lastBlock.assistantCandidates.length;
        lastBlock.totalCount = total;
        lastBlock.latestMessage =
          total === 1
            ? 'Showing 1 candidate.'
            : `Showing top 1–${count} of ${total} candidates.`;
        lastBlock.hasMore = count < total;
      }
      return blocks;
    }

    const streamList =
      liveAccumulatedCandidates.length > 0 ? liveAccumulatedCandidates : candidates;

    if (
      streamList.length > 0 ||
      (submittedQuery && isStreaming) ||
      (submittedQuery && Boolean(streamResult?.message)) ||
      Boolean(streamResult?.message)
    ) {
      const parsedInfo = parseCandidateMessageInfo(
        streamResult?.message,
        streamList.length,
        streamResult?.result_total
      );
      const latestMsg =
        streamList.length > 0 && parsedInfo.isRangeMessage
          ? parsedInfo.cleanMessage
          : streamResult?.message || parsedInfo.cleanMessage;

      return [
        {
          id: 'live-stream-block',
          userQuery: submittedQuery || '',
          assistantCandidates: streamList,
          latestMessage: latestMsg,
          totalCount: parsedInfo.total,
          hasMore: parsedInfo.hasMore && streamList.length < parsedInfo.total,
          sessionId: streamSessionId || undefined,
        },
      ];
    }

    return [];
  }, [
    currentSession,
    isPaginating,
    candidates,
    liveAccumulatedCandidates,
    submittedQuery,
    isStreaming,
    streamResult,
    streamSessionId,
  ]);

  const isSearchActive = Boolean(
    submittedQuery ||
    isStreaming ||
    candidates.length > 0 ||
    currentSession ||
    currentSessionLoading ||
    streamResult?.message ||
    activeSearchBlocks.length > 0
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
            onPress={handleClose}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel="Close talent search"
          >
            <SvgXml xml={closeIconSvg(colors.gray[800])} width={20} height={20} />
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
                {currentSessionLoading && !activeSearchBlocks.length && (
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
                  <View style={styles.streamingStatusErrorBox}>
                    <Typography variant="regularTxtsm" color={colors.error[600]}>
                      {currentSessionError}
                    </Typography>
                  </View>
                )}

                {/* Render Grouped Search Blocks (All Candidates in ONE Container per Search) */}
                {activeSearchBlocks.map((block, blockIndex) => {
                  const isLastBlock = blockIndex === activeSearchBlocks.length - 1;
                  const isBlockPaginating = isLastBlock && isPaginating && isStreaming;

                  return (
                    <View key={block.id || `search-block-${blockIndex}`}>
                      {/* User Query Bubble */}
                      {block.userQuery ? (
                        <View style={styles.userBubbleContainer}>
                          <View style={styles.userBubble}>
                            <Typography variant="mediumTxtsm" color={colors.gray[900]}>
                              {block.userQuery}
                            </Typography>
                          </View>
                        </View>
                      ) : null}

                      {/* Single Table Container with All Candidates & Pagination */}
                      {renderCandidateTableCard(
                        block.assistantCandidates,
                        block.latestMessage,
                        block.totalCount,
                        block.id,
                        block.hasMore,
                        isBlockPaginating,
                        isLastBlock ? () => handleLoadMore(block.sessionId) : undefined
                      )}
                    </View>
                  );
                })}

                {/* Progressive Streaming Status Indicator (Initial query or follow-up query) */}
                {isStreaming && !isPaginating ? (
                  <View>
                    {submittedQuery &&
                    (!activeSearchBlocks.length ||
                      activeSearchBlocks[activeSearchBlocks.length - 1]?.userQuery !==
                        submittedQuery) ? (
                      <View style={styles.userBubbleContainer}>
                        <View style={styles.userBubble}>
                          <Typography variant="mediumTxtsm" color={colors.gray[900]}>
                            {submittedQuery}
                          </Typography>
                        </View>
                      </View>
                    ) : null}
                    <View style={styles.streamingStatusBox}>
                      <ActivityIndicator size="small" color={activeBrandColor} />
                      <Typography
                        variant="mediumTxtsm"
                        color={colors.gray[700]}
                        style={styles.streamingText}
                      >
                        {streamStatusMessage || 'Understanding your query…'}
                      </Typography>
                    </View>
                  </View>
                ) : null}

                {/* Error Banner */}
                {streamError ? (
                  <View style={styles.streamingStatusErrorBox}>
                    <Typography variant="regularTxtsm" color={colors.error[600]}>
                      {streamError}
                    </Typography>
                  </View>
                ) : null}
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
