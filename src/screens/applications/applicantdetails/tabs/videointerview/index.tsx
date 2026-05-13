import React, { useEffect, useState, useMemo } from 'react';
import { View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { getPersonalityScreeningListRequestAction, getPersonalityScreeningResponsesRequestAction, markSessionAsReviewedRequestAction } from '../../../../../features/applications/actions';
import { selectApplicationStages, selectAssessmentLogs, selectMarkSessionReviewedLoading, selectPersonalityScreeningAiSummary, selectPersonalityScreeningList, selectPersonalityScreeningLoading, selectPersonalityScreeningResponses, selectSelectedApplication } from '../../../../../features/applications/selectors';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useStyles } from "./styles";
import Dropdown from '../../../../../components/organisms/dropdown';
import Typography from '../../../../../components/atoms/typography';
import { arrowDown } from '../../../../../assets/svg/arrowdown';
import { sparkles } from '../../../../../assets/svg/sparkles';
import { colors } from '../../../../../theme/colors';
import { formatMonDDYYYY } from '../../../../../utils/dateformatter';
import Divider from '../../../../../components/atoms/divider';
import VideoPlayerBox from '../../../../../components/molecules/videoplayer';
import { TranscriptionSegment } from '../../../../../features/applications/types';
import { getStatusColor } from '../../../../../components/organisms/applicantlist/helper';
import { copyIcon } from '../../../../../assets/svg/copy';
import CopyText from '../../../../../components/molecules/copyText';
import StatusDropdown from '../../../../../components/organisms/dropdown/statusDropdown';
import Card from '../../../../../components/atoms/card';
import Button from '../../../../../components/atoms/button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getApprovalStageStatusOptions } from '../stageStatusOptions';
import Shimmer from '../../../../../components/atoms/shimmer';

const normalizeContentType = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

type VideoInterviewProps = {
  sessionContentId: string | null;
  onSessionContentIdChange: (id: string | null) => void;
};

export default function VideoInterview({
  sessionContentId,
  onSessionContentIdChange,
}: VideoInterviewProps) {
  const [activeTab, setActiveTab] = useState("Articulation");
  const [activeIndex, setActiveIndex] = useState(0);
  const [responseDropdownOpen, setResponseDropdownOpen] = useState(false);
  const [transcriptionView, setTranscriptionView] = useState<'continuous' | 'bytime'>('continuous');
  const [currentTime, setCurrentTime] = useState(0);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [selectedStageStatus, setSelectedStageStatus] = useState<string | null>(null);
  const [isResponsesLoading, setIsResponsesLoading] = useState(false);

  const dispatch = useAppDispatch();
  const styles = useStyles();
  const applicant = useAppSelector(selectSelectedApplication);
  const PersonalityScreeningList = useAppSelector(selectPersonalityScreeningList);
  const personalityLoading = useAppSelector(selectPersonalityScreeningLoading);
  const assessmentLogs = useAppSelector(selectAssessmentLogs);
  const filteredVideoLogs = useMemo(() => {
    const logs = assessmentLogs ?? [];
    return logs.filter(
      (l) => normalizeContentType(l?.content_type) === 'automated_video_interview'
    );
  }, [assessmentLogs]);
  const responses = useAppSelector(selectPersonalityScreeningResponses);
  /** Populated from GET screening responses `{ ai_summary, responses }` — not the list endpoint. */
  const personalityAiSummary = useAppSelector(selectPersonalityScreeningAiSummary);
  const stages = useAppSelector(selectApplicationStages);
  const loadingMarkReviewed = useAppSelector(selectMarkSessionReviewedLoading);

  // Detect orientation
  const { width, height } = screenData;
  const isLandscape = width > height;

  // Listen for dimension changes (orientation changes)
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // useEffect(() => {
  //   if (!applicant?.id || !applicant?.job?.id) return;

  //   dispatch(
  //     getPersonalityScreeningListRequestAction({
  //       application_id: applicant?.id,
  //       job_id: applicant?.job.id,
  //     })
  //   );
  // }, []);

  useEffect(() => {
    if (!sessionContentId) return;
    setActiveIndex(0);
    setIsResponsesLoading(true);
    dispatch(
      getPersonalityScreeningResponsesRequestAction(sessionContentId)
    );
  }, [sessionContentId, dispatch]);

  useEffect(() => {
    if (!sessionContentId) {
      setIsResponsesLoading(false);
      return;
    }
    if (!isResponsesLoading) return;
    if (responses?.length > 0 || personalityAiSummary) {
      setIsResponsesLoading(false);
      return;
    }
    // Fallback to avoid shimmer being stuck if API returns empty array
    const timeout = setTimeout(() => setIsResponsesLoading(false), 4000);
    return () => clearTimeout(timeout);
  }, [sessionContentId, isResponsesLoading, responses?.length, personalityAiSummary]);

  useEffect(() => {
    if (!filteredVideoLogs?.length) {
      onSessionContentIdChange(null);
      return;
    }
    const exists = filteredVideoLogs.some(
      (item) => item.content_id === sessionContentId
    );
    if (!sessionContentId || !exists) {
      onSessionContentIdChange(filteredVideoLogs[0]?.content_id ?? null);
    }
  }, [filteredVideoLogs, sessionContentId, onSessionContentIdChange]);

  useEffect(() => {
    const stageStatus = stages?.find(s => s.stage_type === "automated_video_interview")?.status;
    if (stageStatus) {
      setSelectedStageStatus(stageStatus);
    }
  }, [stages]);

  const sessionOptions =
    filteredVideoLogs?.map((item, index) => ({
      id: item.content_id,
      name: `Automated Video Interview`,
      status_text: item?.session_status ?? "—",
      raw: item,
    })) ?? [];

  // Map status_text to STATUS_OPTIONS id format
  const mapStatusTextToId = (statusText: string): string => {
    const statusMap: { [key: string]: string } = {
      'Started': 'started',
      'Assigned': 'assigned',
      'Under Review': 'under_review',
      'Completed': 'completed',
      'On Hold': 'on_hold',
      'Rejected': 'rejected',
      'Shortlisted': 'shortlisted',
      'Scheduled Final Interview': 'final_interview',
      'Hired': 'hired',
    };
    return statusMap[statusText] || '';
  };

  // Get current status id from selected session
  const currentStatusId = useMemo(() => {
    if (sessionContentId && PersonalityScreeningList?.length) {
      const currentSession = PersonalityScreeningList.find(item => item.id === sessionContentId);
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [sessionContentId, PersonalityScreeningList]);

  const screening = useMemo(() => {
    if (!PersonalityScreeningList?.length || !sessionContentId) return null;

    return (
      PersonalityScreeningList.find((item) => item.id === sessionContentId) ??
      PersonalityScreeningList.find((item) => item.id === responses[0]?.screening_id) ??
      null
    );
  }, [PersonalityScreeningList, sessionContentId, responses]);

  /** List `id` is screening id; session dropdown uses log `content_id` — responses payload carries `ai_summary`. */
  const summarySource = personalityAiSummary ?? screening?.summary ?? null;

  const summaryData = useMemo(() => {
    if (!summarySource) {
      return { score: null, text: "No summary available" };
    }

    const s = summarySource;

    switch (activeTab) {
      case "Articulation":
        return {
          score: s.articulation_score,
          text: s.articulation_exp,
        };

      case "Communication":
        return {
          score: s.communication_score,
          text: s.communication_exp,
        };

      case "Language":
        return {
          score: s.language_score,
          text: s.language_exp,
        };

      case "Logical Thinking":
        return {
          score: s.logical_thinking_score,
          text: s.logical_thinking_exp,
        };

      case "Technical":
        return {
          score: s.technical_score,
          text: s.technical_question_exp,
        };

      default:
        return { score: null, text: "No summary available" };
    }
  }, [summarySource, activeTab]);


  const scorePercent =
    summaryData.score !== null
      ? Math.round(summaryData.score * 10)
      : null;

  const convertSeconds = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTranscriptionText = () => {
    const currentResponse = responses?.[activeIndex];
    if (!currentResponse) return "No transcription available";

    const nested = currentResponse.video_analysis?.audio_analyses;
    if (Array.isArray(nested) && nested.length) {
      const item = nested.find((a) => a?.transcription);
      if (item?.transcription) return item.transcription;
    }

    const top = currentResponse.audio_analysis;
    if (Array.isArray(top) && top.length) {
      const item = top.find((a) => a?.transcription);
      if (item?.transcription) return item.transcription;
    }

    const t = (currentResponse as { text?: string }).text;
    if (typeof t === "string" && t.trim()) return t;

    return "No transcription available";
  };


  const getTranscriptionSegments = (): TranscriptionSegment[] => {
    const currentResponse = responses?.[activeIndex];

    if (!currentResponse) return [];

    // transcription_segments is on the RESPONSE, not inside video_analysis
    const segments = (currentResponse as any).transcription_segments;

    if (Array.isArray(segments)) {
      return segments.map((seg: any) => ({
        text: seg?.text ?? "",
        start: seg?.start ?? null,
        end: seg?.end ?? null,
        words: Array.isArray(seg?.words) ? seg.words : [],
      }));
    }

    return [];
  };


  const responseOptions = useMemo(() => {
    return responses.map((item, index) => ({
      label: item.question?.text ?? "—",
      value: index,
      original: item,
    }));
  }, [responses]);

  const selectedResponse = responses[activeIndex];

  const assessmentStatus =
    stages?.find(stage => stage.stage_type === "automated_video_interview")?.status
      ?.replace("_", " ")
      ?.replace(/\b\w/g, c => c.toUpperCase());

  const currentSessionLog = useMemo(
    () =>
      filteredVideoLogs?.find((item) => item.content_id === sessionContentId) ?? null,
    [filteredVideoLogs, sessionContentId]
  );
  const isReviewed = currentSessionLog?.session_status === 'reviewed';

  const videoStage = useMemo(
    () => stages?.find((s) => s.stage_type === 'automated_video_interview'),
    [stages]
  );
  const currentStageStatus = videoStage?.status ?? null;
  const STAGE_STATUS_OPTIONS = useMemo(() => {
    return getApprovalStageStatusOptions(currentStageStatus);
  }, [currentStageStatus]);

  /** While fetching responses for the selected session (list fetch is optional). */
  const showVideoContentShimmer =
    personalityLoading && !!sessionContentId;
  const showContentShimmer = showVideoContentShimmer || isResponsesLoading;

  const hasVideoSessionContent =
    (responses?.length ?? 0) > 0 || Boolean(personalityAiSummary);

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 9999 }}>
        <StatusDropdown
          label="Stages"
          options={STAGE_STATUS_OPTIONS}
          labelKey="name"
          valueKey="id"
          setValue={selectedStageStatus ?? currentStageStatus}
          onSelect={(item) => setSelectedStageStatus(item?.id)}
          openModalOnSelect
          changeStatusModalProps={{
            applicantName: applicant?.candidate?.name,
            entityId: videoStage?.id,
            currentStatus: currentStageStatus,
            newStatusOptions: STAGE_STATUS_OPTIONS,
            stageId: videoStage?.id ?? undefined,
            applicationId: applicant?.id ?? undefined,
            contentType: "Automated Video Interview",
            onUpdateStatus: (newStatusId) => {
              setSelectedStageStatus(newStatusId);
            },
          }}
        />
      </View>
      <View style={{ zIndex: 1000 }}>
        <Card style={{ gap: 4, flex: 1, width: '100%' }}>
          <Typography variant="regularTxtxs" style={{ backgroundColor: colors?.brand['200'], borderTopEndRadius: 12, borderTopStartRadius: 12, padding: 5 }} numberOfLines={2}>
            Stage was {assessmentStatus} by{" "}
            {stages?.find(s => s.stage_type === "automated_video_interview")?.reviewed_by?.name ??
              "Workflow"}{" "}
            on{" "}
            {formatMonDDYYYY(
              stages?.find(s => s.stage_type === "automated_video_interview")?.reviewed_at ??
              stages?.find(s => s.stage_type === "automated_video_interview")
                ?.workflow_status_updated_at,
              "DD MMM YYYY HH:mm",
              "IST"
            )}
          </Typography>
          <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
            <Dropdown
              label="Session"
              dropdownLabel="Session"
              options={sessionOptions}
              labelKey="name"
              valueKey="id"
              statusKey="status_text"
              setValue={sessionContentId ?? ''}
              onSelect={(item) => {
                onSessionContentIdChange(item?.id ?? null);
              }}
              onChangeText={() => { }}
            />
            <View style={styles.reviewRow}>
              {showContentShimmer ? (
                <>
                  <Shimmer style={{ flex: 1 }} width="100%" height={14} borderRadius={8} />
                  <Shimmer style={{ flex: 1 }} width="100%" height={30} borderRadius={20} />
                </>
              ) : (
                <>
                  <View style={{flex:2}}>
                    {isReviewed ?
                      <Typography variant="regularTxtxs" style={{ flex: 1 }}>
                        {filteredVideoLogs
                          ?.find(item => item.content_id === sessionContentId)
                          ?.action_taken_by?.name ? (
                          <>
                            Reviewed by{" "}
                            {
                              filteredVideoLogs.find(item => item.content_id === sessionContentId)
                                ?.action_taken_by?.name
                            }{" "}
                            ·{" "}
                            {formatMonDDYYYY(
                              filteredVideoLogs.find(item => item.content_id === sessionContentId)
                                ?.action_taken_at,
                              "DD MMM YYYY HH:mm",
                              "IST"
                            )}
                          </>
                        ) : filteredVideoLogs?.find(item => item.content_id === sessionContentId)
                          ?.workflow_status_updated_at ? (
                          <>
                            Reviewed by Workflow ·{" "}
                            {formatMonDDYYYY(
                              filteredVideoLogs.find(item => item.content_id === sessionContentId)
                                ?.workflow_status_updated_at,
                              "DD MMM YYYY HH:mm",
                              "IST"
                            )}
                          </>
                        ) : filteredVideoLogs?.find(item => item.content_id === sessionContentId)
                          ?.updated_at ? (
                          <>
                            ·{" "}
                            {formatMonDDYYYY(
                              filteredVideoLogs.find(item => item.content_id === sessionContentId)
                                ?.updated_at,
                              "DD MMM YYYY HH:mm",
                              "IST"
                            )}
                          </>
                        ) : null}
                      </Typography>
                      : null}
                  </View>
                  <Button
                    variant="outline"
                    borderRadius={20}
                    borderWidth={1}
                    borderColor={isReviewed ? colors.success[200] : colors.brand[200]}
                    buttonColor={isReviewed ? colors.success[400] : colors.brand[25]}
                    textColor={isReviewed ? colors.success[700] : colors.brand[700]}
                    startIcon={
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={isReviewed ? colors.success[700] : colors.brand[700]}
                      />
                    }
                    size={30}
                    paddingHorizontal={10}
                    style={{ flex: 1 }}
                    textVariant="mediumTxtxs"
                    onPress={() => {
                      if (currentSessionLog?.id && !isReviewed && !loadingMarkReviewed) {
                        dispatch(markSessionAsReviewedRequestAction(currentSessionLog.id));
                      }
                    }}
                    disabled={!currentSessionLog?.id || isReviewed || loadingMarkReviewed}
                  >
                    {loadingMarkReviewed
                      ? 'Marking…'
                      : isReviewed
                        ? 'Review completed'
                        : 'Mark as Reviewed'}
                  </Button>
                </>
              )}
            </View>
          </View>
        </Card>
      </View>
      {/* <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(PersonalityScreeningList?.find(item => item.id === sessionContentId)?.status_text ?? "_") }]} />
            <Typography
              // key={item.id}
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
              Status {PersonalityScreeningList?.find(item => item.id === sessionContentId)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View> */}
      {/* TIMELINE */}
      {/* <CustomTimeline
        progress={50}
        data={[
          { title: "Invited On", date: "22 Aug 2025, 12:26 pm", status: "completed" },
          { title: "Link Opened", date: "22 Aug 2025, 12:28 pm", status: "completed" },
          { title: "Started", date: "—", status: "current" },
          { title: "Completed", date: "—", status: "upcoming" },
        ]}
      /> */}
      {showContentShimmer ? (
        <View style={{ gap: 14, paddingVertical: 18 }}>
          <Shimmer width="40%" height={20} borderRadius={8} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Shimmer width="45%" height={14} borderRadius={8} />
            <Shimmer width="45%" height={14} borderRadius={8} />
          </View>
          <Shimmer width="100%" height={120} borderRadius={16} />
          <Shimmer width="100%" height={180} borderRadius={16} />
          <Shimmer width="100%" height={220} borderRadius={12} />
        </View>
      ) : !hasVideoSessionContent ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant="regularTxtmd" color={colors.gray[600]}>
            No responses available.
          </Typography>
        </View>
      ) : (
        <>
          <View style={styles.shortListedCard}>
            <View style={{ flexDirection: "row", alignItems: 'center', gap: 8 }}>
              <SvgXml xml={sparkles} height={20} width={20} />
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Video Interview — AI Summary
              </Typography>
            </View>

            <View style={{ flexDirection: 'row', overflow: 'hidden', flexWrap: 'wrap', gap: 8 }}>
              {["Articulation", "Communication", "Language", "Logical Thinking", "Technical"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, isActive && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Typography
                      variant="mediumTxtsm"
                      color={isActive ? colors.brand[700] : colors.gray[700]}
                    >
                      {tab}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.rowBetween}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  {activeTab} Analysis
                </Typography>

                {/* {scorePercent !== null && (
              <View style={styles.scoreBadge}>
                <Typography variant="mediumTxtxs" color={colors.orange[700]}>
                  Score: {scorePercent}%
                </Typography>
              </View>
            )} */}
              </View>

              <Typography
                variant="regularTxtsm"
                color={colors.gray[600]}
                style={styles.summaryText}
              >
                {summaryData.text}
              </Typography>
            </View>

          </View>

          {responses.length > 0 ? (
          <View style={styles.responsesCard}>
            <View style={styles.rowBetween}>
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                Responses
              </Typography>

              {responses.length > 0 && (
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {String(activeIndex + 1)}/{String(responses.length)}
                </Typography>
              )}
            </View>

            {/* Response Dropdown */}
            <View style={styles.responseDropdownWrapper}>
              <TouchableOpacity
                style={styles.responseDropdownButton}
                onPress={() => setResponseDropdownOpen(!responseDropdownOpen)}
              >
                <View style={styles.responseSelectedItem}>
                  {/* {selectedResponse?.video_thumbnail ? (
                <Image
                  source={{ uri: selectedResponse.video_thumbnail }}
                  resizeMode="cover"
                  style={styles.responseThumbnailSmall}
                />
              ) : (
                <View style={styles.thumbnailSmall} />
              )} */}
                  <View style={styles.responseSelectedContent}>
                    <Typography variant="mediumTxtmd" color={colors.gray[900]} numberOfLines={1}>
                      {selectedResponse?.question?.text ?? "—"}
                    </Typography>
                  </View>
                  <SvgXml xml={arrowDown} />
                </View>
              </TouchableOpacity>

              {responseDropdownOpen && (
                <View style={styles.responseDropdownContainer}>
                  <ScrollView nestedScrollEnabled style={styles.responseDropdownScroll}>
                    {responseOptions.map((item) => {
                      const responseItem = item.original;
                      const isActive = item.value === activeIndex;
                      return (
                        <TouchableOpacity
                          key={item.value}
                          style={[
                            styles.responseDropdownItem,
                            isActive && styles.responseDropdownItemActive,
                          ]}
                          onPress={() => {
                            setActiveIndex(item.value);
                            setResponseDropdownOpen(false);
                          }}
                        >
                          {responseItem?.video_thumbnail ? (
                            <Image
                              source={{ uri: responseItem.video_thumbnail }}
                              resizeMode="cover"
                              style={styles.responseThumbnail}
                            />
                          ) : (
                            <View style={styles.thumbnail} />
                          )}
                          <View style={styles.responseDropdownContent}>
                            <Typography variant="mediumTxtmd" color={colors.gray[900]} numberOfLines={4} ellipsizeMode="tail">
                              {responseItem.question?.text ?? "—"}
                            </Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[600]}>
                              {formatMonDDYYYY(responseItem?.started, "DD MMM YYYY HH:mm", "IST")}
                            </Typography>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Typography variant="regularTxtxs" color={colors.gray[700]}>
                  Duration: {convertSeconds(selectedResponse?.duration || 0)}
                </Typography>
              </View>

              <View style={styles.tag}>
                <Typography variant="regularTxtsm" color={colors.gray[600]}>
                  {formatMonDDYYYY(selectedResponse?.started, "DD MMM YYYY HH:mm", "IST")}
                </Typography>
              </View>
            </View>

            <View style={styles.mainVideoCard}>
              <VideoPlayerBox
                source={
                  selectedResponse?.video_file
                    ? selectedResponse.video_file
                    : ""
                }
                onProgress={(e) => setCurrentTime(e.currentTime || 0)}
              />
            </View>

            {/* Video Title */}
            {selectedResponse?.question?.text && (
              <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.videoTitle}>
                {selectedResponse.question.text}
              </Typography>
            )}
            <View style={styles.transcriptionSection}>
              <Divider />
              <View style={styles.transcriptionHeader}>
                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                  Transcription
                </Typography>
                <CopyText text={getTranscriptionText() ?? ""} message="Transcription copied">
                  <SvgXml xml={copyIcon} />
                </CopyText>
              </View>
              <View style={styles.transcriptionTabs}>
                <TouchableOpacity
                  style={[
                    styles.transcriptionTab,
                    transcriptionView === 'continuous' && styles.transcriptionTabActive,
                  ]}
                  onPress={() => setTranscriptionView('continuous')}
                >
                  <Typography
                    variant="mediumTxtsm"
                    color={transcriptionView === 'continuous' ? colors.brand[700] : colors.gray[700]}
                  >
                    Continuous
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.transcriptionTab,
                    transcriptionView === 'bytime' && styles.transcriptionTabActive,
                  ]}
                  onPress={() => setTranscriptionView('bytime')}
                >
                  <Typography
                    variant="mediumTxtsm"
                    color={transcriptionView === 'bytime' ? colors.brand[700] : colors.gray[700]}
                  >
                    By time
                  </Typography>
                </TouchableOpacity>
              </View>

              <View style={styles.transcriptionContent}>
                {transcriptionView === 'continuous' ? (
                  <Typography
                    variant="regularTxtsm"
                    color={colors.gray[700]}
                    style={styles.transcriptionText}
                  >
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {getTranscriptionSegments().map((seg, sIndex) =>
                        seg.words?.map((w, wIndex) => {
                          const isActive =
                            currentTime >= (w.start ?? 0) &&
                            currentTime <= (w.end ?? 0);

                          return (
                            <Typography
                              key={`${sIndex}-${wIndex}`}
                              variant="regularTxtsm"
                              style={{
                                backgroundColor: isActive ? colors.brand[200] : "transparent",
                                borderRadius: 6,
                              }}
                            >
                              {w.word + " "}
                            </Typography>
                          );
                        })
                      )}
                    </View>
                  </Typography>
                ) : (
                  <View style={styles.transcriptionSegments}>
                    {getTranscriptionSegments().map((segment, index) => {
                      const isActive =
                        currentTime >= (segment.start ?? 0) &&
                        currentTime <= (segment.end ?? 0);

                      return (
                        <View
                          key={index}
                          style={[
                            styles.transcriptionSegment,
                            // isActive && { backgroundColor: colors.brand[50] } // highlight color
                          ]}
                        >
                          <Typography
                            variant="regularTxtsm"
                            color={isActive ? colors.brand[700] : colors.gray[700]}
                            style={styles.transcriptionSegmentText}
                          >
                            {segment.text}
                          </Typography>

                          {segment.start !== undefined && segment.end !== undefined && (
                            <Typography
                              variant="regularTxtxs"
                              color={colors.gray[500]}
                              style={styles.transcriptionTimestamp}
                            >
                              {formatTime(segment.start)} - {formatTime(segment.end)}
                            </Typography>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          </View>
          ) : (
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                Question-level video and transcription will appear here when response data is available.
              </Typography>
            </View>
          )}
        </>
      )}
    </View>
  );
}
