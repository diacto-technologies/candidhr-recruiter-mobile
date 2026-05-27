import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { screenWidth } from "../../../utils/devicelayout";

type Props = {
  onClose: () => void;
  onApply: (range: { start?: string; end?: string }) => void;
  mode?: "single" | "range";
  initialValue?: { start?: string; end?: string };
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

  // Pad with zeros if needed (e.g., "1" -> "01")
  const day = dd.padStart(2, "0");
  const month = mm.padStart(2, "0");
  const year = yyyy.padStart(4, "0");
  
  const f = `${year}-${month}-${day}`;
  return dayjs(f).isValid() ? f : null;
};

// Auto-format date input: adds "/" automatically
const autoFormatDate = (input: string): string => {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, "");
  
  // Limit to 8 digits (DDMMYYYY)
  const limited = digits.slice(0, 8);
  
  // Format: DD/MM/YYYY
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 4) {
    return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  }
};

export default function DateRangePicker({
  onClose,
  onApply,
  mode = "range",
  initialValue,
}: Props) {

  // Initialize state from initialValue
  const getInitialRange = () => {
    if (initialValue?.start) {
      const normalizedStart = dayjs(initialValue.start).isValid() 
        ? dayjs(initialValue.start).format("YYYY-MM-DD")
        : initialValue.start;
      // For range mode, use end date if provided, otherwise use start (single date)
      // For single mode, always use start as end
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
  
  // Local state to track raw input text while typing
  const [startInput, setStartInput] = useState<string>(
    initialValue?.start ? displayFormat(initialValue.start) : ""
  );
  const [endInput, setEndInput] = useState<string>(
    initialValue?.end ? displayFormat(initialValue.end) : ""
  );
  const [isStartFocused, setIsStartFocused] = useState<boolean>(false);
  const [isEndFocused, setIsEndFocused] = useState<boolean>(false);
  
  // State to control which month the calendar displays
  const [currentMonth, setCurrentMonth] = useState<string>(
    initialValue?.start ? dayjs(initialValue.start).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
  );

  // Initialize input states when component mounts or initialValue changes
  useEffect(() => {
    if (initialValue?.start) {
      // Normalize dates to YYYY-MM-DD format
      const normalizedStart = dayjs(initialValue.start).isValid() 
        ? dayjs(initialValue.start).format("YYYY-MM-DD")
        : initialValue.start;
      // For range mode, use end date if provided, otherwise undefined
      // For single mode, use start as end
      const normalizedEnd = initialValue.end 
        ? (dayjs(initialValue.end).isValid() ? dayjs(initialValue.end).format("YYYY-MM-DD") : initialValue.end)
        : (mode === "range" ? undefined : normalizedStart);
      
      // Only update if the values are different to avoid unnecessary re-renders
      setRange(prev => {
        if (prev.start !== normalizedStart || prev.end !== normalizedEnd) {
          return {
            start: normalizedStart,
            end: normalizedEnd,
          };
        }
        return prev;
      });
      setStartInput(displayFormat(normalizedStart));
      setEndInput(normalizedEnd ? displayFormat(normalizedEnd) : "");
      setCurrentMonth(normalizedStart);
    } else {
      // Reset when no initial value
      setRange({});
      setStartInput("");
      setEndInput("");
      setCurrentMonth(dayjs().format("YYYY-MM-DD"));
    }
  }, [initialValue, mode]);
  
  // Update calendar month when range changes (from manual input or selection)
  useEffect(() => {
    if (range.start) {
      setCurrentMonth(range.start);
    }
  }, [range.start]);

  const onDayPress = (day: any) => {
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
    setCurrentMonth(start); // Navigate calendar to start date
  };
  
  // Handle input blur - validate and format the date
  const handleStartBlur = () => {
    setIsStartFocused(false);
    if (startInput.trim()) {
      const parsed = parseInputDate(startInput);
      if (parsed) {
        setRange(prev => ({ ...prev, start: parsed }));
        setStartInput(displayFormat(parsed));
        setCurrentMonth(parsed); // Navigate calendar to entered date
      } else {
        // If invalid, reset to formatted date or empty
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
        setCurrentMonth(parsed); // Navigate calendar to entered date
      } else {
        // If invalid, reset to formatted date or empty
        setEndInput(range.end ? displayFormat(range.end) : "");
      }
    } else {
      setEndInput(range.end ? displayFormat(range.end) : "");
    }
  };

  const getMarked = () => {
    let marked: any = {};
    if (!range.start) return marked;

    // Ensure date is in YYYY-MM-DD format (remove time if present, normalize format)
    let startDate = range.start.includes('T') ? range.start.split('T')[0] : range.start;
    let endDate = range.end && range.end.includes('T') ? range.end.split('T')[0] : range.end;
    
    // Normalize to YYYY-MM-DD format using dayjs
    if (startDate && dayjs(startDate).isValid()) {
      startDate = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate && dayjs(endDate).isValid()) {
      endDate = dayjs(endDate).format("YYYY-MM-DD");
    } else if (!endDate && mode === "range") {
      // If in range mode but no end date, treat as single date
      endDate = startDate;
    }

    // Check if it's a single date (same start and end, or single mode)
    if (mode === "single" || (startDate === endDate && endDate)) {
      // For single date selection, use simple marking type
      marked[startDate] = {
        selected: true,
        selectedColor: "#6C4BE7",
        selectedTextColor: "white",
      };
      return marked;
    }

    // For period marking, all dates must use the same color
    const periodColor = "#6C4BE7";
    
    marked[startDate] = {
      startingDay: true,
      color: periodColor,
      textColor: "white",
    };

    if (endDate) {
      const startDateObj = dayjs(startDate);
      const endDateObj = dayjs(endDate);
      
      // Only mark dates if end is after start
      if (endDateObj.isAfter(startDateObj)) {
        // Limit the range to prevent excessive properties (max 365 days)
        const daysDiff = endDateObj.diff(startDateObj, "day");
        if (daysDiff > 365) {
          // If range is too large, only mark start and end
          marked[endDate] = {
            endingDay: true,
            color: periodColor,
            textColor: "white",
          };
          return marked;
        }
        
        // Mark all intermediate dates with the same color (required for period marking)
        let current = startDateObj.add(1, "day");
        while (current.isBefore(endDateObj)) {
          marked[current.format("YYYY-MM-DD")] = {
            color: periodColor,
            textColor: "white",
          };
          current = current.add(1, "day");
        }
        
        // Mark end date
        marked[endDate] = {
          endingDay: true,
          color: periodColor,
          textColor: "white",
        };
      } else if (endDateObj.isSame(startDateObj)) {
        // If start and end are the same, treat as single date
        marked[startDate] = {
          selected: true,
          selectedColor: periodColor,
          selectedTextColor: "white",
        };
      }
    }

    return marked;
  };

  return (
    <View style={styles.container}>

      <Text style={styles.monthTitle}>
        {dayjs(range.start || new Date()).format("MMMM YYYY")}
      </Text>

      {/* ---------- INPUT AREA ---------- */}
      <View style={styles.row}>

        {mode === "single" ? (
          <>
            <TextInput
              style={[styles.singleBox]}
              value={isStartFocused ? startInput : (range.start ? displayFormat(range.start) : startInput)}
              placeholder="DD / MM / YYYY"
              onChangeText={(val) => {
                // Auto-format with "/" separators
                const formatted = autoFormatDate(val);
                setStartInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: parsed, end: parsed });
                  setCurrentMonth(parsed); // Navigate calendar to entered date
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
                setCurrentMonth(today); // Navigate calendar to today
              }}
            >
              <Text style={{ fontWeight: "600" }}>Today</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.inputBox}
              value={isStartFocused ? startInput : (range.start ? displayFormat(range.start) : startInput)}
              placeholder="Start date"
              onChangeText={(val) => {
                // Auto-format with "/" separators
                const formatted = autoFormatDate(val);
                setStartInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: parsed, end: range.end });
                  setCurrentMonth(parsed); // Navigate calendar to entered date
                }
              }}
              onFocus={() => {
                setIsStartFocused(true);
                setStartInput(range.start ? displayFormat(range.start) : "");
              }}
              onBlur={handleStartBlur}
              keyboardType="numeric"
            />

            <Text> - </Text>

            <TextInput
              style={styles.inputBox}
              value={isEndFocused ? endInput : (range.end ? displayFormat(range.end) : endInput)}
              placeholder="End date"
              onChangeText={(val) => {
                // Auto-format with "/" separators
                const formatted = autoFormatDate(val);
                setEndInput(formatted);
                const parsed = parseInputDate(formatted);
                if (parsed) {
                  setRange({ start: range.start, end: parsed });
                  setCurrentMonth(parsed); // Navigate calendar to entered date
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

      {/* PRESETS */}
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

      <View style={styles.calendarBox}>
        <Calendar
          current={currentMonth}
          markingType={mode === "range" ? "period" : undefined}
          markedDates={getMarked()}
          onDayPress={onDayPress}
          onMonthChange={(month: any) => {
            // Update current month when user navigates calendar
            setCurrentMonth(month.dateString);
          }}
          theme={{
            arrowColor: "#6C4BE7",
            todayTextColor: "#6C4BE7",
          }}
          style={{
            width: screenWidth - 70,
          }}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.apply,
            { opacity: !range.start || !range.end ? 0.5 : 1 },
          ]}
          disabled={!range.start || !range.end}
          onPress={() => onApply(range)}
        >
          <Text style={{ color: "white" }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flexGrow: 1 },

  monthTitle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
    alignItems: "center",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 130,
  },

  singleBox: {
    borderWidth: 1,
    borderColor: "#6C4BE7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 200,
  },

  todayBtn: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  presets: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  presetText: {
    color: "#6C4BE7",
    fontWeight: "600",
  },

  calendarBox: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },

  footer: {
    flexDirection: "row",
    marginTop: 14,
    columnGap: 10,
  },

  cancel: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DDD",
    padding: 12,
    alignItems: "center",
  },

  apply: {
    flex: 1,
    backgroundColor: "#6C4BE7",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
});