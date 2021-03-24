import * as React from 'react';
import { Platform, Text, UIManager, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ConnectionScreen from './src/ConnectionScreen';
import DeviceListScreen from './src/DeviceListScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { BtHeadsetConnections } from './src/BtHeadsetConnections';
import { BleScreen } from './src/BleScreen';
import { FlatListRowDelete } from './src/FlatListRowDelete';
import { TabBarAndShuffle } from './src/TabBarAndShuffle';
import { KeyboardCoveringScreen } from "./src/KeyboardAvoidingViews/KeyboardCoveringScreen";
import { KeyboardAvoidingViewScreen } from "./src/KeyboardAvoidingViews/KeyboardAvoidingViewScreen";
import { KeyboardAwareScrollViewScreen } from "./src/KeyboardAvoidingViews/KeyboardAwareScrollViewScreen";
import { KeyboardModuleScreen } from "./src/KeyboardAvoidingViews/KeyboardModuleScreen";
import { ComboScreen } from "./src/KeyboardAvoidingViews/ComboScreen";
import { CustomScrollView } from "./src/CustomScrollView";
import { CustomScrollViewF } from "./src/CustomScrollViewF";
import { AlphabetFlatListScreen } from "./src/AlphabetFlatListScreen";
import RecycleTestScreen from "./src/RecycleTestScreen";
import AlphabetRecycleScreen from "./src/AlphabetRecycleScreen";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
            <Text>Home Screen</Text>
            {/*<Button onPress={() => navigation.navigate('DeviceStack')} title="Go to Device List Screen" />*/}
            {/*<Button onPress={() => navigation.navigate('FlatListRowDelete')} title="Go to FlatListRowDeleteScreen" />*/}
            {/*<Button onPress={() => navigation.navigate('TabBarAndShuffleScreen')} title="Go to TabBarAndShuffleScreen" />*/}
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
            <Drawer.Navigator initialRouteName="Home" lazy={true} detachInactiveScreens={true} screenOptions={{ unmountOnBlur: true }} drawerPosition={"left"} edgeWidth={100}>
                <Drawer.Screen name="Home" component={HomeScreen} />

                <Drawer.Screen name="AlphabetRecycleScreen" component={AlphabetRecycleScreen} />
                <Drawer.Screen name="RecycleTestScreen" component={RecycleTestScreen} />
                <Drawer.Screen name="AlphabetFlatList" component={AlphabetFlatListScreen} />
                <Drawer.Screen name="CustomScrollView" component={CustomScrollView} />
                <Drawer.Screen name="CustomScrollViewF" component={CustomScrollViewF} />

                <Drawer.Screen name="DeviceStack" component={DeviceStack} />
                <Drawer.Screen name="KeyboardCoveringScreen" component={KeyboardCoveringScreen} />
                <Drawer.Screen name="KeyboardAvoidingViewScreen" component={KeyboardAvoidingViewScreen} />
                <Drawer.Screen name="KeyboardAwareScrollViewScreen" component={KeyboardAwareScrollViewScreen} />
                <Drawer.Screen name="KeyboardModuleScreen" component={KeyboardModuleScreen} />
                <Drawer.Screen name="ComboScreen" component={ComboScreen} />

                <Drawer.Screen name="BtHeaderConnection" component={BtHeadsetConnections} />
                <Drawer.Screen name="BleScreen" component={BleScreen} />
                <Drawer.Screen name="FlatListRowDelete" component={FlatListRowDelete} />
                <Drawer.Screen name="TabBarAndShuffleScreen" component={TabBarAndShuffle} />

            </Drawer.Navigator>
        </NavigationContainer>
    );
}
