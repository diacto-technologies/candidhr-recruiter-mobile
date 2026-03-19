import React from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import Button from "../../../../../../components/atoms/button";
import Dropdown from "../../../../../../components/organisms/dropdown";
import AssignmentDropdown from "../../../../../../components/organisms/dropdown/assignmentdropdown";

interface Props {
    count: number;
    selectedItem: string | null;
    options: any[];
    onSelect: (item: any) => void;
    onRefresh: () => void;
    onExport: () => void;
}

const AssessmentReportsCard: React.FC<Props> = ({
    count,
    selectedItem,
    options,
    onSelect,
    onRefresh,
    onExport,
}) => {
    return (
        <View
            style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
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
                <View>
                    <Typography variant="boldTxtmd">
                        Assessment Reports
                    </Typography>

                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        {count} assignments found
                    </Typography>
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                    <Button
                        variant="outline"
                        borderRadius={20}
                        paddingHorizontal={12}
                        onPress={onRefresh}
                    >
                        Refresh
                    </Button>

                    <Button
                        borderRadius={20}
                        paddingHorizontal={12}
                        buttonColor={colors.brand[100]}
                        textColor={colors.brand[700]}
                        startIcon={
                            <Ionicons name="download-outline" size={16} />
                        }
                        onPress={onExport}
                    >
                        Export Report
                    </Button>
                </View>
            </View>

            {/* SELECT ASSIGNMENT */}
            <View style={{ marginTop: 16 }}>
                <Typography variant="mediumTxtsm" color={colors.gray[500]}>
                    Select Assignment
                </Typography>

                <View
                    style={{
                        marginTop: 8,
                        borderWidth: 1,
                        borderColor: colors.gray[200],
                        borderRadius: 12,
                        padding: 10,
                    }}
                >
                    <AssignmentDropdown
                        options={options}
                        labelKey="name"
                        valueKey="id"
                        setValue={selectedItem ?? undefined}
                        onSelect={onSelect} label={""} />
                </View>
            </View>
        </View>
    );
};

export default AssessmentReportsCard;