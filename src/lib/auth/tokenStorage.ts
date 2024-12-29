import * as SecureStore from 'expo-secure-store';

const tokenKey = "authorization";

export const setToken = (token: string) => {
  return SecureStore.setItemAsync(tokenKey, token);
};

export const getToken = () => {
  return SecureStore.getItemAsync(tokenKey);
};

export const clearToken = () => {
  return SecureStore.deleteItemAsync(tokenKey);
};