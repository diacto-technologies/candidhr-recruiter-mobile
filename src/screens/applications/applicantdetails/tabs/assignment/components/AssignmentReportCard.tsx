import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../../../../../components/atoms/typography';
import Card from '../../../../../../components/atoms/card';
import { colors } from '../../../../../../theme/colors';
import { pageReloadIcon } from '../../../../../../assets/svg/pageReload';
import { infoIcon } from '../../../../../../assets/svg/info';
import AssignmentDropdown from '../../../../../../components/organisms/dropdown/assignmentdropdown';
import { AssignmentInviteOption } from '../../../../../../features/applications/types';
import { useStyles } from '../styles';

interface Props {
  options: AssignmentInviteOption[];
  selectedId: string | null;
  onSelectOption: (id: string) => void;
  onRefresh: () => void;
  onOpenDetails: () => void;
  refreshing?: boolean;
}

export const AssignmentReportCard: React.FC<Props> = React.memo(({
  options,
  selectedId,
  onSelectOption,
  onRefresh,
  onOpenDetails,
  refreshing = false,
}) => {
  const styles = useStyles();

  const dropdownData = useMemo(() => {
    return options.map((opt) => ({
      id: opt.id,
      blueprint_name: opt.assignment_title || 'PowerBi Assignment',
      job_title: '',
      date: opt.sent_at || '',
      status: opt.status || '',
    }));
  }, [options]);

  const effectiveSelectedId = selectedId || options[0]?.id || null;

  const handleSelect = useCallback(
    (item: { id: string }) => {
      onSelectOption(item.id);
    },
    [onSelectOption]
  );

  return (
    <Card style={[styles.card,{marginBottom:16}]}>
      {/* Top Header Row */}
      <View style={styles.reportHeaderRow}>
        <View style={styles.reportHeaderLeft}>
          <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
            Assignment Reports
          </Typography>
          <TouchableOpacity
            onPress={onOpenDetails}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Assignment details"
          >
            <SvgXml xml={infoIcon} width={16} height={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.reportHeaderRight}>
          <TouchableOpacity
            onPress={onRefresh}
            style={styles.reloadButton}
            disabled={refreshing}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <SvgXml xml={pageReloadIcon(colors.gray[700])} width={16} height={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Assignment Dropdown */}
      <AssignmentDropdown
        data={dropdownData}
        selectedId={effectiveSelectedId}
        onSelect={handleSelect}
      />
    </Card>
  );
});
