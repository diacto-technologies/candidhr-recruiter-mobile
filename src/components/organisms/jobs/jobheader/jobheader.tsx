import React, { useState, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import Typography from "../../../atoms/typography";
import { colors } from "../../../../theme/colors";
import { SvgXml } from "react-native-svg";
import { locationIcon } from "../../../../assets/svg/location";
import { useStyles } from "./styles";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { selectJobsLoading, selectSelectedJob } from "../../../../features/jobs/selectors";
import { formatMonDDYYYY } from "../../../../utils/dateformatter";
import { eyeVisibleIcon } from "../../../../assets/svg/eyevisible";
import Shimmer from "../../../atoms/shimmer";
import { CustomAvatar, getInitials } from "../../../atoms/avatar";
import ShareJobModal from "../../shareJobModal";
import { usePermission } from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../utils/permission.constants";


const JobHeaderShimmer = () => {
  return (
    <View style={{ paddingVertical: 16 }}>
      {/* Title */}
      <Shimmer height={24} width="70%" style={{ marginBottom: 12 }} />

      {/* Meta row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Shimmer height={14} width="30%" />
        <View style={{ width: 8 }} />
        <Shimmer height={14} width="20%" />
      </View>

      {/* Location */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Shimmer height={14} width="60%" />
      </View>

      {/* Chips */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        <Shimmer height={24} width={80} borderRadius={12} />
        <Shimmer height={24} width={100} borderRadius={12} />
      </View>

      {/* Close date */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Shimmer height={14} width="25%" />
        <Shimmer height={14} width="20%" />
        <Shimmer height={20} width={60} borderRadius={10} />
      </View>

      {/* Owner shimmer */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Shimmer width={50} height={14} />
        <Shimmer width={28} height={28} borderRadius={14} />
        <Shimmer width={100} height={14} />
      </View>

      {/* Shared with shimmer */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Shimmer width={75} height={14} />
        <Shimmer width={60} height={26} borderRadius={13} />
        <Shimmer width={50} height={14} />
      </View>
    </View>
  );
};

const JobHeader = () => {
  const styles = useStyles();
  const { can } = usePermission();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const jobs = useAppSelector(selectSelectedJob);
  const loading = useAppSelector(selectJobsLoading);
  const closeDate = jobs?.close_date ? new Date(jobs.close_date) : null;
  const isClosed = closeDate ? closeDate < new Date() : false;

  const sharedUsers = useMemo(
    () => jobs?.users_shared_with ?? [],
    [jobs?.users_shared_with],
  );
  const sharedCount = sharedUsers.length;
  const extraSharedCount = Math.max(0, sharedCount - 3);
  const initialSharedMemberIds = useMemo(
    () => sharedUsers.map(u => u.id).filter(Boolean),
    [sharedUsers],
  );

  if(loading){
   return <JobHeaderShimmer/>
  }
  return (
    <View style={styles.container}>
      <Typography variant="semiBoldTxtxl">{jobs?.title ?? ""}</Typography>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <SvgXml xml={eyeVisibleIcon} width={16} height={16} />
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>
            {jobs?.views_count ?? 0} {jobs?.views_count === 1 ? "view" : "views"}
          </Typography>
        </View>
        <View style={styles.dot}></View>
        <Typography variant="regularTxtsm" color={colors.gray[500]}>{formatMonDDYYYY(jobs?.created_at ?? "", "DD MMM YYYY")}</Typography>
      </View>
      <View style={styles.metaSection}>
        <View style={styles.row}>
          <SvgXml xml={locationIcon} />
          <Typography variant="regularTxtsm" color={colors.gray[600]} style={{ paddingLeft: 8 }}>{jobs?.location + ","}</Typography>
          <Typography variant="regularTxtsm" color={colors.gray[600]}>{ jobs?.owner?.state  ?? ""}</Typography>
        </View>
        <View style={styles.chipRow}>
          <View style={[styles.chip, { backgroundColor: colors.brand[50], borderColor: colors.brand[200] }]}>
            <Typography variant="mediumTxtxs" color={colors.brand[700]}>{jobs?.employment_type ?? ""}</Typography>
          </View>

          <View style={[styles.chip, { backgroundColor: colors.Teal[50], borderColor: colors.Teal[200] }]}>
            <Typography variant="mediumTxtxs" color={colors.Teal[700]}>{jobs?.min_experience ?? ""} - {jobs?.max_experience ?? ""} Yrs</Typography>
          </View>

          {jobs?.published ? (
            <View style={[styles.chip, { backgroundColor: colors.success[50], borderColor: colors.success[200] }]}>
              <Typography variant="mediumTxtxs" color={colors.success[700]}>Live</Typography>
            </View>
          ) : (
            <View style={[styles.chip, { backgroundColor: colors.gray[100], borderColor: colors.gray[300] }]}>
              <Typography variant="mediumTxtxs" color={colors.gray[700]}>Draft</Typography>
            </View>
          )}

          {jobs?.rapidhire_enabled && (
            <View style={[styles.chip, { backgroundColor: colors.brand[50], borderColor: colors.brand[200] }]}>
              <Typography variant="mediumTxtxs" color={colors.brand[700]}>Rapidly</Typography>
            </View>
          )}

          {/* <View style={[styles.chip,{backgroundColor:colors.orange[50],borderColor:colors.orange[200]}]}>
        <Typography variant="mediumTxtxs" color={colors.orange[700]}>8 - 10 LPA</Typography>
        </View> */}
        </View>
        <View style={styles.metaRow}>
          <Typography variant='regularTxtsm' color={colors.gray[500]}>Closed on :</Typography>
          <Typography variant="mediumTxtsm" color={colors.gray[700]}>{formatMonDDYYYY(jobs?.close_date ?? "", "DD MMM YYYY")}</Typography>
          <View style={[styles.close, { backgroundColor: isClosed? colors.error[50]:colors.success[50], borderColor: isClosed?colors.error[200]:colors.success[200] }]}>
            {isClosed ? (
              <Typography
                variant="mediumTxtxs"
                color={colors.error[700]}
              >
                Closed
              </Typography>
            ) : (
              <Typography
              variant="mediumTxtxs"
              color={colors.success[700]}
              >
                Open
              </Typography>
            )}
          </View>
        </View>

        {Boolean(jobs?.owner) && (
          <View style={styles.metaRow}>
            <Typography variant="regularTxtsm" color={colors.gray[500]}>
              Owner :
            </Typography>
            <View style={styles.ownerDetails}>
              <CustomAvatar
                imageUrl={jobs?.owner?.profile_pic}
                name={jobs?.owner?.name}
                size={28}
                borderWidth={0}
                borderColor="transparent"
                fontVariant="semiBoldTxtxs"
              />
              <View style={styles.ownerTextCol}>
                <Typography
                  variant="mediumTxtsm"
                  color={colors.gray[900]}
                  numberOfLines={1}
                >
                  {jobs?.owner?.name ?? '—'}
                </Typography>
                {Boolean(jobs?.owner?.email) && (
                  <Typography
                    variant="regularTxtxs"
                    color={colors.gray[500]}
                    numberOfLines={1}
                  >
                    {jobs?.owner?.email}
                  </Typography>
                )}
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.metaRow}
          disabled={!can(PERMISSIONS.SHARE_JOB) || !jobs?.id}
          onPress={() => setShareModalVisible(true)}
          activeOpacity={0.7}
        >
          <Typography variant="regularTxtsm" color={colors.gray[500]}>
            Shared with :
          </Typography>
          <View style={styles.sharedDetails}>
            {sharedUsers.length > 0 && (
              <View style={styles.sharedAvatarsRow}>
                {sharedUsers.slice(0, 3).map((user, idx) => (
                  <View
                    key={user.id ?? idx}
                    style={idx > 0 ? styles.sharedAvatarOverlap : undefined}
                  >
                    <CustomAvatar
                      imageUrl={user.profile_pic}
                      name={user.name}
                      size={26}
                      borderWidth={1.5}
                      borderColor={colors.base.white}
                      fontVariant="semiBoldTxtxs"
                    />
                  </View>
                ))}
                {extraSharedCount > 0 && (
                  <View style={[styles.sharedAvatarOverlap, styles.moreAvatar]}>
                    <Typography variant="semiBoldTxtxs" color={colors.gray[600]}>
                      +{extraSharedCount}
                    </Typography>
                  </View>
                )}
              </View>
            )}
            <Typography variant="mediumTxtsm" color={colors.gray[700]}>
              {sharedCount} {sharedCount === 1 ? 'user' : 'users'}
            </Typography>
          </View>
        </TouchableOpacity>
      </View>

      {shareModalVisible && jobs?.id && (
        <ShareJobModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          jobId={jobs.id}
          initialSharedMemberIds={initialSharedMemberIds}
        />
      )}
    </View>
  );
};

export default JobHeader;