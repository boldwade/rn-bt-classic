import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { addListener, getHeadset, removeListener, useBluetoothHeadsetDetection } from 'react-native-bluetooth-headset-detect';

const HookComponent = () => {
    const device = useBluetoothHeadsetDetection();

    useEffect(() => {
        console.log('device', device);
    }, [device]);

    return (
        <View>
            <Text>Device detection with hook: {device}</Text>
        </View>
    );
};

const ListenerComponent = () => {
    const [headset, setHeadset] = useState(null);
    useEffect(() => {
        setHeadset(getHeadset());
        addListener(setHeadset);
        return () => {
            removeListener(setHeadset);
        };
    }, []);

    return (
        <View>
            <Text>Device detection with listener: {headset}</Text>
        </View>
    );
};

export const BtHeadsetConnections = () => {
    return (
        <View style={styles.container}>
            <HookComponent />
            <ListenerComponent />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
});
