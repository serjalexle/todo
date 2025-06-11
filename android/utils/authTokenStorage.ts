import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const isAvailable = async (): Promise<boolean> => {
  try {
    return await SecureStore.isAvailableAsync();
  } catch (error) {
    console.error('🔐 SecureStore availability check failed:', error);
    return false;
  }
};

const save = async (tokens: AuthTokens): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch (error) {
    console.error('🔐 Failed to save tokens:', error);
    throw error;
  }
};

const getAccess = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('🔐 Failed to get access token:', error);
    return null;
  }
};

const getRefresh = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('🔐 Failed to get refresh token:', error);
    return null;
  }
};

const clear = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('🔐 Failed to clear tokens:', error);
    throw error;
  }
};

export const authTokens = {
  save,
  getAccess,
  getRefresh,
  clear,
  isAvailable,
};
