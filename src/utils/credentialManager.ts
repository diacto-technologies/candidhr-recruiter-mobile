import { signUpWithPassword } from 'react-native-credentials-manager';
import { config } from '../config';

/**
 * Extract domain from URL
 */
const extractDomain = (url: string): string => {
  try {
    // React Native doesn't have URL constructor, so we parse manually
    const match = url.match(/https?:\/\/([^\/]+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    // Fallback
  }
  // Default domain if parsing fails
  return 'candidhr.com';
};


export const saveCredentialsToPasswordManager = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await signUpWithPassword({
      username: email,
      password: password,
    });
    
    if (__DEV__) {
      console.log('Credentials saved to password manager successfully');
    }
  } catch (error: any) {
    if (__DEV__) {
      console.log('Password manager save result:', error.message || 'User dismissed or already exists');
    }
  }
};
