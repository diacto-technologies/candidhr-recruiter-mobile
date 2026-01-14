import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import dayjs from "dayjs";
import { screenWidth } from "../../../utils/devicelayout";

import ModalBox from "../modalbox";
import RangePicker from "./rangepicker";
import { SvgXml } from "react-native-svg";
import { calenderIcon } from "../../../assets/svg/calender";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectJobFilters } from "../../../features/jobs/selectors";
import { setJobFilters } from "../../../features/jobs/slice";

const DateFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const jobFilters = useAppSelector(selectJobFilters);

  const [open, setOpen] = useState(false);

  // Local state defaults from Redux
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    jobFilters.closeDate
  );

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.dateInput}
        onPress={() => setOpen(true)}
      >
        <SvgXml xml={calenderIcon} />

        <Typography variant="P1" color={colors.gray[700]}>
          {selectedDate
            ? dayjs(selectedDate).format("D MMM YYYY")
            : "Select Date"}
        </Typography>
      </TouchableOpacity>

      <ModalBox
        visible={open}
        onClose={() => setOpen(false)}
        width={screenWidth * 0.9}
        borderRadius={16}
      >
        {open && (
          <RangePicker
            key={`${selectedDate}-${open}`}
            mode="single"
            initialValue={
              selectedDate ? { start: selectedDate, end: selectedDate } : undefined
            }
            onClose={() => setOpen(false)}
            onApply={(range) => {
              const date = range.start;

              setSelectedDate(date);

              // Save in Redux
              dispatch(
                setJobFilters({
                  closeDate: date,
                })
              );

              setOpen(false);
            }}
          />
        )}
      </ModalBox>
    </View>
  );
};

export default DateFilter;

const styles = StyleSheet.create({
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
