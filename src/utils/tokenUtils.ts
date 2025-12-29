/**
 * Token utility functions for managing authentication tokens
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';

/**
 * Save auth token to AsyncStorage
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

/**
 * Get auth token from AsyncStorage
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Save refresh token to AsyncStorage
 */
export const saveRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

/**
 * Get refresh token from AsyncStorage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Remove all tokens from AsyncStorage
 */
export const removeTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error removing tokens:', error);
    throw error;
  }
};

/**
 * Check if user has a valid token
 */
export const hasToken = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null && token.length > 0;
};

















