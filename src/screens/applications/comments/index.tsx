import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { Header } from '../../../components/organisms';
import { goBack } from '../../../utils/navigationUtils';
import { FloatingActionButton, TextField, Typography } from '../../../components/atoms';
import { sendButton } from '../../../assets/svg/send';
import CustomSafeAreaView from '../../../components/atoms/customsafeareaview';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { DropdownMenu } from '../../../components/molecules/dropdownmenu';
import { deleteIcon } from '../../../assets/svg/deleteicon';
import { editAvatarIcon } from '../../../assets/svg/editavatar';
import { ConfirmModal } from '../../../components';
import {
  selectSelectedApplication,
  selectApplicationReasonsList,
  selectApplicationReasonsListLoading,
  selectApplicationReasonsListError,
  selectReasonCategoryList,
  selectReasonList,
  selectReasonListLoading,
  selectReasonListError,
  selectAddApplicationReasonsLoading,
} from '../../../features/applications/selectors';
import {
  addApplicationReasonsRequestAction,
  getApplicationReasonsListRequestAction,
  getReasonCategoryListRequestAction,
  getReasonListRequestAction,
  updateApplicationReasonRequestAction,
} from '../../../features/applications/actions';
import {
  selectCommentsList,
  selectCommentsLoading,
  selectCommentsError,
  selectCreateCommentLoading,
} from '../../../features/comments/selectors';
import {
  getCommentsRequestAction,
  createCommentRequestAction,
  updateCommentRequestAction,
  deleteCommentRequestAction,
} from '../../../features/comments/actions';
import { formatMonDDYYYY } from '../../../utils/dateformatter';
import { CustomAvatar } from '../../../components/atoms/avatar';
import { SvgXml } from 'react-native-svg';
import { horizontalThreedotIcon } from '../../../assets/svg/horizontalthreedoticon';
import { CommonDropdown } from '../../../components/organisms';
import type { ReasonListItem } from '../../../features/applications/types';
import { useStyles } from "./styles";
import Shimmer from '../../../components/atoms/shimmer';

/** Application reasons item (has reason[].note) */
interface ApplicationReasonItem {
  id: string;
  user: { id?: string; name?: string; email?: string, profile_pic?: string };
  content_type: string;
  object_id?: string;
  reason: Array<{ id?: string; note?: string }>;
  created_at: string;
}

/** Comment from GET /comments/v1/comments/ (has text) */
interface CommentItem {
  id: string;
  user?: { name?: string; email?: string; profile_pic?: string };
  content_type?: string;
  text?: string;
  created_at: string;
}

type CommentsRouteParams = { application_id?: string; job_id?: string };

function toDisplayItem(
  item: ApplicationReasonItem | CommentItem,
  isReason: boolean
): {
  profile_pic: string | null | undefined;
  id: string;
  name: string;
  tag: string;
  email: string;
  date: string;
  text: string;
  reasonNotes?: string[];
  created_at: string;
  kind: 'reason' | 'comment';
} {
  const created_at = item.created_at;
  const base = {
    id: item.id,
    name: item.user?.name ?? 'Unknown',
    profile_pic: item?.user?.profile_pic,
    tag: (item as ApplicationReasonItem).content_type ?? (item as CommentItem).content_type ?? '',
    email: item.user?.email ?? '',
    date: formatMonDDYYYY(created_at, 'DD MMM YYYY'),
    created_at,
  };
  if (isReason) {
    const r = item as ApplicationReasonItem;
    const reasonNotes = (r.reason ?? []).map((x) => x.note?.trim()).filter(Boolean) as string[];
    const text = reasonNotes.join(' ') || '—';
    return { ...base, text, reasonNotes, kind: 'reason' };
  }
  return { ...base, text: (item as CommentItem).text ?? '—', kind: 'comment' };
}

export default function CommentsScreen() {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<{ params: CommentsRouteParams }, 'params'>>();
  const application = useAppSelector(selectSelectedApplication);

  const applicationId = route.params?.application_id ?? application?.id ?? '';
  const jobId = route.params?.job_id ?? application?.job?.id;

  const applicationReasonsList = useAppSelector(selectApplicationReasonsList) as ApplicationReasonItem[];
  const reasonsLoading = useAppSelector(selectApplicationReasonsListLoading);
  const reasonsError = useAppSelector(selectApplicationReasonsListError);

  const commentsList = useAppSelector(selectCommentsList) as CommentItem[];
  const commentsLoading = useAppSelector(selectCommentsLoading);
  const commentsError = useAppSelector(selectCommentsError);
  const createLoading = useAppSelector(selectCreateCommentLoading);
  const updateLoading = useAppSelector((state: any) => state.comments?.updateLoading ?? false);

  const reasonCategories = useAppSelector(selectReasonCategoryList);
  const reasonList = useAppSelector(selectReasonList) as ReasonListItem[];
  const reasonListLoading = useAppSelector(selectReasonListLoading);
  const reasonListError = useAppSelector(selectReasonListError);
  const addReasonSaving = useAppSelector(selectAddApplicationReasonsLoading);

  const loading = reasonsLoading || commentsLoading;
  const [commentText, setCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingOriginalText, setEditingOriginalText] = useState<string>('');
  const [editingReasonId, setEditingReasonId] = useState<string | null>(null);
  const [editingReasonObjectId, setEditingReasonObjectId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedReasonIds, setSelectedReasonIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetText, setDeleteTargetText] = useState<string>('');
  const [deleteTargetKind, setDeleteTargetKind] = useState<'comment' | 'reason'>('comment');
  const [dropdownLayout, setDropdownLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const menuTriggerRefs = useRef<Record<string, View | null>>({});

  useEffect(() => {
    if (applicationId) {
      dispatch(getApplicationReasonsListRequestAction());
      dispatch(getCommentsRequestAction({ application_id: applicationId, ...(jobId && { job_id: jobId }) }));
    }
  }, [dispatch, applicationId, jobId]);

  useEffect(() => {
    dispatch(getReasonCategoryListRequestAction());
    dispatch(getReasonListRequestAction(1));
  }, [dispatch]);

  useEffect(() => {
    if (!activeCommentId) {
      setDropdownLayout(null);
      return;
    }
    const ref = menuTriggerRefs.current[activeCommentId];
    if (ref && 'measureInWindow' in ref) {
      (ref as any).measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          setDropdownLayout({ x, y, width, height });
        }
      );
    }
  }, [activeCommentId]);

  const handleSend = () => {
    const text = commentText.trim();
    if (!text || !applicationId) return;

    // If we're editing an existing comment, update it instead of creating.
    if (editingCommentId) {
      if (text === editingOriginalText.trim()) return;
      dispatch(updateCommentRequestAction({ id: editingCommentId, text }));
      setEditingCommentId(null);
      setEditingOriginalText('');
      setCommentText('');
      return;
    }

    dispatch(
      createCommentRequestAction({
        application: applicationId,
        job: jobId ?? applicationId,
        content_type: 'Application',
        object_id: applicationId,
        text,
      })
    );
    setCommentText('');
  };

  const reasonsDisplay = applicationReasonsList.map((item) => toDisplayItem(item, true));
  const commentsDisplay = commentsList.map((item) => toDisplayItem(item, false));
  const merged = [...reasonsDisplay, ...commentsDisplay].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const comments = merged;
  const error = reasonsError;
  const showError = error && merged.length === 0;
  const activeComment = activeCommentId
    ? comments.find((c) => c.id === activeCommentId) ?? null
    : null;

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetText('');
    setDeleteTargetKind('comment');
  };

  const reasonDropdownOptions = useMemo(() => {
    const categorySet = selectedCategories.length > 0 ? new Set(selectedCategories) : null;
    const filtered = categorySet
      ? reasonList.filter((item) => {
          if (!item.category) return true;
          const categoryId = item.category.toLowerCase().replace(/\s+/g, '_');
          return categorySet.has(categoryId);
        })
      : reasonList;
    return filtered.map((item) => ({
      id: item.id,
      name: item.note?.trim() || '(No note)',
    }));
  }, [reasonList, selectedCategories]);

  const closeReasonEditor = () => {
    setEditingReasonId(null);
    setEditingReasonObjectId(null);
    setSelectedCategoryId(null);
    setSelectedCategories([]);
    setSelectedReasonIds([]);
  };

  const addReason = editingReasonId != null;

  const normalizeReasonIds = (nextValue: any): string[] => {
    if (Array.isArray(nextValue)) {
      return nextValue
        .map((v) => (typeof v === 'string' ? v : v?.id))
        .filter(Boolean);
    }
    if (typeof nextValue === 'string') return [nextValue];
    if (nextValue?.id) return [nextValue.id];
    return [];
  };

  const saveReasonEdit = (contentType: string) => {
    if (!applicationId || !jobId) return;
    const object_id = editingReasonObjectId ?? editingReasonId;
    if (!object_id) return;
    dispatch(
      addApplicationReasonsRequestAction({
        application: applicationId,
        job_id: jobId,
        content_type: contentType,
        object_id,
        reason: selectedReasonIds,
      })
    );
    closeReasonEditor();
  };

  const renderCommentsShimmer = () => (
    <View style={{ paddingVertical: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={`comments-shimmer-${i}`} style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.userRow}>
              <Shimmer width={40} height={40} borderRadius={20} />
              <View style={{ flex: 1, gap: 8, paddingTop: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Shimmer width="38%" height={14} borderRadius={6} />
                  <Shimmer width={52} height={16} borderRadius={8} />
                </View>
                <Shimmer width="68%" height={12} borderRadius={6} />
                <Shimmer width="46%" height={12} borderRadius={6} />
              </View>
            </View>
            <View style={styles.rightRow}>
              <Shimmer width={18} height={18} borderRadius={9} />
            </View>
          </View>

          <View style={{ marginTop: 10, gap: 8 }}>
            <Shimmer width="92%" height={12} borderRadius={6} />
            <Shimmer width="72%" height={12} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Header title="Comments" backNavigation onBack={goBack} />

        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {loading ? renderCommentsShimmer() : null}
            {!loading && showError && (
              <Typography variant="regularTxtsm" color={colors.gray[600]} style={styles.errorText}>
                {error}
              </Typography>
            )}
            {!loading && !showError && comments.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.headerRow}>
                  <View style={styles.userRow}>
                    <CustomAvatar
                      imageUrl={item?.profile_pic ?? undefined}
                      name={item?.name}
                      size={40}
                      borderWidth={1}
                      borderColor="rgba(0,0,0,0.08)"
                    />
                    <View>
                      <View style={styles.nameRow}>
                        <Typography variant="semiBoldTxtmd">
                          {item.name}
                        </Typography>
                        <View style={styles.tag}>
                          <Typography
                            variant="semiBoldTxtxs"
                            color={colors.brand[800]}
                            numberOfLines={1}
                          >
                            {item.tag}
                          </Typography>
                        </View>
                      </View>
                      <Typography
                        variant="regularTxtsm"
                        color={colors.gray[600]}
                      >
                        Email: {item.email}
                      </Typography>
                      <Typography
                        variant="regularTxtsm"
                        color={colors.gray[600]}
                      >
                        Date: {item.date}
                      </Typography>
                    </View>
                  </View>
                  <View style={styles.rightRow}>
                    <View
                      ref={(el) => {
                        menuTriggerRefs.current[item.id] = el;
                      }}
                      collapsable={false}
                    >
                      <TouchableOpacity
                        style={styles.menuDot}
                        onPress={() => setActiveCommentId(item.id)}
                      >
                       <SvgXml xml={horizontalThreedotIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {item.kind === 'reason' ? (
                  <View style={styles.reasonPillsWrap}>
                    {(item.reasonNotes?.length ? item.reasonNotes : [item.text]).map((note, idx) => (
                      <View key={`${item.id}-reason-${idx}`} style={styles.reasonPill}>
                        <Typography variant="regularTxtsm" color={colors.gray[700]}>
                          {note}
                        </Typography>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.commentText}>
                    {item.text}
                  </Typography>
                )}

                {item.kind === 'reason' && editingReasonId === item.id ? (
                  <View style={styles.reasonInlineEditor}>
                    <Typography variant="semiBoldTxtmd" color={colors.gray[800]}>
                      Categories
                    </Typography>
                    {addReason ? (
                      <View style={{ gap: 12 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                          {reasonCategories.map((cat) => {
                            const selected = selectedCategories.includes(cat.id);

                            return (
                              <Pressable
                                key={cat.id}
                                onPress={() => {
                                  const nextSelectedCategories = selected
                                    ? selectedCategories.filter((id) => id !== cat.id)
                                    : [...selectedCategories, cat.id];

                                  setSelectedCategories(nextSelectedCategories);
                                  setSelectedCategoryId(nextSelectedCategories[0] ?? null);
                                }}
                                style={[styles.categoryPill, selected && styles.categoryPillSelected]}
                              >
                                <Typography
                                  variant="mediumTxtsm"
                                  color={selected ? colors.brand[700] : colors.gray[700]}
                                >
                                  {cat.name}
                                </Typography>
                              </Pressable>
                            );
                          })}
                        </View>

                        <CommonDropdown
                          placeholder="Select a reason"
                          options={reasonDropdownOptions}
                          value={selectedReasonIds}
                          onChange={(nextValue) => setSelectedReasonIds(normalizeReasonIds(nextValue))}
                          labelKey="name"
                          valueKey="id"
                          showIndexAndTotal={false}
                          mode="default"
                          dropdownPosition="bottom"
                          disabled={reasonListLoading}
                          error={reasonListError ?? undefined}
                          multiSelect
                        />
                      </View>
                    ) : null}

                    <View style={styles.reasonEditActions}>
                      <TouchableOpacity style={styles.reasonEditCancel} onPress={closeReasonEditor}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                          Cancel
                        </Typography>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.reasonEditSave,
                          (addReasonSaving || selectedReasonIds.length === 0) && styles.reasonEditSaveDisabled,
                        ]}
                        onPress={() => {
                          const ct =
                            (item.kind === 'reason' && item.tag) || 'Application';
                          saveReasonEdit(ct);
                        }}
                        disabled={addReasonSaving || selectedReasonIds.length === 0}
                      >
                        <Typography variant="semiBoldTxtsm" color={colors.base.white}>
                          {addReasonSaving ? 'Saving…' : 'Save'}
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>

        <Typography variant="regularTxtxs" color={colors.gray[800]} style={styles.hintText}>
          Share your thoughts about this profile with your team.
        </Typography>
        <View style={styles.commentContainer}>
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="Write your comment here..."
              size="Medium"
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <View style={styles.buttonRow}>
            <FloatingActionButton
              value={sendButton}
              backgroundColor={colors.brand[600]}
              iconColor={colors.base.white}
              size={40}
              onPress={handleSend}
              disabled={createLoading || !commentText.trim()}
            />
          </View>
        </View>
      </View>

      <DropdownMenu
        visible={!!activeCommentId}
        onClose={() => setActiveCommentId(null)}
        iconWidth={16}
        iconHight={16}
        position={
          dropdownLayout
            ? {
              left: dropdownLayout.x + dropdownLayout.width - 140,
              top: dropdownLayout.y + dropdownLayout.height - 5,
            }
            : { left: 0, top: 0 }
        }
        items={
          activeComment
            ? [
              {
                label: 'Edit',
                icon: editAvatarIcon,
                onPress: () => {
                  if (activeComment.kind === 'comment') {
                    // Edit uses the existing bottom input field.
                    const initial = (activeComment.text ?? '').trim();
                    setEditingCommentId(activeComment.id);
                    setEditingOriginalText(initial);
                    setCommentText(initial);
                    return;
                  }

                  const reasonItem = applicationReasonsList.find((x: any) => x?.id === activeComment.id) as any;
                  const reasonIds =
                    Array.isArray(reasonItem?.reason) ? reasonItem.reason.map((r: any) => r?.id).filter(Boolean) : [];
                  setEditingReasonId(activeComment.id);
                  setEditingReasonObjectId(reasonItem?.object_id ?? reasonItem?.id ?? null);
                  setSelectedReasonIds(reasonIds);
                },
              },
              {
                label: 'Delete',
                icon: deleteIcon,
                onPress: () => {
                  setDeleteTargetId(activeComment.id);
                  setDeleteTargetText(activeComment.text ?? '');
                  setDeleteTargetKind(activeComment.kind);
                  setDeleteConfirmOpen(true);
                },
              },
            ]
            : []
        }
      />

      <ConfirmModal
        visible={deleteConfirmOpen}
        title="Confirm"
        message={`Are you sure you want to delete this ${deleteTargetKind}?\n\n${deleteTargetText || ''}`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (!deleteTargetId) return;
          if (deleteTargetKind === 'comment') {
            dispatch(deleteCommentRequestAction({ id: deleteTargetId }));
          } else {
            dispatch(
              updateApplicationReasonRequestAction({
                id: deleteTargetId,
                message: 'Deleted',
              })
            );
          }
          closeDeleteConfirm();
          setActiveCommentId(null);
        }}
        onCancel={closeDeleteConfirm}
        onClose={closeDeleteConfirm}
        dismissOnBackdropPress
      />
    </CustomSafeAreaView>
  );
}
