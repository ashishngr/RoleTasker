import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import AssignerHomeScreen from "../screens/Assigner/AssignerHomeScreen";
import Profile from "../screens/Assigner/Profile";
import Notifications from "../screens/Assigner/Notifications";
import Tasks from "../screens/Assigner/Tasks";
import AssigneeNavbar from "../components/AssigneeBottomHeader";

const AssigneeStack = createStackNavigator();

const AssigneeRoutes = () => {
    return (
        <>
            <AssigneeStack.Navigator initialRouteName="AssigneeHome">
                <AssigneeStack.Screen name="AssigneeHome" component={AssignerHomeScreen} options={{ title: 'Assigner Home' }} />
                <AssigneeStack.Screen name="AssigneeTasks" component={Tasks} options={{ title: 'Tasks' }} />
                <AssigneeStack.Screen name="AssigneeNotifications" component={Notifications} options={{ title: 'Notifications' }} />
                <AssigneeStack.Screen name="AssigneeProfile" component={Profile} options={{ title: 'Profile' }} />
            </AssigneeStack.Navigator>
            <AssigneeNavbar />
        </>
    );
};

export default AssigneeRoutes;
