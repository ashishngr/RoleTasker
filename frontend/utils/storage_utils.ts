// utils/StorageUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_PROFILE: 'user_profile',
} as const;

type UserProfile = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: {
    canAddNotes: boolean;
    canAssignTasks: boolean;
    canCreateTasks: boolean;
    canUpdateTaskStatus: boolean;
    canViewAllTasks: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

const StorageUtils = {
  // Get the API token from storage
  getAPIToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (e) {
      console.error('Error getting API token', e);
      return null;
    }
  },

  // Set the API token in storage
  setAPIToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (e) {
      console.error('Error setting API token', e);
    }
  },

  // Get the user profile from storage
  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      const userProfile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (e) {
      console.error('Error getting user profile', e);
      return null;
    }
  },

  // Set the user profile in storage
  setUserProfile: async (user: UserProfile): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (e) {
      console.error('Error setting user profile', e);
    }
  },

  // Remove all stored auth data
  removeAll: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  },
};

export default StorageUtils;
