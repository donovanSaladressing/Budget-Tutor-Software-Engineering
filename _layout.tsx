import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '.';

export default function TabLayout() {
    return(
        <Tabs
            screenOptions ={{
                headerShown: false,
                tabBarActiveTintColor: '#0097B2',
            }}
        >
            <Tabs.Screen 
            name = "index" 
            options = {{ 
                title: 'Home',
                tabBarIcon: ({ color, focused}) => (
                    <Ionicons name = {focused ? 'home-sharp' : 'home-outline'}
                    color = {color}
                    size = {24}
                    />
                )
                }} />
            <Tabs.Screen
            name = "accounts"
            options = {{
                title: 'Accounts',
                tabBarIcon: ({color, focused}) => (
                    <Ionicons name = {focused ? 'list-sharp' : 'list-outline'}
                    color = {color}
                    size = {24}
                    />
                )
            }}
            />
            
            <Tabs.Screen
            name = "transactions"
            options = {{
                title: 'Transactions',
                tabBarIcon: ({color, focused}) => (
                    <Ionicons name = {focused ? 'analytics-sharp' : 'analytics-outline'}
                    color = {color}
                    size = {24}
                    />
                )
            }}
            />
        </Tabs>
    )

}


