import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Typography from "../../../../components/atoms/typography";
import { colors } from "../../../../theme/colors";
import { useStyles } from "./styles";
import { Button, CommonDropdown, TextField } from "../../../../components";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { getRolesRequestAction, selectRolesListItems } from "../../../../features/profile/users";
import { shadowStyles } from "../../../../theme/shadowcolor";
import { SvgXml } from "react-native-svg";
import { closeIcon } from "../../../../assets/svg/closeicon";

export interface AddUserValues {
  name: string;
  email: string;
  role: number | null;
}

interface AddUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: AddUserValues) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ visible, onClose, onSubmit }) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRolesListItems);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setName("");
      setEmail("");
      setRole(null);
      return;
    }
    dispatch(getRolesRequestAction(1));
  }, [dispatch, visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    onSubmit({ name, email, role });
  }, [email, name, onSubmit, role]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <View style={styles.submodalCard}>
          <View style={styles.modalHeader}>
            <Typography variant="semiBoldTxtlg" color={colors.gray[900]}>
              Add User
            </Typography>

            <Pressable onPress={handleClose} hitSlop={10}>
              <SvgXml xml={closeIcon}/>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <View>
              <View style={styles.fieldLabelRow}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Name
                </Typography>
              </View>
              <TextField
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={colors.gray[400]}
                style={styles.textInput}
                autoCapitalize="words"
              />
            </View>

            <View>
              <View style={styles.fieldLabelRow}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                  Email
                </Typography>
              </View>
              <TextField
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor={colors.gray[400]}
                style={styles.textInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <View style={styles.fieldLabelRow}>
                <Typography variant="semiBoldTxtsm" color={colors.gray[800]}>
                  Role
                </Typography>
              </View>

              <CommonDropdown
                placeholder="Select a role..."
                options={roles}
                value={role}
                onChange={(nextValue) => setRole(nextValue)}
                labelKey="name"
                valueKey="id"
                showIndexAndTotal={false}
                mode="default"
                dropdownPosition="bottom"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection:'row',
              margin:16,
            }}
          >
            <View style={{flex:1,paddingRight:5}}>
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
            <View style={{flex:1,paddingLeft:5}}>
            <Button
              variant="contain"
              buttonColor={colors.brand[600]}
              textColor={colors.base.white}
              borderRadius={8}
              onPress={handleSubmit}
            >
              Add
            </Button>
            </View>
          </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

