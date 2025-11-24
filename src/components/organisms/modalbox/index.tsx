import React, { Fragment } from 'react';
import { Modal, View, Pressable, Image } from 'react-native';
import { IModalBox } from './modalbox';
import { useStyles } from './styles';
import Typography from '../../atoms/typography';
import { colors } from '../../../theme/colors';
import LottieView from 'lottie-react-native';
import IconButton from '../../atoms/iconbutton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../atoms/button';
import { RootStackParamList } from '../../../types/navigation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'app/modalbox'>;
const ModalBox = (props: IModalBox) => {
  const navigation = useNavigation<NavigationProps>();
  const styles = useStyles();

  const renderAnimation = () =>
    props.showGreenModal ? (
      // <Image
      //   source={require('../../assets/gifs/trackOrder.gif')}
      //   style={styles.gifImage}
      //   resizeMode="contain"
      // />
      <></>
    ) : (
      // <LottieView
      //   source={require('../../assets/animations/success.json')}
      //   autoPlay
      //   loop={false}
      //   style={styles.lottieStyle}
      // />
      <></>
    );

  const renderTitle = () => {
    if (!props.title) return null;

    return (
      <Typography
        variant={props.showGreenModal ? 'H1C' : 'H3B'}
        color={
          props.showGreenModal
            ? colors.mainColors.brightYellow
            : props.showWhiteModal
              ? colors.mainColors.dark_green
              : colors.common.black
        }
        style={{ textAlign: 'center' }}
      >
        {props.title}
      </Typography>
    );
  };

  const renderMessage = () => {
    if (!props.message) return null;

    if (props.showGreenModal) {
      return (
        <Typography variant="H5B" color={colors.common.white} style={{ textAlign: 'center' }}>
          {props.message}
          <Typography variant="H1B" color={colors.common.white}>
            {' '}
            {/* Currency component removed - add if needed */}
            {props.amount}
          </Typography>
        </Typography>
      );
    }

    return (
      <Typography variant="P1C" color={colors.grayScale.darkGray} style={{ textAlign: 'center' }}>
        {props.message}
      </Typography>
    );
  };

  return (
    <Fragment>
      <Modal visible={props.visible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: props.backgroundColor || colors.common.white,
                width: props.width ?? screenWidth,
                height: props.height ?? screenHeight,
                borderRadius: props.borderRadius ?? 10,
              },
            ]}
          >
            {props.showWhiteModal ? null : (
              <View style={styles.closeButtonWrapper}>
                <IconButton onPress={props.onClose} size={24} variant="text">
                  <Ionicons name="close-outline" size={24} />
                </IconButton>
              </View>
            )}
            {renderAnimation()}
            <View style={styles.distanceStyle}>
              {renderTitle()}
              {renderMessage()}
            </View>
            {props.children}

            {props.showWhiteModal ? (
              <View style={styles.whiteModalButtonContainer}>
                <View style={styles.flexView}>
                  <Button
                    onPress={() => {
                      props.onButtonPress?.();
                      navigation.navigate("app/start")
                    }}
                    variant="outline">Goto Home</Button>
                </View>
                <View style={styles.flexView}>
                  <Button
                    onPress={() => {
                      props.onButtonPress?.();
                      navigation.navigate('customer/order/track', { _order: props.data?.order_number as string, _id: props.data?.id as string });
                    }}
                  >Track Order</Button>
                </View>
              </View>
            ) : (
              <Pressable
                style={[styles.button, props.buttonStyle]}
                onPress={props.onButtonPress || props.onClose}
              >
                <Typography
                  variant="H1B"
                  color={props.showGreenModal ? colors.mainColors.main : colors.common.white}
                  style={{ textAlign: 'center' }}
                >
                  {props.buttonText}
                </Typography>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default ModalBox;
