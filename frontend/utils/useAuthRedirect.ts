// hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import StorageUtils from '../utils/StorageUtils';

const useAuthRedirect = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await StorageUtils.getAPIToken();
                const userProfile = await StorageUtils.getUserProfile();
                console.log("User Profile", userProfile)

                if (token && userProfile) {
                    const userRole = userProfile.roles && userProfile.roles[0];
                    
                    console.log('User role:', userRole);
                    
                    // Navigate based on user role
                    if (userRole === 'Admin') {
                        navigation.navigate('AdminHome');
                    } else if (userRole === 'Worker') {
                        navigation.navigate('WorkerHome');
                    } else if (userRole === 'Assignee') {
                        navigation.navigate('AssigneeHome');
                    } else {
                        console.warn('Unrecognized role, redirecting to default SignIn');
                        navigation.navigate('SignIn'); // Default if role is not recognized
                    }
                } else {
                    console.log('No token or user profile found, staying on sign-in screen');
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
            }
        };

        checkAuthStatus();
    }, [navigation]);
};

export default useAuthRedirect;
