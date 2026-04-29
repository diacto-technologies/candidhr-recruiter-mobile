import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import dayjs, { type Dayjs } from 'dayjs';
import { SvgXml } from 'react-native-svg';
import ModalBox from '../../../../components/organisms/modalbox';
import DateRangePicker from '../../../../components/organisms/filtersheetcontent/rangepicker';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import { screenWidth } from '../../../../utils/devicelayout';
import { calenderIcon } from '../../../../assets/svg/calender';
import ValidityTimePickerMaterial from './validityTimePickerMaterial';

export type ValidityDateTimeFieldProps = {
  value: Dayjs | string | null;
  onChange: (next: Dayjs) => void;
  getMinInstant: () => Dayjs;
  modalTitle: string;
  hideDatePresets?: boolean;
};

type Step = 'date' | 'time';

const ValidityDateTimeField = ({
  value,
  onChange,
  getMinInstant,
  modalTitle,
  hideDatePresets = false,
}: ValidityDateTimeFieldProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('date');
  const [pendingDateStr, setPendingDateStr] = useState<string | null>(null);
  const [minDateSnapshot, setMinDateSnapshot] = useState('');

  const closeAll = useCallback(() => {
    setOpen(false);
    setStep('date');
    setPendingDateStr(null);
  }, []);

  useEffect(() => {
    if (open) {
      setMinDateSnapshot(getMinInstant().format('YYYY-MM-DD'));
      setStep('date');
    }
  }, [open, getMinInstant]);

  const goToTimeStep = useCallback((dateStr: string) => {
    setPendingDateStr(dateStr);
    setStep('time');
  }, []);

  const onDateApply = useCallback(
    (range: { start?: string; end?: string }) => {
      if (!range.start) {
        return;
      }
      goToTimeStep(range.start);
    },
    [goToTimeStep]
  );

  const parsedValue = useMemo(() => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    return dayjs(value);
  }, [value]);

  const timeInitial: Dayjs = useMemo(() => {
    if (!pendingDateStr) {
      return parsedValue ?? getMinInstant();
    }
    const min = getMinInstant();
    if (pendingDateStr === min.format('YYYY-MM-DD')) {
      return min;
    }
    return dayjs(pendingDateStr).hour(9).minute(0).second(0);
  }, [getMinInstant, pendingDateStr, parsedValue]);

  const displayLabel = parsedValue
    ? parsedValue.format('D MMM YYYY, h:mm A')
    : 'Select date & time';

  const initialForPicker = {
    start: parsedValue ? parsedValue.format('YYYY-MM-DD') : '',
    end: parsedValue ? parsedValue.format('YYYY-MM-DD') : '',
  };
  const minDate = getMinInstant().format('YYYY-MM-DD');

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.dateInput}
        onPress={() => setOpen(true)}
      >
        <SvgXml xml={calenderIcon} />
        <Typography variant="P1" color={colors.gray[700]} numberOfLines={2}>
          {displayLabel}
        </Typography>
      </TouchableOpacity>

      <ModalBox
        visible={open}
        onClose={closeAll}
        width={screenWidth * 0.92}
        borderRadius={16}
      >
        {open && step === 'date' ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pickerScroll}
          >
            <Typography variant="semiBoldTxtmd" style={styles.pickerContextTitle}>
              {modalTitle}
            </Typography>
            <DateRangePicker
              key={`validity-date-${minDateSnapshot}-${parsedValue ? parsedValue.valueOf() : 'empty'}`}
              mode="single"
              minDate={minDate}
              hidePresets={hideDatePresets}
              initialValue={initialForPicker}
              onClose={closeAll}
              onApply={onDateApply}
            />
          </ScrollView>
        ) : null}

        {open && step === 'time' && pendingDateStr ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.pickerScroll}
          >
            <ValidityTimePickerMaterial
              subDateText={dayjs(pendingDateStr).format('dddd, D MMM YYYY')}
              getMinDayjs={getMinInstant}
              pendingDateStr={pendingDateStr}
              onBack={() => {
                setStep('date');
                setPendingDateStr(null);
              }}
              onConfirm={(d) => {
                onChange(d);
                closeAll();
              }}
              initial={timeInitial}
            />
          </ScrollView>
        ) : null}
      </ModalBox>
    </View>
  );
};

export default ValidityDateTimeField;

const styles = StyleSheet.create({
  dateInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pickerScroll: {
    // paddingBottom: 8,
  },
  pickerContextTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
});
