import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import AssignmentDropdown from "../../../../../../components/organisms/dropdown/assignmentdropdown";
import Card from "../../../../../../components/atoms/card";
import { SvgXml } from "react-native-svg";
import { downloadIcon } from "../../../../../../assets/svg/download";
import Ionicons from "react-native-vector-icons/Ionicons";
import TestDetailsModal from "../../../../../../components/organisms/TestDetailsModal";
import { useAppSelector } from "../../../../../../hooks/useAppSelector";
import {
    selectPerformanceReport,
    selectAssessmentLogs,
    selectAssessmentOptions,
} from "../../../../../../features/applications/selectors";
import type {
    PerformanceReportResponse,
    AssessmentLog,
    AssessmentOption as AppAssessmentOption,
} from "../../../../../../features/applications/types";

interface AssignmentOption {
    id: string;
    blueprint_name: string;
    job_title: string;
    date: string;
    status: string;
}

interface Props {
    count: number;
    selectedItem: string | null;
    options: AssignmentOption[];
    onSelect: (item: AssignmentOption) => void;
    onRefresh: () => void;
    onExport: () => void;
    refreshing?: boolean;
    exporting?: boolean;
    performanceReport?: PerformanceReportResponse | null;
    currentSessionLog?: AssessmentLog | null;
    currentAssessmentOption?: AppAssessmentOption | null;
}

const AssessmentReportsCard: React.FC<Props> = ({
    count,
    selectedItem,
    options,
    onSelect,
    onRefresh,
    onExport,
    refreshing = false,
    exporting = false,
    performanceReport,
    currentSessionLog,
    currentAssessmentOption,
}) => {
    const [testDetailsVisible, setTestDetailsVisible] = useState(false);
    const canExport = Boolean(selectedItem) && !exporting;

    const reduxPerformanceReport = useAppSelector(selectPerformanceReport);
    const effectivePerformanceReport = performanceReport ?? reduxPerformanceReport;

    const reduxAssessmentOptions = useAppSelector(selectAssessmentOptions);
    const effectiveAssessmentOption =
        currentAssessmentOption ??
        reduxAssessmentOptions?.find((o) => o.id === selectedItem) ??
        reduxAssessmentOptions?.find(
            (o) => o.id === effectivePerformanceReport?.assessment_info?.assignment_id
        ) ??
        null;

    const assessmentLogs = useAppSelector(selectAssessmentLogs);
    const effectiveSessionLog =
        currentSessionLog ??
        assessmentLogs?.find(
            (l) =>
                l.content_id === selectedItem ||
                l.id === selectedItem ||
                l.content_id === effectivePerformanceReport?.assessment_info?.assignment_id
        ) ??
        null;

    return (
        <Card
            style={{
                backgroundColor: colors?.base?.white,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                width: "100%",
            }}
        >
            {/* HEADER */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Typography variant="boldTxtmd" color={colors.gray[900]}>
                        Assessment Reports
                    </Typography>
                    <TouchableOpacity
                        onPress={() => setTestDetailsVisible(true)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={18}
                            color={colors.gray[500]}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row", gap: 10, alignContent: "flex-start" }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            opacity: canExport ? 1 : 0.5,
                        }}
                        onPress={onExport}
                        disabled={!canExport}
                    >
                        <SvgXml xml={downloadIcon} height={15} width={15} color={colors.brand[600]} />
                        <Typography variant="mediumTxtxs" color={colors.brand[600]}>
                            {exporting ? "Exporting..." : "Export Report"}
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>

            {/* SELECT ASSIGNMENT */}
            <View style={{ marginTop: 16 }}>
                <AssignmentDropdown
                    data={options}
                    selectedId={selectedItem}
                    onSelect={onSelect}
                />
            </View>

            {/* TEST DETAILS MODAL */}
            <TestDetailsModal
                visible={testDetailsVisible}
                onClose={() => setTestDetailsVisible(false)}
                performanceReport={effectivePerformanceReport}
                currentSessionLog={effectiveSessionLog}
                currentAssessmentOption={effectiveAssessmentOption}
            />
        </Card>
    );
};

export default AssessmentReportsCard;