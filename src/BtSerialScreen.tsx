/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';


// const HookComponent = () => {
//     const device = useBluetoothHeadsetDetection();
//
//     useEffect(() => {
//         console.log('device', device);
//     }, [device]);
//
//     return (
//         <View>
//             <Text>Device detection with hook: {device}</Text>
//         </View>
//     );
// };

const ListenerComponent = () => {
    const checkConnections = async () => {
        Promise
            .all([BluetoothSerial.isEnabled(), BluetoothSerial.list()])
            .then(values => {
                const [isEnabled, devices] = values;
                // this.setState({ isEnabled, devices, devicesFormatted });
                console.log('isEnabled', isEnabled, devices);
            });

        BluetoothSerial.on('bluetoothEnabled', () =>
            console.log('Bluetooth enabled')
        );

        BluetoothSerial.on('bluetoothDisabled', () =>
            console.log('Bluetooth disabled')
        );

        BluetoothSerial.on('error', err => {
            console.log('error', err);
        });

        // BluetoothSerial.on('connectionLost', () => {
        //     if (this.state.device) {
        //         this.connect(this.state.device)
        //             .then(res => {
        //             })
        //             .catch(err => {
        //                 console.log('error', err);
        //             });
        //     }
        // });
    };
    //
    // const pairDevice = (device) => {
    //     device.id
    // };

    useEffect(() => {
        console.log('BluetoothSerial', BluetoothSerial);
        checkConnections();
        // return () => {
        //     removeListener(setHeadset);
        // };
    }, []);

    return (
        <View>
            <Text>Device detection with listener: </Text>
        </View>
    );
};

export const BtSerialScreen = () => {
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
