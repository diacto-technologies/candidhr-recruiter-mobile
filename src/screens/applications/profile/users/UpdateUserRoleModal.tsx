import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Typography from '../../../../components/atoms/typography';
import { colors } from '../../../../theme/colors';
import { useStyles } from './styles';
import { Button, CommonDropdown } from '../../../../components';
import { closeIcon } from '../../../../assets/svg/closeicon';
import { SvgXml } from 'react-native-svg';

export interface UpdateUserRoleValues {
  userId: string;
  role: string;
}

export interface UpdateUserRoleUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UpdateUserRoleModalProps {
  visible: boolean;
  user: UpdateUserRoleUser | null;
  onClose: () => void;
  onSubmit: (values: UpdateUserRoleValues) => void;
  roleOptions?: string[];
}

const DEFAULT_ROLE_OPTIONS = ['Admin', 'Recruiter', 'Hiring manager'];

export const UpdateUserRoleModal: React.FC<UpdateUserRoleModalProps> = ({
  visible,
  user,
  onClose,
  onSubmit,
  roleOptions,
}) => {
  const styles = useStyles();
  const roles = useMemo(() => roleOptions ?? DEFAULT_ROLE_OPTIONS, [roleOptions]);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    if (!visible) {
      setRole('');
      return;
    }
    setRole(user?.role && user.role !== '-' ? user.role : roles[0] ?? '');
  }, [roles, user?.role, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!user?.id || !role) return;
    onSubmit({ userId: user.id, role });
  }, [onSubmit, role, user?.id]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalCard}>
        <View style={styles.submodalCard}>
          <View style={styles.modalHeader}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Update User&apos;s Role
            </Typography>

            <Pressable onPress={handleClose} hitSlop={10}>
            <SvgXml xml={closeIcon}/>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <View>
              <View style={styles.fieldLabelRow}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                  Select Role
                </Typography>
              </View>

              <CommonDropdown
                placeholder="Select a role..."
                options={roles.map((r) => ({ id: r, name: r }))}
                value={role}
                onChange={(nextValue) => setRole(nextValue)}
                labelKey="name"
                valueKey="id"
                showIndexAndTotal={false}
                mode="default"
                dropdownPosition="bottom"
              />
            </View>

            {!!role && (
              <View style={styles.infoBanner}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.warning[700] ?? colors.gray[700]}
                />
                <Typography
                  style={styles.infoBannerText}
                  variant="regularTxtsm"
                  color={colors.warning[700] ?? colors.gray[700]}
                >
                  The role{' '}
                  <Typography variant="semiBoldTxtsm" color={colors.warning[700] ?? colors.gray[700]}>
                    {role}
                  </Typography>{' '}
                  will be assigned to the user upon update.
                </Typography>
              </View>
            )}
          </View>

          <View style={styles.updateRoleFooter}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Button
                variant="contain"
                buttonColor={colors.base.white}
                textColor={colors.gray[700]}
                borderRadius={8}
                borderColor={colors.gray[300]}
                borderWidth={1}
                onPress={handleClose}
              >
                Cancel
              </Button>
            </View>
            <View style={{ flex: 1, paddingLeft: 5 }}>
              <Button
                variant="contain"
                buttonColor={colors.brand[600]}
                textColor={colors.base.white}
                borderRadius={8}
                onPress={handleSubmit}
              >
                Update
              </Button>
            </View>
          </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

