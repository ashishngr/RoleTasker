import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import AdminRoutes from './routes/adminRoutes';
import AssigneeRoutes from './routes/assignerRoutes';
import WorkerRoutes from './routes/workerRoutes';

import StorageUtils from './utils/storage_utils';
import { useEffect, useState } from 'react';

const Stack = createStackNavigator();

export default function App() {
  const queryClient = new QueryClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const userProfile = await StorageUtils.getUserProfile();
      if (userProfile && userProfile.roles && userProfile.roles.length > 0) {
        setUserRole(userProfile.roles[0]);
      }
    };

    checkUserRole();
  }, []);

  const renderUserStack = () => {
    return (
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
        <Stack.Screen name="AdminRoutes" component={AdminRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="AssigneeRoutes" component={AssigneeRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerRoutes" component={WorkerRoutes} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {renderUserStack()}
        <StatusBar style="auto" />
        <Toast />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
