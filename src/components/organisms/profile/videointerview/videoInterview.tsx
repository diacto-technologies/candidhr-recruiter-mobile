import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { colors } from '../../../../theme/colors';
import Typography from '../../../atoms/typography';
import { SvgXml } from 'react-native-svg';
import { arrowDown } from '../../../../assets/svg/arrowdown';
import { copyIcon } from '../../../../assets/svg/copy';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { getPersonalityScreeningListRequestAction, getPersonalityScreeningResponsesRequestAction } from '../../../../features/applications/actions';
import { selectPersonalityScreeningList, selectPersonalityScreeningResponses, selectSelectedApplication } from '../../../../features/applications/selectors';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import Dropdown from '../../dropdown';
import StatusDropdown from '../../dropdown/statusDropdown';
import { formatMonDDYYYY } from '../../../../utils/dateformatter';
import VideoPlayerBox from '../../../molecules/videoplayer';
import { getStatusColor } from '../../applicantlist/helper';
import AiSummary from '../resumescreening/aisummary';
import { sparkles } from '../../../../assets/svg/sparkles';
import { useStyles } from "./styles";
import { TranscriptionSegment } from '../../../../features/applications/types';
import Divider from '../../../atoms/divider';
import CopyText from '../../../molecules/copyText';


const STATUS_OPTIONS = [
  { id: "started", name: "Started" },
  { id: "assigned", name: "Assigned" },
  { id: "under_review", name: "Under Review" },
  { id: "completed", name: "Completed" },
  { id: "on_hold", name: "On Hold" },
  { id: "rejected", name: "Rejected" },
  { id: "shortlisted", name: "Shortlisted" },
  { id: "final_interview", name: "Scheduled Final Interview" },
  { id: "hired", name: "Hired" },
];

export default function VideoInterview() {
  const [activeTab, setActiveTab] = useState("Articulation");
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [responseDropdownOpen, setResponseDropdownOpen] = useState(false);
  const [transcriptionView, setTranscriptionView] = useState<'continuous' | 'bytime'>('continuous');
  const [currentTime, setCurrentTime] = useState(0);

  const dispatch = useAppDispatch();
  const styles = useStyles();
  const applicant = useAppSelector(selectSelectedApplication);
  const PersonalityScreeningList = useAppSelector(selectPersonalityScreeningList)
  const responses = useAppSelector(selectPersonalityScreeningResponses);

  useEffect(() => {
    if (!applicant?.id || !applicant?.job?.id) return;

    dispatch(
      getPersonalityScreeningListRequestAction({
        application_id: applicant?.id,
        job_id: applicant?.job.id,
      })
    );
  }, []);

  console.log(applicant?.id,"kkkkkkkkkkkkk",applicant?.job.id)
  


  useEffect(() => {
    if (!selectedSession) return;
    setActiveIndex(0);
    dispatch(
      getPersonalityScreeningResponsesRequestAction(selectedSession)
    );
  }, [selectedSession]);

  useEffect(() => {
    if (PersonalityScreeningList?.length && !selectedSession) {
      setSelectedSession(PersonalityScreeningList[0].id);
    }
  }, [PersonalityScreeningList]);

  const sessionOptions =
    PersonalityScreeningList?.map((item,index) => ({
      id: item.id,
      name: `Automated Video Interview`,
      status_text: item?.status_text ?? "—",
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
    if (selectedSession && PersonalityScreeningList?.length) {
      const currentSession = PersonalityScreeningList.find(item => item.id === selectedSession);
      if (currentSession?.status_text) {
        return mapStatusTextToId(currentSession.status_text);
      }
    }
    return '';
  }, [selectedSession, PersonalityScreeningList]);

  const screening = useMemo(() => {
    if (!PersonalityScreeningList?.length || !selectedSession) return null;

    return PersonalityScreeningList.find(
      item => item.id === selectedSession
    ) ?? null;
  }, [PersonalityScreeningList, selectedSession]);



  const summaryData = useMemo(() => {
    if (!screening?.summary) {
      return { score: null, text: "No summary available" };
    }

    const s = screening.summary;

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
  }, [screening, activeTab]);


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

  const handleCopyTranscription = async () => {
    const transcriptionText = getTranscriptionText();

  };

  const getTranscriptionText = () => {
    const currentResponse = responses?.[activeIndex];
    if (!currentResponse?.video_analysis) return "No transcription available";

    const analyses = currentResponse.video_analysis.audio_analyses;

    if (Array.isArray(analyses) && analyses.length) {
      // Usually all have same transcription – take first non-empty one
      const item = analyses.find(a => a?.transcription);
      if (item?.transcription) return item.transcription;
    }

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


  return (
    <View style={styles.container}>
      {/* <View style={{ zIndex: 9999 }}>
        <StatusDropdown
          label="Status"
          options={STATUS_OPTIONS}
          labelKey="name"
          valueKey="id"
          setValue={currentStatusId}
          onSelect={(item) => {
            // TODO: Add API call to update status here
            // The status will be updated for the current selectedSession
          }}
        />
      </View> */}
      <View style={{ zIndex: 1000 }}>
        <Dropdown
          label="Session"
          dropdownLabel="Session"
          options={sessionOptions}
          labelKey="name"
          valueKey="id"
          statusKey="status_text"
          setValue={selectedSession}
          onSelect={(item) => {
            setSelectedSession(item?.id);
          }}
          onChangeText={() => { }}
        />
      </View>
      <View style={styles.shortListedCard}>
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(PersonalityScreeningList?.find(item => item.id === selectedSession)?.status_text ?? "_") }]} />
            <Typography
              // key={item.id}
              variant="mediumTxtmd"
              color={colors.gray[900]}
            >
              Status {PersonalityScreeningList?.find(item => item.id === selectedSession)?.status_text ?? "_"}
            </Typography>
          </View>
          <SvgXml xml={arrowDown} />
        </View>
      </View>

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

      <View style={styles.shortListedCard}>
        <View style={{ flexDirection: "row", alignItems: 'center', gap: 8 }}>
          <SvgXml xml={sparkles} height={20} width={20} />
          <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
            Video Interview - AI Summary
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
                        <Typography variant="mediumTxtmd" color={colors.gray[900]}>
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
            <CopyText text={getTranscriptionText ?? ""} message="Transcription copied">
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
    </View>
  );
}
