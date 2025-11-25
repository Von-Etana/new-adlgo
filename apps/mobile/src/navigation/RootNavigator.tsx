import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Screens
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverKYCScreen from '../screens/driver/DriverKYCScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';

import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CreateDeliveryScreen from '../screens/customer/CreateDeliveryScreen';
import FindingDriverScreen from '../screens/customer/FindingDriverScreen';
import TrackingScreen from '../screens/customer/TrackingScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import BillPaymentScreen from '../screens/wallet/BillPaymentScreen';

import ProfileScreen from '../screens/common/ProfileScreen';
import ChatScreen from '../screens/common/ChatScreen';
import DeliveryCompletionScreen from '../screens/common/DeliveryCompletionScreen';

import ModeSwitch from '../components/ModeSwitch';

// Placeholders for other screens
const PlaceholderScreen = ({ name }: { name: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name}</Text>
    </View>
);

import { RootStackParamList } from '../types/navigation';

// Stacks
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Customer Stack (Home -> Create -> Find -> Track -> Chat -> Complete)
const CustomerHomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={CustomerHomeScreen} />
        <Stack.Screen name="CreateDelivery" component={CreateDeliveryScreen} />
        <Stack.Screen name="FindingDriver" component={FindingDriverScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="DeliveryCompletion" component={DeliveryCompletionScreen} />
    </Stack.Navigator>
);

// Wallet Stack (Wallet -> Bill Payment)
const WalletStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WalletMain" component={WalletScreen} />
        <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
    </Stack.Navigator>
);

// Customer Tabs
const CustomerTabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={CustomerHomeStack} />
        <Tab.Screen name="Activity" children={() => <PlaceholderScreen name="Activity" />} />
        <Tab.Screen name="Wallet" component={WalletStack} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

// Driver Tabs
const DriverTabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Go Online" component={DriverHomeScreen} />
        <Tab.Screen name="Earnings" component={EarningsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useAuth } from '../context/AuthContext';

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
);

// Driver Stack
const DriverStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="DriverKYC">
        <Stack.Screen name="DriverKYC" component={DriverKYCScreen} />
        <Stack.Screen name="DriverHome" component={DriverTabs} />
    </Stack.Navigator>
);

const RootNavigator = () => {
    const { user, loading } = useAuth();
    // In a real app, this state comes from Zustand or Context
    const [userMode, setUserMode] = useState<'customer' | 'driver'>('customer');

    if (loading) {
        return <PlaceholderScreen name="Loading..." />;
    }

    if (!user) {
        return (
            <NavigationContainer>
                <AuthStack />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <View style={{ flex: 1 }}>
                {/* Global Header with Mode Switch */}
                <View style={{ paddingTop: 50, backgroundColor: '#fff', alignItems: 'center', zIndex: 100 }}>
                    <ModeSwitch mode={userMode} onSwitch={setUserMode} />
                </View>

                {/* Conditional Navigation Stack */}
                {userMode === 'customer' ? <CustomerTabs /> : <DriverStack />}
            </View>
        </NavigationContainer>
    );
};

export default RootNavigator;
