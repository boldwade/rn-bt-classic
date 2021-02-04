import * as React from 'react';
import { Button, Platform, UIManager, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ConnectionScreen from './src/ConnectionScreen';
import DeviceListScreen from './src/DeviceListScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { BtHeadsetConnections } from './src/BtHeadsetConnections';
import { BleScreen } from './src/BleScreen';
import { FlatListRowDelete } from './src/FlatListRowDelete';
import { TabBarAndShuffle } from './src/TabBarAndShuffle';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
            <Button onPress={() => navigation.navigate('DeviceStack')} title="Go to Device List Screen" />
            <Button onPress={() => navigation.navigate('FlatListRowDelete')} title="Go to FlatListRowDeleteScreen" />
            <Button onPress={() => navigation.navigate('TabBarAndShuffleScreen')} title="Go to TabBarAndShuffleScreen" />
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
            <Drawer.Navigator initialRouteName="Home" lazy={true} detachInactiveScreens={true} screenOptions={{ unmountOnBlur: true }}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="DeviceStack" component={DeviceStack} />
                <Drawer.Screen name="BtHeaderConnection" component={BtHeadsetConnections} />
                <Drawer.Screen name="BleScreen" component={BleScreen} />
                <Drawer.Screen name="FlatListRowDelete" component={FlatListRowDelete} />
                <Drawer.Screen name="TabBarAndShuffleScreen" component={TabBarAndShuffle} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
