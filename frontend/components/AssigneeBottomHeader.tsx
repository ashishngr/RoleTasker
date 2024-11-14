// components/AssigneeNavbar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import StorageUtils from '../utils/storage_utils';

type AssigneeStackParamList = {
  AssigneeHome: undefined;
  AssigneeTasks: undefined;
  AssigneeNotifications: undefined;
  AssigneeProfile: undefined;
  SignIn: undefined;
};

type AssigneeNavbarProps = StackNavigationProp<AssigneeStackParamList>;

const AssigneeNavbar: React.FC = () => {
  const navigation = useNavigation<AssigneeNavbarProps>();
  const [activeTab, setActiveTab] = useState<string>('AssigneeHome');

  const handleNavigate = (screenName: string) => {
    setActiveTab(screenName);
    navigation.navigate('AssigneeRoutes', { screen: screenName });
  };

  const handleLogout = async () => {
    await StorageUtils.removeAll();
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => handleNavigate('AssigneeHome')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AssigneeHome' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="home"
            size={28}
            style={[styles.icon, activeTab === 'AssigneeHome' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AssigneeTasks')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AssigneeTasks' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="clipboard-text"
            size={28}
            style={[styles.icon, activeTab === 'AssigneeTasks' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AssigneeNotifications')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AssigneeNotifications' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="bell"
            size={28}
            style={[styles.icon, activeTab === 'AssigneeNotifications' && styles.activeIcon]}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleNavigate('AssigneeProfile')} style={styles.navItem}>
        <View style={[styles.iconWrapper, activeTab === 'AssigneeProfile' && styles.activeIconWrapper]}>
          <MaterialCommunityIcons
            name="account"
            size={28}
            style={[styles.icon, activeTab === 'AssigneeProfile' && styles.activeIcon]}
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

export default AssigneeNavbar;
