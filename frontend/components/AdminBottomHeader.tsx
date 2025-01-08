// components/AdminNavbar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import StorageUtils from '../utils/storage_utils';

type AdminStackParamList = {
  AdminHome: undefined;
  AdminTasks: undefined;
  AdminNotifications: undefined;
  AdminProfile: undefined;
  SignIn: undefined;
};

type AdminNavbarProps = StackNavigationProp<AdminStackParamList>; 

const AdminNavbar: React.FC = () => {
  const navigation = useNavigation<AdminNavbarProps>();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<string>('AdminHome'); 

  const handleNavigate = (screenName: string) => {
    setActiveTab(screenName);
    navigation.navigate('AdminRoutes', { screen: screenName });
  }; 

  const handleLogout = async () => {
    await StorageUtils.removeAll();
    navigation.navigate('SignIn');
  };







  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => handleNavigate('AdminHome')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AdminHome' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="home"
            size={28}
            style={[styles.icon, activeTab === 'AdminHome' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AdminTasks')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AdminTasks' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="clipboard-text"
            size={28}
            style={[styles.icon, activeTab === 'AdminTasks' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AdminNotifications')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AdminNotifications' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="bell"
            size={28}
            style={[styles.icon, activeTab === 'AdminNotifications' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AdminProfile')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AdminProfile' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="account"
            size={28}
            style={[styles.icon, activeTab === 'AdminProfile' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigate('AdminAnalytics')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AdminAnalytics' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="chart-bar"
            size={28}
            style={[styles.icon, activeTab === 'AdminAnalytics' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.navItem}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="logout" size={28} style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingBottom: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 8,
  },
  icon: {
    color: '#888888',
  },
  activeIconWrapper: {
    backgroundColor: '#007AFF',
  },
  activeIcon: {
    color: '#ffffff',
  },
});

export default AdminNavbar;
