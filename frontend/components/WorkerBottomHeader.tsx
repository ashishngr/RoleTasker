import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import StorageUtils from '../utils/storage_utils';

type WorkerStackParamList = {
    WorkerHome: undefined;
    WorkerTasks: undefined;
    WorkerNotifications: undefined;
    WorkerProfile: undefined;
    SignIn: undefined;
};

type WorkerNavbarProps = StackNavigationProp<WorkerStackParamList>;

const WorkerNavbar:React.FC = () => {
    const navigation = useNavigation<WorkerNavbarProps>();
    const [activeTab, setActiveTab] = useState<string>('AdminHome');
  
    const handleNavigate = (screenName: string) => {
      setActiveTab(screenName);
      navigation.navigate(screenName as keyof WorkerStackParamList);
    };
  
    const handleLogout = async () => {
      await StorageUtils.removeAll();
      navigation.navigate('SignIn');
    };
    return (
        <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => handleNavigate('WorkerHome')} style={styles.navItem}>
          <View style={[styles.iconWrapper, activeTab === 'WorkerHome' && styles.activeIconWrapper]}>
            <MaterialCommunityIcons
              name="home"
              size={28}
              style={[styles.icon, activeTab === 'WorkerHome' && styles.activeIcon]}
            />
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => handleNavigate('WorkerTasks')} style={styles.navItem}>
          <View style={[styles.iconWrapper, activeTab === 'WorkerTasks' && styles.activeIconWrapper]}>
            <MaterialCommunityIcons
              name="clipboard-text"
              size={28}
              style={[styles.icon, activeTab === 'WorkerTasks' && styles.activeIcon]}
            />
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => handleNavigate('WorkerNotifications')} style={styles.navItem}>
          <View style={[styles.iconWrapper, activeTab === 'WorkerNotifications' && styles.activeIconWrapper]}>
            <MaterialCommunityIcons
              name="bell"
              size={28}
              style={[styles.icon, activeTab === 'WorkerNotifications' && styles.activeIcon]}
            />
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => handleNavigate('WorkerProfile')} style={styles.navItem}>
          <View style={[styles.iconWrapper, activeTab === 'WorkerProfile' && styles.activeIconWrapper]}>
            <MaterialCommunityIcons
              name="account"
              size={28}
              style={[styles.icon, activeTab === 'WorkerProfile' && styles.activeIcon]}
            />
          </View>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={handleLogout} style={styles.navItem}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="logout" size={28} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
    )
}
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

export default WorkerNavbar; 
