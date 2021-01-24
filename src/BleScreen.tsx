/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BleManager, Characteristic, Device } from 'react-native-ble-plx';

const ListenerComponent = () => {
    const manager = new BleManager();
    const timerRef = useRef(0);

    const scanAndConnect = () => {
        timerRef.current = window.setTimeout(() => {
            console.log('STOPPING DEVICE SCAN');
            manager.stopDeviceScan();
        }, 5000);

        manager.startDeviceScan(null, null, async (error, device) => {
            console.log('status', error, device?.name, device?.localName, device?.id, device?.serviceUUIDs);
            if (error || !device) {
                // Handle error (scanning will be stopped automatically)
                return;
            }

            if (device.name === 'PTT-Z') {
                // Stop scanning as it's not necessary if you are scanning for one device.
                clearTimeout(timerRef.current);
                manager.stopDeviceScan();
                // Proceed with connection.

                let connectedDevice: Device | undefined;
                try {
                    connectedDevice = await device.connect();
                    const isConnected = await connectedDevice.isConnected();
                    console.log('connectedDevice', connectedDevice.isConnectable, isConnected);
                } catch (ex) {
                    console.log('ex', ex);
                }

                if (!connectedDevice) return;
                try {
                    const chars = await connectedDevice.discoverAllServicesAndCharacteristics();
                    console.log('chars', chars);
                } catch (ex) {
                    console.log('ex2', ex);
                }

                try {
                    const services = await connectedDevice.services();
                    console.log('services', services);
                    for (const service of services) {
                        const characteristics: Characteristic[] = await service.characteristics();
                        console.log('characteristic', characteristics);
                    }
                } catch (ex) {
                    console.log('ex3', ex);
                }
            }
        });
    };

    useEffect(() => {
        const subscription = manager.onStateChange((state) => {
            console.log('state', state);
            if (state === 'PoweredOn') {
                scanAndConnect();
                subscription.remove();
            }
        }, true);
        return () => manager.destroy();
    }, []);

    return (
        <View>
            <Text>Device detection with listener: </Text>
        </View>
    );
};

export const BleScreen = () => {
    return (
        <View style={styles.container}>
            {/*<HookComponent />*/}
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
