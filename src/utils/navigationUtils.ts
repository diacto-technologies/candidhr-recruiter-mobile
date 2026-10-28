import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const BOTTOM_TAB_SCREENS = ['Dashboard', 'JobsScreen', 'ApplicantScreen', 'Profile'];

export async function navigate(routeName: string, params?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        if (BOTTOM_TAB_SCREENS.includes(routeName)) {
            navigationRef.dispatch(
                CommonActions.navigate('UserBottomTab', {
                    screen: routeName,
                    params,
                })
            );
            return;
        }
        navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
}

export async function replace(routeName: string, params?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        if (BOTTOM_TAB_SCREENS.includes(routeName)) {
            navigationRef.dispatch(
                CommonActions.navigate('UserBottomTab', {
                    screen: routeName,
                    params,
                })
            );
            return;
        }
        navigationRef.dispatch(StackActions.replace(routeName, params));
    }
}

export async function resetAndNavigate(routeName: string, params?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: routeName, params }],
            }),
        );
    }
}

export async function resetToDeepLink(targetName: string, targetParams?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                    { name: 'UserBottomTab' },
                    { name: targetName, params: targetParams },
                ],
            }),
        );
    }
}

export async function goBack(fallbackRoute?: string | unknown, fallbackParams?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        const canGoBack = navigationRef.canGoBack();
        const state = navigationRef.getRootState();
        const routes = state?.routes ?? [];
        // If history is empty, 1 screen, or only preceded by SplashScreen, regular pop will exit or get stuck
        const isOnlySplashBefore = routes.length <= 1 || (routes.length === 2 && routes[0].name === 'SplashScreen');

        if (canGoBack && !isOnlySplashBefore) {
            navigationRef.dispatch(CommonActions.goBack());
            return;
        }

        if (typeof fallbackRoute === 'string') {
            navigate(fallbackRoute, fallbackParams);
            return;
        }

        // Default fallback if opened directly from deep link: navigate to UserBottomTab
        navigate('UserBottomTab');
    }
}

export async function push(routeName: string, params?: object) {
    navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(routeName, params));
    }
}

export async function prepareNavigation() {
    navigationRef.isReady();
}