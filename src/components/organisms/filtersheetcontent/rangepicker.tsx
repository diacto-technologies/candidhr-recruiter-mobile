import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { screenWidth } from "../../../utils/devicelayout";
import { colors } from "../../../theme/colors";
import { PickerModalFooter } from "./pickerModalFooter";

const ACCENT = colors.brand[600];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Props = {
  onClose: () => void;
  onApply: (range: { start?: string; end?: string }) => void;
  mode?: "single" | "range";
  initialValue?: { start?: string; end?: string };
  minDate?: string;
  maxDate?: string;
  hidePresets?: boolean;
};

// -------- FORMAT HELPERS --------
const displayFormat = (d?: string) =>
  d ? dayjs(d).format("DD / MM / YYYY") : "";

const parseInputDate = (input: string) => {
  const clean = input.replace(/\s+/g, "");
  const parts = clean.split("/");
  if (parts.length !== 3) return null;

  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return null;

  const day = dd.padStart(2, "0");
  const month = mm.padStart(2, "0");
  const year = yyyy.padStart(4, "0");
  
  const f = `${year}-${month}-${day}`;
  return dayjs(f).isValid() ? f : null;
};

const autoFormatDate = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  const limited = digits.slice(0, 8);
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
};

function isMonthEntirelyOutOfRange(
  year: number,
  month0: number,
  minDateStr?: string,
  maxDateStr?: string
) {
  const monthStart = dayjs().year(year).month(month0).date(1).startOf("day");
  const monthEnd = dayjs().year(year).month(month0).endOf("month");
  if (minDateStr && monthEnd.isBefore(dayjs(minDateStr), "day")) return true;
  if (maxDateStr && monthStart.isAfter(dayjs(maxDateStr), "day")) return true;
  return false;
}

export default function DateRangePicker({
  onClose,
  onApply,
  mode = "range",
  initialValue,
  minDate,
  maxDate,
  hidePresets = false,
}: Props) {
  const getInitialRange = () => {
    if (initialValue?.start) {
      const normalizedStart = dayjs(initialValue.start).isValid() 
        ? dayjs(initialValue.start).format("YYYY-MM-DD")
        : initialValue.start;
      const normalizedEnd = initialValue.end 
        ? (dayjs(initialValue.end).isValid() ? dayjs(initialValue.end).format("YYYY-MM-DD") : initialValue.end)
        : (mode === "range" ? undefined : normalizedStart);
      return {
        start: normalizedStart,
        end: normalizedEnd,
      };
    }
    return {};
  };

  const [range, setRange] = useState<{ start?: string; end?: string }>(getInitialRange());
  const [startInput, setStartInput] = useState<string>(
    initialValue?.start ? displayFormat(initialValue.start) : ""
  );
  const [endInput, setEndInput] = useState<string>(
    initialValue?.end ? displayFormat(initialValue.end) : ""
  );
  const [isStartFocused, setIsStartFocused] = useState<boolean>(false);
  const [isEndFocused, setIsEndFocused] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<string>(
    initialValue?.start ? dayjs(initialValue.start).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
  );
  const [monthYearMode, setMonthYearMode] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => dayjs(currentMonth).year());

  useEffect(() => {
    if (initialValue?.start) {
      const normalizedStart = dayjs(initialValue.start).isValid() 
        ? dayjs(initialValue.start).format("YYYY-MM-DD")
        : initialValue.start;
      const normalizedEnd = initialValue.end 
        ? (dayjs(initialValue.end).isValid() ? dayjs(initialValue.end).format("YYYY-MM-DD") : initialValue.end)
        : (mode === "range" ? undefined : normalizedStart);
      setRange(prev => {
        if (prev.start !== normalizedStart || prev.end !== normalizedEnd) {
          return { start: normalizedStart, end: normalizedEnd };
        }
        return prev;
      });
      setStartInput(displayFormat(normalizedStart));
      setEndInput(normalizedEnd ? displayFormat(normalizedEnd) : "");
      setCurrentMonth(normalizedStart);
    } else {
      setRange({});
      setStartInput("");
      setEndInput("");
      setCurrentMonth(dayjs().format("YYYY-MM-DD"));
    }
  }, [initialValue, mode]);
  
  useEffect(() => {
    if (range.start) {
      setCurrentMonth(range.start);
    }
  }, [range.start]);

  const { disableArrowLeft, disableArrowRight } = useMemo(() => {
    const dLeft = minDate
      ? dayjs(currentMonth)
          .subtract(1, "month")
          .endOf("month")
          .isBefore(dayjs(minDate), "day")
      : false;
    const dRight = maxDate
      ? dayjs(currentMonth)
          .add(1, "month")
          .startOf("month")
          .isAfter(dayjs(maxDate), "day")
      : false;
    return { disableArrowLeft: dLeft, disableArrowRight: dRight };
  }, [currentMonth, minDate, maxDate]);

  const { canDecYear, canIncYear } = useMemo(() => {
    const dec =
      !minDate ||
      !dayjs()
        .year(pickerYear - 1)
        .month(11)
        .endOf("month")
        .isBefore(dayjs(minDate), "day");
    const inc =
      !maxDate ||
      !dayjs()
        .year(pickerYear + 1)
        .month(0)
        .startOf("month")
        .isAfter(dayjs(maxDate), "day");
    return { canDecYear: dec, canIncYear: inc };
  }, [pickerYear, minDate, maxDate]);

  const onDayPress = (day: { dateString: string }) => {
    if (mode === "single") {
      setRange({ start: day.dateString, end: day.dateString });
      setStartInput(displayFormat(day.dateString));
      setCurrentMonth(day.dateString);
      return;
    }

    if (!range.start || range.end) {
      setRange({ start: day.dateString, end: undefined });
      setStartInput(displayFormat(day.dateString));
      setEndInput("");
      setCurrentMonth(day.dateString);
    } else if (day.dateString < range.start) {
      setRange({ start: day.dateString, end: range.start });
      setStartInput(displayFormat(day.dateString));
      setEndInput(displayFormat(range.start));
      setCurrentMonth(day.dateString);
    } else {
      setRange({ ...range, end: day.dateString });
      setEndInput(displayFormat(day.dateString));
      setCurrentMonth(day.dateString);
    }
  };

  const setPreset = (days: number) => {
    const end = dayjs().format("YYYY-MM-DD");
    const start = dayjs().subtract(days, "day").format("YYYY-MM-DD");
    setRange({ start, end });
    setStartInput(displayFormat(start));
    setEndInput(displayFormat(end));
    setCurrentMonth(start);
  };
  
  const handleStartBlur = () => {
    setIsStartFocused(false);
    if (startInput.trim()) {
      const parsed = parseInputDate(startInput);
      if (parsed) {
        setRange(prev => ({ ...prev, start: parsed }));
        setStartInput(displayFormat(parsed));
        setCurrentMonth(parsed);
      } else {
        setStartInput(range.start ? displayFormat(range.start) : "");
      }
    } else {
      setStartInput(range.start ? displayFormat(range.start) : "");
    }
  };
  
  const handleEndBlur = () => {
    setIsEndFocused(false);
    if (endInput.trim()) {
      const parsed = parseInputDate(endInput);
      if (parsed) {
        setRange(prev => ({ ...prev, end: parsed }));
        setEndInput(displayFormat(parsed));
        setCurrentMonth(parsed);
      } else {
        setEndInput(range.end ? displayFormat(range.end) : "");
      }
    } else {
      setEndInput(range.end ? displayFormat(range.end) : "");
    }
  };

  const getMarked = () => {
    let marked: Record<string, object> = {};
    if (!range.start) return marked;

    let startDate = range.start.includes("T") ? range.start.split("T")[0] : range.start;
    let endDate = range.end && range.end.includes("T") ? range.end.split("T")[0] : range.end;
    if (startDate && dayjs(startDate).isValid()) {
      startDate = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate && dayjs(endDate).isValid()) {
      endDate = dayjs(endDate).format("YYYY-MM-DD");
    } else if (!endDate && mode === "range") {
      endDate = startDate;
    }

    if (mode === "single" || (startDate === endDate && endDate)) {
      marked[startDate] = {
        selected: true,
        selectedColor: ACCENT,
        selectedTextColor: "white",
      };
      return marked;
    }
    
    marked[startDate] = {
      startingDay: true,
      color: ACCENT,
      textColor: "white",
    };

    if (endDate) {
      const startDateObj = dayjs(startDate);
      const endDateObj = dayjs(endDate);
      if (endDateObj.isAfter(startDateObj)) {
        const daysDiff = endDateObj.diff(startDateObj, "day");
        if (daysDiff > 365) {
          marked[endDate] = {
            endingDay: true,
            color: ACCENT,
            textColor: "white",
          };
          return marked;
        }
        let current = startDateObj.add(1, "day");
        while (current.isBefore(endDateObj)) {
          marked[current.format("YYYY-MM-DD")] = {
            color: ACCENT,
            textColor: "white",
          };
          current = current.add(1, "day");
        }
        marked[endDate] = {
          endingDay: true,
          color: ACCENT,
          textColor: "white",
        };
      } else if (endDateObj.isSame(startDateObj)) {
        marked[startDate] = {
          selected: true,
          selectedColor: ACCENT,
          selectedTextColor: "white",
        };
      }
    }
    return marked;
  };

  const openMonthYear = (month: { getFullYear: () => number }) => {
    setPickerYear(Number(month.getFullYear()));
    setMonthYearMode(true);
  };

  const onSelectMonthInPicker = (monthIndex: number) => {
    if (isMonthEntirelyOutOfRange(pickerYear, monthIndex, minDate, maxDate)) {
      return;
    }
    const firstOfMonth = dayjs()
      .year(pickerYear)
      .month(monthIndex)
      .date(1)
      .format("YYYY-MM-DD");
    setCurrentMonth(firstOfMonth);
    setMonthYearMode(false);
  };

  const applyDisabled =
    mode === "single"
      ? !range.start
      : !range.start || !range.end;

  const calTheme = {
    arrowColor: ACCENT,
    todayTextColor: ACCENT,
    textMonthFontWeight: "600" as const,
    textDayHeaderFontSize: 12,
    textDayHeaderFontWeight: "500" as const,
    textSectionTitleDisabledColor: colors.gray[400],
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {mode === "single" ? (
          <>
            <TextInput
              style={styles.singleBox}
              value={isStartFocused ? startInput : (range.start ? displayFormat(range.start) : startInput)}
              placeholder="DD / MM / YYYY"
              placeholderTextColor={colors.gray[400]}
              onChangeText={(val) => {
                const formatted = autoFormatDate(val);
                setStartInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: parsed, end: parsed });
                  setCurrentMonth(parsed);
                }
              }}
              onFocus={() => {
                setIsStartFocused(true);
                setStartInput(range.start ? displayFormat(range.start) : "");
              }}
              onBlur={handleStartBlur}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.todayBtn}
              onPress={() => {
                const today = dayjs().format("YYYY-MM-DD");
                setRange({ start: today, end: today });
                setStartInput(displayFormat(today));
                setCurrentMonth(today);
              }}
            >
              <Text style={styles.todayBtnText}>Today</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.inputBox}
              value={isStartFocused ? startInput : (range.start ? displayFormat(range.start) : startInput)}
              placeholder="Start date"
              placeholderTextColor={colors.gray[400]}
              onChangeText={(val) => {
                const formatted = autoFormatDate(val);
                setStartInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: parsed, end: range.end });
                  setCurrentMonth(parsed);
                }
              }}
              onFocus={() => {
                setIsStartFocused(true);
                setStartInput(range.start ? displayFormat(range.start) : "");
              }}
              onBlur={handleStartBlur}
              keyboardType="numeric"
            />
            <Text style={styles.dash}>-</Text>
            <TextInput
              style={styles.inputBox}
              value={isEndFocused ? endInput : (range.end ? displayFormat(range.end) : endInput)}
              placeholder="End date"
              placeholderTextColor={colors.gray[400]}
              onChangeText={(val) => {
                const formatted = autoFormatDate(val);
                setEndInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: range.start, end: parsed });
                  setCurrentMonth(parsed);
                }
              }}
              onFocus={() => {
                setIsEndFocused(true);
                setEndInput(range.end ? displayFormat(range.end) : "");
              }}
              onBlur={handleEndBlur}
              keyboardType="numeric"
            />
          </>
        )}
      </View>

      {!hidePresets ? (
        <View style={styles.presets}>
          <TouchableOpacity onPress={() => setPreset(7)}>
            <Text style={styles.presetText}>Last week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPreset(30)}>
            <Text style={styles.presetText}>Last month</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPreset(365)}>
            <Text style={styles.presetText}>Last year</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.divider} />

      <View style={styles.calendarBox}>
        {monthYearMode ? (
          <View style={styles.monthYearPanel}>
            <View style={styles.monthYearTopRow}>
              <TouchableOpacity
                onPress={() => setMonthYearMode(false)}
                style={styles.monthYearBack}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Back to calendar"
              >
                <Ionicons name="chevron-back" size={22} color={colors.gray[800]} />
              </TouchableOpacity>
              <Text style={styles.monthYearPanelTitle}>Select month</Text>
              <View style={styles.monthYearBack} />
            </View>
            <View style={styles.yearRow}>
              <TouchableOpacity
                onPress={() => canDecYear && setPickerYear((y) => y - 1)}
                disabled={!canDecYear}
                style={styles.yearArrowBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={!canDecYear ? colors.gray[300] : ACCENT}
                />
              </TouchableOpacity>
              <Text style={styles.yearText}>{pickerYear}</Text>
              <TouchableOpacity
                onPress={() => canIncYear && setPickerYear((y) => y + 1)}
                disabled={!canIncYear}
                style={styles.yearArrowBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={!canIncYear ? colors.gray[300] : ACCENT}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.monthGrid}>
              {MONTH_SHORT.map((label, i) => {
                const dis = isMonthEntirelyOutOfRange(
                  pickerYear,
                  i,
                  minDate,
                  maxDate
                );
                const isCurrentView =
                  dayjs(currentMonth).year() === pickerYear &&
                  dayjs(currentMonth).month() === i;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[
                      styles.monthCell,
                      isCurrentView && styles.monthCellActive,
                      dis && styles.monthCellDisabled,
                    ]}
                    disabled={dis}
                    onPress={() => onSelectMonthInPicker(i)}
                  >
                    <Text
                      style={[
                        styles.monthCellText,
                        dis && styles.monthCellTextDisabled,
                        isCurrentView && styles.monthCellTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <Calendar
            key={dayjs(currentMonth).format("YYYY-MM")}
            current={currentMonth}
            minDate={minDate}
            maxDate={maxDate}
            firstDay={1}
            markingType={mode === "range" ? "period" : undefined}
            markedDates={getMarked()}
            onDayPress={onDayPress}
            onMonthChange={(month: { dateString: string }) => {
              setCurrentMonth(month.dateString);
            }}
            renderHeader={(month) => (
              <TouchableOpacity
                onPress={() => openMonthYear(month)}
                style={styles.headerTitlePressable}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.6}
                accessibilityLabel="Open month and year"
              >
                <Text style={styles.headerTitleText} allowFontScaling={false}>
                  {month.toString("MMMM yyyy")}
                </Text>
              </TouchableOpacity>
            )}
            renderArrow={(direction) => (
              <Ionicons
                name={direction === "left" ? "chevron-back" : "chevron-forward"}
                size={22}
                color={ACCENT}
              />
            )}
            disableArrowLeft={disableArrowLeft}
            disableArrowRight={disableArrowRight}
            theme={calTheme}
            style={{ width: screenWidth - 70 }}
            enableSwipeMonths
          />
        )}
      </View>

      <PickerModalFooter
        onCancel={onClose}
        onApply={() => onApply(range)}
        applyDisabled={applyDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    alignItems: "center",
  },
  dash: { marginHorizontal: 6, color: colors.gray[500] },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 130,
  },
  singleBox: {
    borderWidth: 1,
    borderColor: ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 200,
  },
  todayBtn: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  todayBtnText: { fontWeight: "600", color: colors.gray[800] },
  presets: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  presetText: {
    color: ACCENT,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray[200],
    marginBottom: 8,
  },
  calendarBox: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  headerTitlePressable: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
    textAlign: "center",
  },
  monthYearPanel: {
    paddingBottom: 8,
    minWidth: screenWidth - 70,
  },
  monthYearTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  monthYearBack: { width: 32, alignItems: "center" },
  monthYearPanelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 16,
  },
  yearArrowBtn: { padding: 4 },
  yearText: { fontSize: 18, fontWeight: "700", color: colors.gray[800], minWidth: 56, textAlign: "center" },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  monthCell: {
    width: "31%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: colors.brand[50],
  },
  monthCellActive: {
    backgroundColor: ACCENT,
  },
  monthCellDisabled: { opacity: 0.4 },
  monthCellText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray[800],
  },
  monthCellTextActive: { color: "#fff" },
  monthCellTextDisabled: { color: colors.gray[400] },
});
