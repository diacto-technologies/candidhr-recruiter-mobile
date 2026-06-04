import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Typography from "../../atoms/typography";
import { colors } from "../../../theme/colors";
import dayjs from "dayjs";
import { screenWidth } from "../../../utils/devicelayout";

import ModalBox from "../modalbox";
import RangePicker from "../rangepicker";
import { SvgXml } from "react-native-svg";
import { calenderIcon } from "../../../assets/svg/calender";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectJobFilters } from "../../../features/jobs/selectors";
import { setJobFilters } from "../../../features/jobs/slice";
import { useStyles } from "./styles";
import { DateFilterProps } from "./datefilter.d";

const DateFilter: React.FC<DateFilterProps> = () => {
  const dispatch = useAppDispatch();
  const jobFilters = useAppSelector(selectJobFilters);

  const [open, setOpen] = useState(false);

  // Local state defaults from Redux
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    jobFilters.closeDate
  );

  const styles = useStyles();

  return (
    <View style={styles.container}>
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

