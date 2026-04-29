import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import dayjs, { type Dayjs } from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextField } from '../../../../components/atoms';
import Card from '../../../../components/atoms/card';
import Typography from '../../../../components/atoms/typography';
import { Button, CommonDropdown } from '../../../../components';
import CustomSwitch from '../../../../components/atoms/switchbutton';
import { getApplicantOptionsRequestAction } from '../../../../features/applications/actions';
import {
  selectApplicantOptionsHasMore,
  selectApplicantOptionsList,
  selectApplicantOptionsLoading,
  selectApplicantOptionsPage,
  selectApplicantOptionsSearch,
} from '../../../../features/applications/selectors';
import { getJobNameListRequestAction } from '../../../../features/jobs/actions';
import { assignCandidatesRequestAction } from '../../../../features/assessments/actions';
import { assignCandidatesSuccess } from '../../../../features/assessments/slice';
import {
  selectAssignCandidatesError,
  selectAssignCandidatesLoading,
} from '../../../../features/assessments/selectors';
import {
  selectJobNameList,
  selectJobNameListHasMore,
  selectJobNameListLoading,
  selectJobNameListPage,
  selectJobNameListSearch,
} from '../../../../features/jobs/selectors';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { colors } from '../../../../theme/colors';
import ValidityDateTimeField from './validityDateTimeField';
import { CommonDropdownOption } from '../../../../components/organisms/commondropdown/types';
import type { ApplicantOptionItem } from '../../../../features/applications/types';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import { CUSTOM_MODAL_SCROLL_CONTENT_PADDING } from '../../../../components/organisms/custommodalwrapper';
import TagList from '../../../../components/molecules/taglist';

function splitEmailTokens(raw: string): string[] {
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Requires host with at least one dot (e.g. rejects `sndjdjdj@dd`); allows subdomains. */
function isValidInviteEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/i.test(trimmed);
}

function applicantAssignSubLabel(
  item: CommonDropdownOption
): string | undefined {
  const row = item as ApplicantOptionItem;
  const email = row.candidate?.email?.trim() ?? '';
  const title = row.job?.title?.trim() ?? '';
  if (!email && !title) {
    return undefined;
  }
  return [email, title].filter(Boolean).join(' · ');
}

function formatReminderExpiryLabel(h: number): string {
  if (h >= 24 && h % 24 === 0) {
    const d = h / 24;
    return `${d}d before expiry`;
  }
  return `${h}h before expiry`;
}

const REMINDER_PRESET_HOURS = [72, 48, 24, 12, 6, 2, 1] as const;

/** Pre-selected when user enables reminder emails (72h, 24h, 2h) */
const DEFAULT_REMINDER_HOURS: readonly number[] = [72, 24, 2];

export type AssignCandidatesModalContentProps = {
  onCancel: () => void;
  /** Current assessment blueprint id (POST /assessments/v2/assignments/). */
  blueprintId: string;
};

const AssignCandidatesModalContent = ({
  onCancel,
  blueprintId,
}: AssignCandidatesModalContentProps) => {
  const dispatch = useAppDispatch();
  const assignCandidatesLoading = useAppSelector(selectAssignCandidatesLoading);
  const assignCandidatesError = useAppSelector(selectAssignCandidatesError);
  const jobNameList = useAppSelector(selectJobNameList);
  const jobNameListLoading = useAppSelector(selectJobNameListLoading);
  const jobNameListHasMore = useAppSelector(selectJobNameListHasMore);
  const jobNameListPage = useAppSelector(selectJobNameListPage);
  const jobNameListSearch = useAppSelector(selectJobNameListSearch);
  const applicantOptionsList = useAppSelector(selectApplicantOptionsList);
  const applicantOptionsLoading = useAppSelector(selectApplicantOptionsLoading);
  const applicantOptionsHasMore = useAppSelector(selectApplicantOptionsHasMore);
  const applicantOptionsPage = useAppSelector(selectApplicantOptionsPage);
  const applicantOptionsSearch = useAppSelector(selectApplicantOptionsSearch);

  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [showJobFilter, setShowJobFilter] = useState(false);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [validFrom, setValidFrom] = useState<Dayjs>(() => dayjs());
  const [validTo, setValidTo] = useState<Dayjs | null>(null);
  const [reminderEmailsOn, setReminderEmailsOn] = useState(false);
  const [reminderHours, setReminderHours] = useState<Set<number>>(
    () => new Set(DEFAULT_REMINDER_HOURS)
  );
  const [customHoursDraft, setCustomHoursDraft] = useState('');
  /** Inline message when Assign fails validity checks (replaces toast). */
  const [validityRangeError, setValidityRangeError] = useState<string | null>(null);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteEmailDraft, setInviteEmailDraft] = useState('');
  const [inviteEmailError, setInviteEmailError] = useState<string | null>(null);

  /** Tracks an in-flight assign so we close the modal once loading finishes successfully. */
  const assignSubmittedRef = useRef(false);

  useEffect(() => {
    dispatch(assignCandidatesSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (
      assignSubmittedRef.current &&
      !assignCandidatesLoading &&
      !assignCandidatesError
    ) {
      assignSubmittedRef.current = false;
      onCancel();
    }
    if (
      assignSubmittedRef.current &&
      !assignCandidatesLoading &&
      assignCandidatesError
    ) {
      assignSubmittedRef.current = false;
    }
  }, [assignCandidatesLoading, assignCandidatesError, onCancel]);

  useEffect(() => {
    if (!showJobFilter) {
      return;
    }
    if (jobNameList.length > 0) {
      return;
    }
    dispatch(
      getJobNameListRequestAction({
        page: 1,
        search: '',
        append: false,
      })
    );
  }, [dispatch, jobNameList.length, showJobFilter]);

  useEffect(() => {
    setSelectedApplicantIds([]);
  }, [selectedJobId]);

  useEffect(() => {
    dispatch(
      getApplicantOptionsRequestAction({
        page: 1,
        jobId: selectedJobId ?? null,
        search: '',
        append: false,
      })
    );
  }, [dispatch, selectedJobId]);

  const handleJobOpen = useCallback(() => {
    if (jobNameListLoading) {
      return;
    }
    if (jobNameList.length > 0) {
      return;
    }
    dispatch(
      getJobNameListRequestAction({
        page: 1,
        search: '',
        append: false,
      })
    );
  }, [dispatch, jobNameList.length, jobNameListLoading]);

  const handleJobLoadMore = useCallback(() => {
    if (jobNameListLoading || !jobNameListHasMore) {
      return;
    }
    dispatch(
      getJobNameListRequestAction({
        page: jobNameListPage + 1,
        search: jobNameListSearch,
        append: true,
      })
    );
  }, [
    dispatch,
    jobNameListHasMore,
    jobNameListLoading,
    jobNameListPage,
    jobNameListSearch,
  ]);

  const handleJobChange = useCallback(
    (value: string | undefined, _option?: CommonDropdownOption) => {
      setSelectedJobId(value);
    },
    []
  );

  const handleApplicantOpen = useCallback(() => {
    if (applicantOptionsLoading) {
      return;
    }
    if (applicantOptionsList.length > 0) {
      return;
    }
    dispatch(
      getApplicantOptionsRequestAction({
        page: 1,
        jobId: selectedJobId ?? null,
        search: '',
        append: false,
      })
    );
  }, [
    applicantOptionsList.length,
    applicantOptionsLoading,
    dispatch,
    selectedJobId,
  ]);

  const handleApplicantLoadMore = useCallback(() => {
    if (applicantOptionsLoading || !applicantOptionsHasMore) {
      return;
    }
    dispatch(
      getApplicantOptionsRequestAction({
        page: applicantOptionsPage + 1,
        jobId: selectedJobId ?? null,
        search: applicantOptionsSearch,
        append: true,
      })
    );
  }, [
    applicantOptionsHasMore,
    applicantOptionsLoading,
    applicantOptionsPage,
    applicantOptionsSearch,
    dispatch,
    selectedJobId,
  ]);

  const handleApplicantsChange = useCallback(
    (
      value: string | string[] | undefined,
      _options?: CommonDropdownOption | CommonDropdownOption[]
    ) => {
      if (Array.isArray(value)) {
        setSelectedApplicantIds(value);
        return;
      }
      if (value != null && value !== '') {
        setSelectedApplicantIds([String(value)]);
        return;
      }
      setSelectedApplicantIds([]);
    },
    []
  );

  const addInviteEmails = useCallback(() => {
    const tokens = splitEmailTokens(inviteEmailDraft);
    if (tokens.length === 0) {
      setInviteEmailError(null);
      return;
    }
    const invalid = tokens.find((t) => !isValidInviteEmail(t));
    if (invalid) {
      setInviteEmailError(`Invalid email: ${invalid}.`);
      return;
    }

    setInviteEmails((prev) => {
      const seen = new Set(prev.map((e) => e.toLowerCase()));
      const next = [...prev];
      for (const t of tokens) {
        const key = t.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          next.push(t.trim());
        }
      }
      return next;
    });
    setInviteEmailDraft('');
    setInviteEmailError(null);
  }, [inviteEmailDraft]);

  const removeInviteEmail = useCallback((index: number) => {
    setInviteEmails((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getMinFromInstant = useCallback(() => dayjs(), []);
  const getMinToInstant = useCallback(() => {
    const now = dayjs();
    return validFrom.isAfter(now) ? validFrom : now;
  }, [validFrom]);

  useEffect(() => {
    setValidTo((t) => {
      if (!t) return t;
      return t.isBefore(validFrom) ? validFrom : t;
    });
  }, [validFrom]);

  useEffect(() => {
    if (validTo != null && validTo.isAfter(validFrom)) {
      setValidityRangeError(null);
    }
  }, [validFrom, validTo]);

  const setValidToFromOffsetDays = useCallback((d: 3 | 7 | 14) => {
    setValidTo(validFrom.add(d, 'day'));
  }, [validFrom]);

  const toggleReminderHour = useCallback((h: number) => {
    setReminderHours((prev) => {
      const next = new Set(prev);
      if (next.has(h)) {
        next.delete(h);
      } else {
        next.add(h);
      }
      return next;
    });
  }, []);

  const addCustomReminderHour = useCallback(() => {
    const n = parseInt(String(customHoursDraft).replace(/\D/g, ''), 10);
    if (Number.isNaN(n) || n < 1 || n > 720) {
      return;
    }
    setReminderHours((prev) => new Set(prev).add(n));
    setCustomHoursDraft('');
  }, [customHoursDraft]);

  const removeReminderHour = useCallback((h: number) => {
    setReminderHours((prev) => {
      const next = new Set(prev);
      next.delete(h);
      return next;
    });
  }, []);

  const scheduledReminderLabels = useMemo(
    () =>
      [...reminderHours]
        .sort((a, b) => b - a)
        .map((h) => ({
          hours: h,
          label: formatReminderExpiryLabel(h),
        })),
    [reminderHours]
  );

  /** Blueprint id, validity end, and at least one destination (applicants or invite emails). */
  const canAssign = useMemo(() => {
    const hasDestinations =
      selectedApplicantIds.length > 0 || inviteEmails.length > 0;
    return (
      Boolean(blueprintId?.trim()) &&
      validTo != null &&
      hasDestinations
    );
  }, [
    blueprintId,
    inviteEmails.length,
    selectedApplicantIds.length,
    validTo,
  ]);

  const handleAssignPress = useCallback(() => {
    if (!blueprintId?.trim()) {
      setValidityRangeError('Missing assessment. Go back and try again.');
      return;
    }
    if (!validTo) {
      setValidityRangeError('Select a Valid to date and time.');
      return;
    }
    if (!validTo.isAfter(validFrom)) {
      setValidityRangeError('Valid to must be after valid from.');
      return;
    }
    if (selectedApplicantIds.length === 0 && inviteEmails.length === 0) {
      setValidityRangeError(
        'Select at least one applicant or add an invite email.',
      );
      return;
    }

    setValidityRangeError(null);
    assignSubmittedRef.current = true;
    dispatch(
      assignCandidatesRequestAction({
        blueprint_id: blueprintId.trim(),
        application_ids: [...selectedApplicantIds],
        candidate_emails: [...inviteEmails],
        reminders_enabled: reminderEmailsOn,
        reminder_intervals: reminderEmailsOn
          ? [...reminderHours].sort((a, b) => a - b)
          : [],
        valid_from: validFrom.toISOString(),
        valid_to: validTo.toISOString(),
      })
    );
  }, [
    blueprintId,
    dispatch,
    inviteEmails,
    reminderEmailsOn,
    reminderHours,
    selectedApplicantIds,
    validFrom,
    validTo,
  ]);

  return (
    <View style={styles.assignModalContent}>
      <View style={styles.fieldBlock}>
        <View>
          <Typography variant="semiBoldTxtsm">Invite by email</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Add multiple emails separated by commas or spaces.
          </Typography>
        </View>
        <View style={styles.inviteEmailRow}>
          <View style={styles.inviteEmailInput}>
            <TextField
              placeholder="name@company.com"
              value={inviteEmailDraft}
              onChangeText={(text) => {
                setInviteEmailDraft(text);
                setInviteEmailError(null);
              }}
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={addInviteEmails}
              isError={inviteEmailError != null && inviteEmailError !== ''}
              error={inviteEmailError ?? undefined}
            />
          </View>
          <Button size={40} paddingHorizontal={14} onPress={addInviteEmails}>
            + Add
          </Button>
        </View>
        {inviteEmails.length > 0 ? (
          <TagList
            data={inviteEmails}
            onRemove={removeInviteEmail}
            bgColor={colors.brand[25]}
            borderColor={colors.brand[200]}
            textColor={colors.brand[600]}
          />
        ) : null}
      </View>

      <View style={styles.fieldBlock}>
        <View>
          <Typography variant="semiBoldTxtsm">Select existing applicants</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Search applicants or filter by job to bulk-select.
          </Typography>
        </View>
        {!showJobFilter &&
          <View style={styles.addFilterRow}>
            <Button
              size={40}
              paddingHorizontal={12}
              onPress={() => setShowJobFilter(true)}
            >
              +Add Filter
            </Button>
          </View>
        }
        {showJobFilter ? (
          <CommonDropdown
            placeholder="Job"
            options={jobNameList}
            value={selectedJobId}
            onChange={handleJobChange}
            labelKey="title"
            valueKey="id"
            searchable
            searchPlaceholder="Search jobs"
            searchField="label"
            mode="default"
            dropdownPosition="bottom"
            onOpen={handleJobOpen}
            onLoadMore={handleJobLoadMore}
          />
        ) : null}
        <CommonDropdown
          placeholder="Search applicants"
          options={applicantOptionsList}
          value={selectedApplicantIds}
          onChange={handleApplicantsChange}
          labelKey="name"
          valueKey="id"
          multiSelect
          multiSelectCheckbox
          showSelectAllOption={selectedJobId != null}
          searchable
          searchPlaceholder="Search applicants"
          searchField="label"
          mode="default"
          dropdownPosition="bottom"
          onOpen={handleApplicantOpen}
          onLoadMore={handleApplicantLoadMore}
          subLabelBuilder={applicantAssignSubLabel}
        />
      </View>

      <View style={styles.fieldBlock}>
        <View>
          <Typography variant="semiBoldTxtsm">Validity window</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>
            Candidates can access the assessment only within this time range.
          </Typography>
        </View>
        <View style={styles.validityRow}>
          <View style={styles.validityCol}>
            <Typography variant="mediumTxtsm">Valid from</Typography>
            <ValidityDateTimeField
              value={validFrom}
              onChange={setValidFrom}
              getMinInstant={getMinFromInstant}
              modalTitle="Valid from"
            />
            {validityRangeError != null && validityRangeError !== '' ? (
              <Typography
                variant="regularTxtsm"
                color={colors.error[600]}
                style={styles.validityErrorText}
              >
                {validityRangeError}
              </Typography>
            ) : null}
          </View>
          <View style={styles.validityCol}>
            <View style={styles.validToHeader}>
              <Typography variant="mediumTxtsm">Valid to</Typography>
            </View>
            <ValidityDateTimeField
              value={validTo}
              onChange={setValidTo}
              getMinInstant={getMinToInstant}
              modalTitle="Valid to"
            />
            <View style={styles.quickAddRow}>
              <Pressable
                onPress={() => setValidToFromOffsetDays(3)}
                hitSlop={4}
              >
                <Typography variant="regularTxtsm" color={colors.brand[600]}>
                  +3d
                </Typography>
              </Pressable>
              <Pressable
                onPress={() => setValidToFromOffsetDays(7)}
                hitSlop={4}
              >
                <Typography variant="regularTxtsm" color={colors.brand[600]}>
                  +7d
                </Typography>
              </Pressable>
              <Pressable
                onPress={() => setValidToFromOffsetDays(14)}
                hitSlop={4}
              >
                <Typography variant="regularTxtsm" color={colors.brand[600]}>
                  +14d
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <Card style={styles.assignReminderCard}>
        <View style={styles.reminderHeaderRow}>
          <View style={styles.reminderHeaderLeft}>
            <View style={styles.reminderIconWrap}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.brand[600]}
              />
            </View>
            <View style={styles.toggleCopy}>
              <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                Reminder emails
              </Typography>
              <Typography variant="regularTxtsm" color={colors.gray[600]}>
                {reminderEmailsOn
                  ? `${reminderHours.size} reminder${reminderHours.size === 1 ? '' : 's'
                  } scheduled`
                  : 'Automatically notify candidates before deadline'}
              </Typography>
            </View>
          </View>
          <CustomSwitch
            value={reminderEmailsOn}
            onValueChange={setReminderEmailsOn}
            backgroundActive={colors.brand[600]}
            backgroundInactive={colors.gray[200]}
            circleActiveColor={colors.base.white}
            circleInActiveColor={colors.base.white}
          />
        </View>
        {/* <Divider/> */}

        {reminderEmailsOn ? (
          <View style={styles.reminderExpand}>
            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              Select intervals before expiry
            </Typography>
            <View style={styles.intervalChipsRow}>
              {REMINDER_PRESET_HOURS.map((h) => {
                const selected = reminderHours.has(h);
                return (
                  <Pressable
                    key={h}
                    onPress={() => toggleReminderHour(h)}
                    style={[
                      styles.intervalChip,
                      selected && styles.intervalChipSelected,
                    ]}
                  >
                    <Typography
                      variant="mediumTxtxs"
                      color={selected ? colors.base.white : colors.gray[800]}
                    >
                      {`${h}h`}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>

            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              Custom interval (hours before expiry)
            </Typography>
            <View style={styles.customIntervalRow}>
              <View style={styles.customIntervalInput}>
                <TextField
                  placeholder="e.g. 8"
                  value={customHoursDraft}
                  onChangeText={setCustomHoursDraft}
                  keyboardType="number-pad"
                />
              </View>
              <Button size={40} paddingHorizontal={14} onPress={addCustomReminderHour}>
                + Add
              </Button>
            </View>

            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              Scheduled reminders
            </Typography>
            <View style={styles.reminderTagsRow}>
              {scheduledReminderLabels.length === 0 ? (
                <Typography variant="regularTxtsm" color={colors.gray[500]}>
                  Select intervals above.
                </Typography>
              ) : (
                scheduledReminderLabels.map(({ hours, label }) => (
                  <View key={hours} style={styles.reminderTag}>
                    <View style={styles.reminderTagDot} />
                    <Typography variant="regularTxtsm" color={colors.gray[800]}>
                      {label}
                    </Typography>
                    <Pressable
                      onPress={() => removeReminderHour(hours)}
                      hitSlop={8}
                      accessibilityLabel="Remove reminder"
                    >
                      <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        ×
                      </Typography>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          </View>
        ) : null}
      </Card>
      <FooterButtons
        footerStyle={styles.footerBar}
        leftButtonProps={{
          children: 'Cancel',
          size: 44,
          buttonColor: colors.base.white,
          textColor: colors.gray[700],
          borderColor: colors.gray[300],
          borderWidth: 1,
          borderRadius: 8,
          borderGradientOpacity: 0.25,
          shadowColor: colors.gray[700],
          onPress: onCancel,
        }}
        rightButtonProps={{
          children: 'Assign candidates',
          size: 44,
          disabled: !canAssign || assignCandidatesLoading,
          isLoading: assignCandidatesLoading,
          borderWidth: 1,
          buttonColor: colors.brand[600],
          textColor: canAssign ? colors.base.white : colors.gray[400],
          borderColor: colors.base.white,
          borderRadius: 8,
          onPress: handleAssignPress,
        }}
      />
    </View>
  );
};

export default AssignCandidatesModalContent;

const styles = StyleSheet.create({
  assignModalContent: {
    gap: 16
  },
  footerBar: {
    marginHorizontal: -CUSTOM_MODAL_SCROLL_CONTENT_PADDING,
    paddingHorizontal: 16,
  },
  fieldBlock: {
    gap: 8,
  },
  inviteEmailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  inviteEmailInput: {
    flex: 1,
    minWidth: 0,
  },
  addFilterRow: {
    alignSelf: 'flex-start',
  },
  validityRow: {
    //flexDirection: 'row',
    gap: 10,
  },
  validityCol: {
    flex: 1,
    gap: 6,
  },
  validityErrorText: {
    marginTop: 2,
  },
  validToHeader: {
    gap: 4,
  },
  quickAddRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    gap: 8,
  },
  assignReminderCard: {
    padding: 14,
    borderRadius: 12,
    gap: 12,
    backgroundColor: colors.base.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  reminderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  reminderHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.brand[50],
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  reminderExpand: {
    gap: 10,
  },
  intervalChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  intervalChip: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    backgroundColor: colors.base.white,
  },
  intervalChipSelected: {
    backgroundColor: colors.brand[600],
    borderColor: colors.brand[600],
  },
  customIntervalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  customIntervalInput: {
    flex: 1,
  },
  reminderTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  reminderTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand[500],
  },
});
