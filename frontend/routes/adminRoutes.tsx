import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeScreen from "../screens/Admin/AdminHomeScreen";
import Profile from "../screens/Admin/Profile";
import Notifications from "../screens/Admin/Notifications";
import Tasks from "../screens/Admin/Tasks";
import AdminNavbar from "../components/AdminBottomHeader";

const AdminStack = createStackNavigator();


const AdminRoutes = () =>{
    return(
        <>
        <AdminStack.Navigator initialRouteName="AdminHome">
            <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Home' }} />
            <AdminStack.Screen name="AdminTasks" component={Tasks} options={{ title: 'Tasks' }} />
            <AdminStack.Screen name="AdminNotifications" component={Notifications} options={{ title: 'Notifications' }} />
            <AdminStack.Screen name="AdminProfile" component={Profile} options={{ title: 'Profile' }} />
        </AdminStack.Navigator>
        <AdminNavbar />
        </>
        
    )
}; 

export default AdminRoutes