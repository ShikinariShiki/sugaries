import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const setAuthToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
};

export const removeAuthToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
};

export const setUserData = async (userData: any): Promise<void> => {
  await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
};

export const getUserData = async (): Promise<any | null> => {
  const data = await SecureStore.getItemAsync(USER_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeUserData = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_DATA_KEY);
};

export const clearAllStorage = async (): Promise<void> => {
  await removeAuthToken();
  await removeUserData();
};
