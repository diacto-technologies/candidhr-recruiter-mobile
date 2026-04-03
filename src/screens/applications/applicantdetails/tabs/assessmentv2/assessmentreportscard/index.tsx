import React from "react";
import { View, TouchableOpacity } from "react-native";
import Typography from "../../../../../../components/atoms/typography";
import { colors } from "../../../../../../theme/colors";
import Button from "../../../../../../components/atoms/button";
import AssignmentDropdown from "../../../../../../components/organisms/dropdown/assignmentdropdown";
import Card from "../../../../../../components/atoms/card";
import { SvgXml } from "react-native-svg";
import { downloadIcon } from "../../../../../../assets/svg/download";
import Feather from "react-native-vector-icons/Feather";

interface AssignmentOption {
    id: string;
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
}) => {
    const canExport = Boolean(selectedItem) && !exporting;

    return (
        <Card
            style={{
                backgroundColor: colors?.base?.white,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                width:"100%"
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
                <View style={{justifyContent:'center'}}>
                    <Typography variant="boldTxtmd">
                        Assessment Reports
                    </Typography>

                    <Typography variant="regularTxtsm" color={colors.gray[500]}>
                        {count} assignments found
                    </Typography>
                </View>

                <View style={{ flexDirection: "row", gap: 10, alignContent: 'flex-start' }}>
                    {/* <Button
                        variant="outline"
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={colors.brand[200]}
                        buttonColor={colors.brand[25]}
                        textColor={colors.brand[700]}
                        startIcon={
                            <Feather
                                name="refresh-cw"
                                size={13}
                                color={colors.brand[700]}
                            />
                        }
                        size={25}
                        paddingHorizontal={5}
                        style={{ flex: 1 }}
                        textVariant="mediumTxtxs"
                        onPress={onRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </Button> */}

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                           // alignItems: "center",
                            gap: 4,
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
        </Card>
    );
};

export default AssessmentReportsCard;