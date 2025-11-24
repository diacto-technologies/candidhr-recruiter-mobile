import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission as requestMessagingPermission,
  getInitialNotification,
  setBackgroundMessageHandler,
  AuthorizationStatus,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  EventType,
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

export const messaging = getMessaging(); // 👈 instance

type PermissionStatus = 'granted' | 'denied' | 'unknown';

interface UseFirebaseMessagingReturn {
  token: string | null;
  permissionStatus: PermissionStatus;
  requestPermission: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
}

export const useFirebaseMessaging = (): UseFirebaseMessagingReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('unknown');

  const requestPermission = useCallback(async () => {
    try {
      const authStatus = await requestMessagingPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      setPermissionStatus(enabled ? 'granted' : 'denied');
      return enabled;
    } catch (error) {
      console.error('Failed to request permission', error);
      setPermissionStatus('denied');
      return false;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const freshToken = await getToken(messaging);
      setToken(freshToken);
    } catch (error) {
      console.error('Failed to get FCM token', error);
    }
  }, []);

  const createDefaultChannel = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const channelId = await notifee.createChannel({
          id: 'default_channel',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      } catch (error) {
        console.error('Failed to create default channel:', error);
      }
    }
  }, []);

  const displayNotification = useCallback(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      try {
        const channelId = await notifee.createChannel({
          id: 'default_channel',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });

        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          data: remoteMessage?.data,
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'default',
            },
            style: {
              type: AndroidStyle.BIGTEXT,
              text: 'text',
              title: remoteMessage?.notification?.title,
              summary: remoteMessage?.notification?.body,
            },
            sound: 'default',
          },
          ios: {
            sound: 'default',
            attachments: [],
          },
        });
      } catch (error) {
        console.error('Failed to display notification:', error);
      }
    },
    []
  );

  useEffect(() => {
    const initializeMessaging = async () => {
      await createDefaultChannel();
      const granted = await requestPermission();
      if (granted) {
        await refreshToken();
      }
    };

    initializeMessaging();

    // Foreground messages
    const unsubscribeOnMessage = onMessage(messaging, async remoteMessage => {
      await displayNotification(remoteMessage);
    });

    // Background handler
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      // await displayNotification(remoteMessage);
    });

    // Opened app from background
    const unsubscribeOpened = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        if (remoteMessage) {
          // Linking.openURL(
          //   `sphereblood://app-open/blood/request/details/${remoteMessage?.data?._request}/${remoteMessage?.data?._requester}`
          // );
        }
      }
    );

    // Token refresh
    const unsubscribeTokenRefresh = onTokenRefresh(messaging, newToken => {
      setToken(newToken);
    });

    // Notifee events
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
        case EventType.ACTION_PRESS:
          // Handle background action
          break;
      }
    });

    notifee.onForegroundEvent(async ({ type, detail }) => {
      const { notification } = detail;
      switch (type) {
        case EventType.PRESS:
          // Linking.openURL(
          //   `sphereblood://app-open/blood/request/details/${notification?.data?._request}/${notification?.data?._requester}`
          // );
          break;
        case EventType.ACTION_PRESS:
          break;
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOpened();
      unsubscribeTokenRefresh();
    };
  }, [
    requestPermission,
    refreshToken,
    permissionStatus,
    createDefaultChannel,
    displayNotification,
  ]);

  return {
    token,
    permissionStatus,
    requestPermission,
    refreshToken,
  };
};
