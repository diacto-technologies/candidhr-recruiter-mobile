import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import dayjs, { type Dayjs } from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import FooterButtons from '../../../../components/molecules/footerbuttons';
import Divider from '../../../../components/atoms/divider';

const B = colors.brand[600];
const B_LIGHT = colors.brand[100];

const CLOCK = 256;
const R_NUM = 108;
const CX = CLOCK / 2;
const CY = CLOCK / 2;
/** Selection highlight r=18 in Svg; label box matches that circle */
const LABEL_BOX = 36;
const PAD2 = (n: number) => (n < 10 ? `0${n}` : String(n));

function posOnCircle(
  t: number,
  total: number,
  r: number,
): { x: number; y: number } {
  const angle = (t / total) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

const MINUTE_DIAL: number[] = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function toH12m(h24: number, minute: number): { h12: number; isPm: boolean; m: number } {
  const isPm = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { h12, isPm, m: minute };
}

function toH24(h12: number, isPm: boolean): number {
  if (h12 === 12) return isPm ? 12 : 0;
  return isPm ? h12 + 12 : h12;
}

function snapMinute(m: number): number {
  return (Math.round(m / 5) * 5) % 60;
}

export type ValidityTimePickerMaterialProps = {
  subDateText: string;
  getMinDayjs: () => Dayjs;
  pendingDateStr: string;
  initial: Dayjs;
  onBack: () => void;
  onConfirm: (d: Dayjs) => void;
};

export default function ValidityTimePickerMaterial({
  subDateText,
  getMinDayjs,
  pendingDateStr,
  initial,
  onBack,
  onConfirm,
}: ValidityTimePickerMaterialProps) {
  const [dial, setDial] = useState<'hour' | 'minute'>('hour');
  const [keyboard, setKeyboard] = useState(false);
  const minJ = getMinDayjs();
  const sameDayAsMin = useMemo(
    () => dayjs(pendingDateStr).isSame(minJ, 'day'),
    [pendingDateStr, minJ],
  );

  const init = useMemo(
    () => toH12m(initial.hour(), initial.minute()),
    [initial],
  );
  const [h12, setH12] = useState(init.h12);
  const [isPm, setIsPm] = useState(init.isPm);
  const [minute, setMinute] = useState(snapMinute(init.m));
  const [kbHour, setKbHour] = useState(PAD2(init.h12));
  const [kbMin, setKbMin] = useState(
    PAD2(snapMinute(init.m)),
  );

  const h24 = useMemo(() => toH24(h12, isPm), [h12, isPm]);

  const buildCandidate = useCallback(
    (hour24: number, min: number) =>
      dayjs(pendingDateStr)
        .hour(hour24)
        .minute(min)
        .second(0)
        .millisecond(0),
    [pendingDateStr],
  );

  const applyClamp = useCallback(
    (d: Dayjs) => {
      if (sameDayAsMin && d.isBefore(minJ)) {
        return minJ;
      }
      return d;
    },
    [minJ, sameDayAsMin],
  );

  const onConfirmPress = useCallback(() => {
    if (keyboard) {
      const hhR = Math.min(12, Math.max(1, parseInt(kbHour, 10) || 1));
      const mmR = Math.min(59, Math.max(0, parseInt(kbMin, 10) || 0));
      const snapped = snapMinute(mmR);
      setH12(hhR);
      setMinute(snapped);
      setKbHour(PAD2(hhR));
      setKbMin(PAD2(snapped));
      setKeyboard(false);
      const cand = buildCandidate(toH24(hhR, isPm), snapped);
      onConfirm(applyClamp(cand));
      return;
    }
    onConfirm(applyClamp(buildCandidate(h24, minute)));
  }, [
    applyClamp,
    buildCandidate,
    h24,
    isPm,
    kbHour,
    kbMin,
    keyboard,
    minute,
    onConfirm,
  ]);

  const handAngle = useMemo(() => {
    if (dial === 'hour') {
      const t = h12 === 12 ? 0 : h12;
      return (t / 12) * 2 * Math.PI - Math.PI / 2;
    }
    return (minute / 60) * 2 * Math.PI - Math.PI / 2;
  }, [dial, h12, minute]);

  return (
    <View style={styles.root}>
      <View style={styles.contentColumn}>
      <Typography
        variant="semiBoldTxtmd"
        color={colors.gray[800]}
        style={styles.title}
      >
        Select time
      </Typography>
      <Typography
        variant="regularTxtsm"
        color={colors.gray[600]}
        numberOfLines={2}
        style={styles.subDate}
      >
        {subDateText}
      </Typography>

      <View style={styles.digitalRow}>
        <Pressable
          onPress={() => {
            setDial('hour');
            setKeyboard(false);
          }}
          style={[
            styles.digBox,
            dial === 'hour' ? styles.digBoxActive : styles.digBoxIdle,
          ]}
        >
          <Text
            style={[
              styles.digText,
              dial === 'hour' ? styles.digTextActive : styles.digTextIdle,
            ]}
          >
            {PAD2(h12)}
          </Text>
        </Pressable>
        <Text style={styles.colon}>:</Text>
        <Pressable
          onPress={() => {
            setDial('minute');
            setKeyboard(false);
          }}
          style={[
            styles.digBox,
            dial === 'minute' ? styles.digBoxActive : styles.digBoxIdle,
          ]}
        >
          <Text
            style={[
              styles.digText,
              dial === 'minute' ? styles.digTextActive : styles.digTextIdle,
            ]}
          >
            {PAD2(minute)}
          </Text>
        </Pressable>

        <View style={styles.ampmCol}>
          <Pressable
            onPress={() => {
              setIsPm(false);
              setKeyboard(false);
            }}
            style={[styles.ampmSeg, !isPm && styles.ampmSegOn]}
          >
            <Text style={[styles.ampmTxt, !isPm && styles.ampmTxtOn]}>
              AM
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsPm(true);
              setKeyboard(false);
            }}
            style={[styles.ampmSeg, isPm && styles.ampmSegOn]}
          >
            <Text style={[styles.ampmTxt, isPm && styles.ampmTxtOn]}>
              PM
            </Text>
          </Pressable>
        </View>
      </View>

      {keyboard ? (
        <View style={styles.kbBlock}>
          <View style={styles.kbRow}>
            <Text style={styles.kbHint}>Hour (1–12)</Text>
            <TextInput
              style={styles.kbInput}
              value={kbHour}
              onChangeText={(t) => setKbHour(t.replace(/\D/g, '').slice(0, 2))}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={styles.kbRow}>
            <Text style={styles.kbHint}>Minute (0–59)</Text>
            <TextInput
              style={styles.kbInput}
              value={kbMin}
              onChangeText={(t) => setKbMin(t.replace(/\D/g, '').slice(0, 2))}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>
      ) : (
        <View style={styles.clockWrap}>
          <Svg width={CLOCK} height={CLOCK} style={styles.clockSvg}>
            <Circle
              cx={CX}
              cy={CY}
              r={R_NUM + 8}
              fill={colors.gray[100]}
            />
            <Line
              x1={CX}
              y1={CY}
              x2={CX + 92 * Math.cos(handAngle)}
              y2={CY + 92 * Math.sin(handAngle)}
              stroke={B}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <Circle cx={CX} cy={CY} r={4} fill={B} />
            {dial === 'hour'
              ? Array.from({ length: 12 }, (_, i) => {
                  const n = i + 1;
                  const p = posOnCircle(n, 12, R_NUM);
                  const selected = n === h12;
                  return selected ? (
                    <Circle
                      key={n}
                      cx={p.x}
                      cy={p.y}
                      r={18}
                      fill={B}
                    />
                  ) : null;
                })
              : MINUTE_DIAL.map((m) => {
                  const tick = m === 0 ? 0 : m / 5;
                  const p = posOnCircle(tick, 12, R_NUM);
                  const selected = m === minute;
                  return selected ? (
                    <Circle
                      key={m}
                      cx={p.x}
                      cy={p.y}
                      r={18}
                      fill={B}
                    />
                  ) : null;
                })}
          </Svg>
          {dial === 'hour'
            ? Array.from({ length: 12 }, (_, i) => {
                const n = i + 1;
                const p = posOnCircle(n, 12, R_NUM);
                const selected = n === h12;
                return (
                  <View
                    key={n}
                    style={[
                      styles.clockLabelAnchor,
                      {
                        left: p.x - LABEL_BOX / 2,
                        top: p.y - LABEL_BOX / 2,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Text
                      style={[
                        styles.clockLbl,
                        {
                          color: selected ? colors.base.white : colors.gray[700],
                        },
                      ]}
                    >
                      {n}
                    </Text>
                  </View>
                );
              })
            : MINUTE_DIAL.map((m) => {
                const tick = m === 0 ? 0 : m / 5;
                const p = posOnCircle(tick, 12, R_NUM);
                const selected = m === minute;
                return (
                  <View
                    key={m}
                    style={[
                      styles.clockLabelAnchor,
                      {
                        left: p.x - LABEL_BOX / 2,
                        top: p.y - LABEL_BOX / 2,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <Text
                      style={[
                        styles.clockLblSm,
                        {
                          color: selected ? colors.base.white : colors.gray[700],
                        },
                      ]}
                    >
                      {PAD2(m)}
                    </Text>
                  </View>
                );
              })}
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {dial === 'hour'
              ? Array.from({ length: 12 }, (_, i) => {
                  const n = i + 1;
                  const p = posOnCircle(n, 12, R_NUM);
                  return (
                    <Pressable
                      key={n}
                      onPress={() => {
                        setH12(n);
                        setDial('minute');
                      }}
                      style={[
                        styles.hitDot,
                        { left: p.x - 22, top: p.y - 22 },
                      ]}
                    />
                  );
                })
              : MINUTE_DIAL.map((m) => {
                  const tick = m === 0 ? 0 : m / 5;
                  const p = posOnCircle(tick, 12, R_NUM);
                  return (
                    <Pressable
                      key={m}
                      onPress={() => {
                        setMinute(m);
                        setDial('hour');
                      }}
                      style={[
                        styles.hitDot,
                        { left: p.x - 22, top: p.y - 22 },
                      ]}
                    />
                  );
                })}
          </View>
        </View>
      )}

      <Divider
        color={colors.gray[200]}
        height={StyleSheet.hairlineWidth}
        marginVertical={8}
        width="100%"
      />

      <View style={styles.footerWrap}>
        {/* <View style={styles.footer}> */}
          <View style={styles.footerButtonStrip}>
            <FooterButtons
              leftButtonProps={{
                children: 'Cancel',
                size: 44,
                buttonColor: colors.base.white,
                textColor: colors.gray[700],
                borderColor: colors.gray[200],
                borderWidth: 1,
                borderRadius: 10,
                onPress: onBack,
              }}
              rightButtonProps={{
                children: 'Apply',
                size: 44,
                buttonColor: colors.brand[600],
                textColor: colors.base.white,
                borderRadius: 10,
                onPress: onConfirmPress,
              }}
              footerStyle={styles.footerButtonsSurround}
            />
          {/* </View> */}
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 0,
    paddingBottom: 4,
    backgroundColor: colors.base.white,
  },
  contentColumn: {
    width: CLOCK,
    maxWidth: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subDate: {
    textAlign: 'center',
    marginBottom: 10,
  },
  digitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  digBox: {
    minWidth: 58,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  digBoxActive: {
    borderColor: B,
    backgroundColor: colors.brand[25],
  },
  digBoxIdle: {
    borderColor: colors.gray[200],
    backgroundColor: colors.base.white,
  },
  digText: { fontSize: 36, fontWeight: '600' },
  digTextActive: { color: B },
  digTextIdle: { color: colors.gray[600] },
  colon: {
    fontSize: 36,
    fontWeight: '500',
    color: colors.gray[800],
    marginHorizontal: 4,
  },
  ampmCol: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    overflow: 'hidden',
  },
  ampmSeg: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: colors.base.white },
  ampmSegOn: { backgroundColor: B_LIGHT },
  ampmTxt: { fontSize: 13, fontWeight: '700', color: colors.gray[600] },
  ampmTxtOn: { color: B },
  clockWrap: {
    width: CLOCK,
    height: CLOCK,
    alignSelf: 'center',
    marginBottom: 4,
  },
  clockSvg: { position: 'absolute', left: 0, top: 0 },
  clockLabelAnchor: {
    position: 'absolute',
    width: LABEL_BOX,
    height: LABEL_BOX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockLbl: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  clockLblSm: {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  hitDot: { position: 'absolute', width: 44, height: 44 },
  kbBlock: { gap: 8, marginBottom: 8 },
  kbRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kbHint: { color: colors.gray[700] },
  kbInput: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    minWidth: 64,
    padding: 8,
    fontSize: 18,
    textAlign: 'center',
  },
  footerWrap: {
    flex:1,
    // alignSelf: 'center',
    width: CLOCK,
    maxWidth: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  kbIconBtn: {
    padding: 6,
    alignSelf: 'center',
  },
  footerButtonStrip: {
    flex: 1,
     width: '100%'
  },
  footerButtonsSurround: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
});
