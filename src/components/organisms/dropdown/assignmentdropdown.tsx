import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import { getStatusColor } from "../applicantlist/helper";
import { styles as dropdownStyles } from "./styles";

interface Item {
    id: string;
    job_title: string;
    date: string;
    status: string;
}

interface Props {
    data: Item[];
    selectedId: string | null;
    onSelect: (item: Item) => void;
}

const AssignmentDropdown: React.FC<Props> = ({
    data,
    selectedId,
    onSelect,
}) => {
    const [open, setOpen] = useState(false);

    const selectedItem = useMemo(
        () => data.find((i) => i.id === selectedId),
        [data, selectedId]
    );

    return (
        <View style={localStyles.wrapper}>
            <TouchableOpacity
                onPress={() => setOpen((v) => !v)}
                activeOpacity={0.8}
                style={[
                    dropdownStyles.container,
                    open && dropdownStyles.containerFocused,
                ]}
            >
                <View style={localStyles.selectedRow}>
                    <View style={localStyles.selectedLeft}>
                        <Typography variant="semiBoldTxtmd" color={colors.gray[900]} numberOfLines={1}>
                            {selectedItem?.id || "Select Assignment"}
                        </Typography>

                        {!!selectedItem && (
                            <Typography
                                variant="regularTxtxs"
                                color={colors.gray[500]}
                                numberOfLines={1}
                            >
                                {selectedItem.job_title} · Sent {selectedItem.date}
                            </Typography>
                        )}
                    </View>

                    <View style={localStyles.selectedRight}>
                        {!!selectedItem?.status && (
                            <View style={dropdownStyles.statusBadge}>
                                <View
                                    style={[
                                        dropdownStyles.statusDot,
                                        { backgroundColor: getStatusColor(selectedItem.status) },
                                    ]}
                                />
                                <Typography style={dropdownStyles.statusText} numberOfLines={1}>
                                    {selectedItem.status}
                                </Typography>
                            </View>
                        )}

                        <Ionicons
                            name={open ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={colors.gray[500]}
                            style={localStyles.chevron}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {open && (
                <View style={[dropdownStyles.optionsContainer, localStyles.optionsContainer]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        nestedScrollEnabled={true}
                        renderItem={({ item }) => {
                            const isSelected = item.id === selectedId;

                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                    activeOpacity={0.85}
                                    style={[
                                        // dropdownStyles.optionItem,
                                        isSelected && dropdownStyles.selectedOptionItem,
                                        // localStyles.optionItem,
                                    ]}
                                >
                                    <View
                                        style={[
                                            dropdownStyles.optionItem,
                                            isSelected && dropdownStyles.selectedOptionItem,
                                            localStyles.optionItem,
                                        ]}
                                    >
                                        <View style={localStyles.optionTopRow}>
                                            <Typography style={dropdownStyles.optionNameText} numberOfLines={1} ellipsizeMode="tail">
                                                {item.id}
                                            </Typography>

                                            <View style={localStyles.optionRight}>
                                                <View style={dropdownStyles.statusBadge}>
                                                    <View
                                                        style={[
                                                            dropdownStyles.statusDot,
                                                            { backgroundColor: getStatusColor(item.status) },
                                                        ]}
                                                    />
                                                    <Typography style={dropdownStyles.statusText} numberOfLines={1}>
                                                        {item.status}
                                                    </Typography>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <Typography
                                        variant="regularTxtxs"
                                        color={colors.gray[500]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{marginLeft:16}}
                                    >
                                        {item.job_title} · Sent {item.date}
                                    </Typography>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default AssignmentDropdown;

const localStyles = StyleSheet.create({
    wrapper: {
        width: "100%",
        marginTop: 10,
    },
    selectedRow: {
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 12,
        paddingRight: 12,
        paddingVertical: 10,
        gap: 12,
    },
    selectedLeft: {
        flex: 1,
        minWidth: 0,
        gap: 2,
    },
    selectedRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
    },
    chevron: {
        marginRight: 0,
    },
    optionsContainer: {
        marginTop: 6,
        maxHeight: 220,
    },
    optionItem: {
        paddingVertical: 10,
    },
    optionTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    optionRight: {
        flexShrink: 0,
    },
    optionNameText:{

    }
});