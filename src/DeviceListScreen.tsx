import React from 'react';
import { FlatList, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Body, Button, Container, Content, Header, Icon, Right, Text, Title } from 'native-base';
// import StackNavigationHelpers from '@react-navigation/stack';
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';

/**
 * See https://reactnative.dev/docs/permissionsandroid for more information
 * on why this is required (dangerous permissions).
 */
const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Access fine location required for discovery',
        message: 'In order to perform discovery, you must enable/allow ' + 'fine location access.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
};

interface DeviceListScreenProps {
    onDeviceSelected: (device: BluetoothDevice) => void;
}

interface DeviceListScreenState {
    accepting: boolean;
    bluetoothEnabled?: boolean;
    devices: BluetoothDevice[];
    discovering: boolean;
}

/**
 * Displays the device list and manages user interaction.  Initially
 * the NativeDevice[] contains a list of the bonded devices.  By using
 * the Discover Devices action the list will be updated with unpaired
 * devices.
 *
 * From here:
 * - unpaired devices can be paired
 * - paired devices can be connected
 *
 * @author kendavidson
 */
export default class DeviceListScreen extends React.Component<DeviceListScreenProps, DeviceListScreenState> {
    state: DeviceListScreenState = {
        accepting: false,
        devices: [],
        discovering: false,
    };

    componentDidMount() {
        this.getBondedDevices();
    }

    componentWillUnmount() {
        if (this.state.accepting) {
            this.cancelAcceptConnections();
        }

        if (this.state.discovering) {
            this.cancelDiscovery();
        }
    }

    /**
     * Gets the currently bonded devices.
     */
    getBondedDevices = async () => {
        console.log('DeviceListScreen::getBondedDevices');
        try {
            const bonded = await RNBluetoothClassic.getBondedDevices();
            const bluetoothEnabled = await RNBluetoothClassic.isBluetoothEnabled();
            console.log('DeviceListScreen::getBondedDevices found', bonded, bluetoothEnabled);
            this.setState({ devices: bonded, bluetoothEnabled });
        } catch (error) {
            this.setState({ devices: [] });

            alert('ERROR: ' + error?.message);
            // Toast.show({
            //     text: error.message,
            //     duration: 5000,
            // });
        }
    };

    /**
     * Starts attempting to accept a connection.  If a device was accepted it will
     * be passed to the application context as the current device.
     */
    acceptConnections = async () => {
        if (this.state.accepting) {
            alert('Already accepting connections');
            // Toast.show({
            //     text: 'Already accepting connections',
            //     duration: 5000,
            // });

            return;
        }

        this.setState({ accepting: true });

        try {
            const properties: Map<string, object> = new Map<string, object>();
            const device = await RNBluetoothClassic.accept(properties);
            if (device) {
                this.props.onDeviceSelected(device);
            }
        } catch (error) {
            // If we're not in an accepting state, then chances are we actually
            // requested the cancellation.  This could be managed on the native
            // side but for now this gives more options.
            if (!this.state.accepting) {
                alert('Attempt to accept connection failed.');
                // Toast.show({
                //     text: 'Attempt to accept connection failed.',
                //     duration: 5000,
                // });
            }
        } finally {
            this.setState({ accepting: false });
        }
    };

    /**
     * Cancels the current accept - might be wise to check accepting state prior
     * to attempting.
     */
    cancelAcceptConnections = async () => {
        if (!this.state.accepting) {
            return;
        }

        try {
            const cancelled = await RNBluetoothClassic.cancelAccept();
            this.setState({ accepting: !cancelled });
        } catch (error) {
            alert('ERROR: ' + error?.message);
            // Toast.show({
            //     text: 'Unable to cancel accept connection',
            //     duration: 2000,
            // });
        }
    };

    startDiscovery = async () => {
        try {
            const granted = await requestAccessFineLocationPermission();

            if (!granted) {
                throw new Error('Access fine location was not granted');
            }

            this.setState({ discovering: true });

            const devices = [...this.state.devices];

            try {
                const unpaired = await RNBluetoothClassic.startDiscovery();

                const index = devices.findIndex(d => !d.bonded);
                if (index >= 0) {
                    devices.splice(index, devices.length - index, ...unpaired);
                } else {
                    devices.push(...unpaired);
                }

                alert(`Found ${unpaired.length} unpaired devices.`);
                // Toast.show({
                //     text: `Found ${unpaired.length} unpaired devices.`,
                //     duration: 2000,
                // });
            } finally {
                this.setState({ devices, discovering: false });
            }
        } catch (error) {
            alert('ERROR: ' + error?.message);
            // Toast.show({
            //     text: err.message,
            //     duration: 2000,
            // });
        }
    };

    cancelDiscovery = async () => {
        try {
            const cancelled = await RNBluetoothClassic.cancelDiscovery();
            console.log('cancelDiscovery', cancelled);
        } catch (error) {
            alert('ERROR: ' + error?.message);
            // Toast.show({
            //     text: 'Error occurred while attempting to cancel discover devices',
            //     duration: 2000,
            // });
        }
    };

    requestEnabled = async () => {
        try {
            const bluetoothEnabled = await RNBluetoothClassic.requestBluetoothEnabled();
            console.log('requestEnabled', bluetoothEnabled);
            this.setState({ bluetoothEnabled });
        } catch (error) {
            alert('ERROR: ' + error?.message);
            // Toast.show({
            //     text: `Error occurred while enabling bluetooth: ${error.message}`,
            //     duration: 200,
            // });
        }
    };

    handleDevicePressed = (device: BluetoothDevice) => {
        console.log('device', device);
        // @ts-ignore
        this.props.navigation.navigate('ConnectionScreen', { address: device.address });
    };

    render() {
        const connectedColor = !this.state.bluetoothEnabled ? 'white' : 'green';

        const toggleAccept = this.state.accepting ? () => this.cancelAcceptConnections() : () => this.acceptConnections();

        const toggleDiscovery = this.state.discovering ? () => this.cancelDiscovery() : () => this.startDiscovery();

        return (
            <Container>
                <Header iosBarStyle="dark-content">
                    <Body>
                        <Title style={{ backgroundColor: connectedColor }}>Devices</Title>
                    </Body>
                    {this.state.bluetoothEnabled ? (
                        <Right>
                            <Button transparent onPress={this.getBondedDevices}>
                                <Text>{this.state?.devices?.length}</Text>
                            </Button>
                        </Right>
                    ) : (
                        <Right>
                            <Button transparent onPress={this.requestEnabled}>
                                <Text>Request BT Enable</Text>
                            </Button>
                        </Right>
                    )}
                </Header>

                {this.state.bluetoothEnabled ? (
                    <>
                        <DeviceList devices={this.state.devices} onPress={this.handleDevicePressed} onLongPress={() => {}} />
                        {Platform.OS !== 'ios' ? (
                            <View>
                                <Button block onPress={toggleAccept}>
                                    <Text>{this.state.accepting ? 'Accepting (cancel)...' : 'Accept Connection'}</Text>
                                </Button>
                                <Button block onPress={toggleDiscovery}>
                                    <Text>{this.state.discovering ? 'Discovering (cancel)...' : 'Discover Devices'}</Text>
                                </Button>
                            </View>
                        ) : undefined}
                    </>
                ) : (
                    <Content contentContainerStyle={styles.center}>
                        <Text>Bluetooth is OFF</Text>
                        <Button onPress={() => this.requestEnabled()}>
                            <Text>Enable Bluetooth</Text>
                        </Button>
                    </Content>
                )}
            </Container>
        );
    }
}

/**
 * Displays a list of Bluetooth devices.
 *
 * @param {NativeDevice[]} devices
 * @param {function} onPress
 * @param {function} onLongPress
 */
export const DeviceList = ({ devices, onPress, onLongPress }) => {
    const renderItem = ({ item }) => {
        return <DeviceListItem device={item} onPress={onPress} onLongPress={onLongPress} />;
    };

    return <FlatList data={devices} renderItem={renderItem} keyExtractor={item => item.address} />;
};

export const DeviceListItem = ({ device, onPress, onLongPress }) => {
    const bgColor = device.connected ? '#0f0' : '#fff';
    const icon = device.bonded ? 'ios-bluetooth' : 'ios-cellular';

    return (
        <TouchableOpacity onPress={() => onPress(device)} onLongPress={() => onLongPress(device)} style={styles.deviceListItem}>
            <View style={styles.deviceListItemIcon}>
                <Icon type="Ionicons" name={icon} color={bgColor} />
            </View>
            <View>
                <Text>{device.name}</Text>
                <Text note>{device.address}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    deviceListItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    deviceListItemIcon: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
