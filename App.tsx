import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ConnectionScreen from './src/ConnectionScreen';
import DeviceListScreen from './src/DeviceListScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { BtHeadsetConnections } from './src/BtHeadsetConnections';
import { BleScreen } from './src/BleScreen';

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.navigate('DeviceStack')} title="Go to Device List Screen" />
        </View>
    );
}

const DeviceConnectionStack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DeviceStack() {
    return (
        <DeviceConnectionStack.Navigator initialRouteName="DeviceListScreen">
            <DeviceConnectionStack.Screen name="DeviceListScreen" component={DeviceListScreen} />
            <DeviceConnectionStack.Screen name="ConnectionScreen" component={ConnectionScreen} />
        </DeviceConnectionStack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" lazy={true}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="DeviceStack" component={DeviceStack} />
                <Drawer.Screen name="BtHeaderConnection" component={BtHeadsetConnections} />
                <Drawer.Screen name="BleScreen" component={BleScreen} options={{ unmountOnBlur: true }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
