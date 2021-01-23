import React from 'react';
import RNBluetoothClassic, { BluetoothDevice, BluetoothEventSubscription } from 'react-native-bluetooth-classic';
import { Body, Button, Container, Header, Icon, Left, Right, Subtitle, Text, Title } from 'native-base';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface ConnectionScreenProps {
    address: string;
}

interface ConnectionScreenState {
    text?: string;
    data: {
        data: string;
        timestamp: Date;
        type: string;
    }[];
    isConnected: boolean;
    isPolling: boolean;
    connectionOptions: {
        delimiter: string;
    };
    device?: BluetoothDevice;
}

/**
 * Manages a selected device connection.  The selected Device should
 * be provided as {@code props.device}, the device will be connected
 * to and processed as such.
 *
 * @author kendavidson
 */
export default class ConnectionScreen extends React.Component<ConnectionScreenProps, ConnectionScreenState> {
    state: ConnectionScreenState = {
        text: undefined,
        data: [
            {
                data: '',
                timestamp: new Date(),
                type: 'error',
            },
        ],
        isPolling: false,
        isConnected: false,
        connectionOptions: {
            delimiter: '\n',
        },
    };
    readInterval: number | undefined;
    readSubscription: BluetoothEventSubscription | undefined;
    scannedDataList: FlatList<{ data: string; timestamp: Date; type: string }> | null | undefined;

    /**
     * Attempts to connect to the provided device.  Once a connection is
     * made the screen will either start listening or polling for
     * data based on the configuration.
     */
    async componentDidMount() {
        // @ts-ignore
        const address = this.props?.route?.params?.address;
        console.log('componentDidMount', address);
        const bondedDevices = await RNBluetoothClassic.getBondedDevices();
        const device = bondedDevices.find(x => x.address === address);
        this.connect(device);
    }

    /**
     * Removes the current subscriptions and disconnects the specified
     * device.  It could be possible to maintain the connection across
     * the application, but for now the connection is within the context
     * of this screen.
     */
    async componentWillUnmount() {
        if (this.state.isConnected) {
            try {
                const disconnected = await this.state?.device?.disconnect();
                console.log('componentWillUnmount:disconnected', disconnected);
            } catch (error) {
                alert('componentWillUnmount:error: ' + error?.message);
                // Unable to disconnect from device
            }
        }

        this.uninitializeRead();
    }

    async connect(device: BluetoothDevice | undefined) {
        console.log('connecting', device);
        if (!device) {
            alert('NO VALID DEVICE');
            return;
        }

        try {
            let isConnected = await device?.isConnected();
            console.log('isConnected?', isConnected);
            if (!isConnected) {
                // connection = await this.device.connect(this.state.connectionOptions);
                isConnected = await device.connect({});
                console.log('isConnected2', isConnected);
                this.addData({
                    data: 'Connection successful',
                    timestamp: new Date(),
                    type: 'info',
                });
            }

            this.setState({ isConnected, device });
            this.initializeRead();
        } catch (error) {
            alert('ERROR: ' + error?.message);
            this.addData({
                data: `Connection failed: ${error.message}`,
                timestamp: new Date(),
                type: 'error',
            });
        }
    }

    async disconnect() {
        if (!this.state.device) return;
        try {
            const disconnected = await this.state.device.disconnect();
            this.addData({
                data: 'Disconnected',
                timestamp: new Date(),
                type: 'info',
            });

            this.setState({ isConnected: !disconnected });
        } catch (error) {
            alert('ERROR: ' + error?.message);
            this.addData({
                data: `Disconnect failed: ${error.message}`,
                timestamp: new Date(),
                type: 'error',
            });
        }

        // Clear the reads, so that they don't get duplicated
        this.uninitializeRead();
    }

    initializeRead() {
        if (!this.state.device) return;
        if (this.state.isPolling) {
            this.readInterval = window.setInterval(() => this.performRead(), 5000);
        } else {
            this.readSubscription = this.state.device.onDataReceived(data => this.onReceivedData(data));
        }
    }

    /**
     * Clear the reading functionality.
     */
    uninitializeRead() {
        if (this.readInterval) {
            clearInterval(this.readInterval);
        }
        if (this.readSubscription) {
            this.readSubscription.remove();
        }
    }

    async performRead() {
        if (!this.state.device) return;
        try {
            console.log('Polling for available messages');
            const available = await this.state.device.available();
            console.log(`There is data available [${available}], attempting read`);

            if (available > 0) {
                for (let i = 0; i < available; i++) {
                    console.log(`reading ${i}th time`);
                    const data = await this.state.device.read();

                    console.log(`Read data ${data}`);
                    console.log(data);
                    this.onReceivedData({ data });
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Handles the ReadEvent by adding a timestamp and applying it to
     * list of received data.
     *
     * @param {ReadEvent} event
     */
    async onReceivedData(event) {
        event.timestamp = new Date();
        this.addData({
            ...event,
            timestamp: new Date(),
            type: 'receive',
        });
    }

    async addData(message) {
        // this.setState({ data: [message, ...this.state.data] });
        console.error('message', message);
    }

    /**
     * Attempts to send data to the connected Device.  The input text is
     * padded with a NEWLINE (which is required for most commands)
     */
    async sendData() {
        if (!this.state.device) return;
        try {
            console.log(`Attempting to send data ${this.state.text}`);
            const message = this.state.text + '\r';
            await RNBluetoothClassic.writeToDevice(this.state.device.address, message);

            this.addData({
                timestamp: new Date(),
                data: this.state.text,
                type: 'sent',
            });

            this.setState({ text: undefined });
        } catch (error) {
            console.log(error);
        }
    }

    async toggleConnection() {
        if (this.state.isConnected) {
            this.disconnect();
        } else {
            this.connect(this.state.device);
        }
    }

    handleGoBack = () => {
        // @ts-ignore
        this.props?.navigation?.goBack();
    };

    render() {
        if (!this.state.device) {
            return (
                <Container>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <Text>No Valid Devices Found</Text>
                    </View>
                </Container>
            );
        }

        const toggleIcon = this.state.isConnected ? 'radio-button-on' : 'radio-button-off';

        return (
            <Container>
                <Text>{this.state.device.name}</Text>
                <Header iosBarStyle="dark-content">
                    <Left>
                        <Button transparent onPress={this.handleGoBack}>
                            <Icon type="Ionicons" name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.device.name}</Title>
                        <Subtitle>{this.state.device.address}</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.toggleConnection()}>
                            <Icon type="Ionicons" name={toggleIcon} />
                        </Button>
                    </Right>
                </Header>
                <View style={styles.connectionScreenWrapper}>
                    <FlatList
                        style={styles.connectionScreenOutput}
                        contentContainerStyle={{ justifyContent: 'flex-end' }}
                        inverted
                        ref={ref => (this.scannedDataList = ref)}
                        data={this.state.data}
                        keyExtractor={item => item.timestamp.toISOString()}
                        renderItem={({ item }) => (
                            <View
                                key={item.timestamp.toISOString()}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                <Text>{item.timestamp.toLocaleDateString()}</Text>
                                <Text>{item.type === 'sent' ? ' < ' : ' > '}</Text>
                                <Text style={{ flexShrink: 1 }}>{item.data.trim()}</Text>
                            </View>
                        )}
                    />
                    <InputArea text={this.state.text} onChangeText={text => this.setState({ text })} onSend={() => this.sendData()} disabled={!this.state.isConnected} />
                </View>
            </Container>
        );
    }
}

const InputArea = ({ text, onChangeText, onSend, disabled }) => {
    const style = disabled ? styles.inputArea : styles.inputAreaConnected;
    return (
        <View style={style}>
            <TextInput
                style={styles.inputAreaTextInput}
                placeholder={'Command/Text'}
                value={text}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={onSend}
                returnKeyType="send"
            />
            <TouchableOpacity style={styles.inputAreaSendButton} onPress={onSend} disabled={disabled}>
                <Text>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

/**
 * TextInput and Button for sending
 */
const styles = StyleSheet.create({
    connectionScreenWrapper: {
        flex: 1,
    },
    connectionScreenOutput: {
        flex: 1,
        paddingHorizontal: 8,
    },
    inputArea: {
        flexDirection: 'row',
        alignContent: 'stretch',
        backgroundColor: '#ccc',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    inputAreaConnected: {
        flexDirection: 'row',
        alignContent: 'stretch',
        backgroundColor: '#90EE90',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    inputAreaTextInput: {
        flex: 1,
        height: 40,
    },
    inputAreaSendButton: {
        justifyContent: 'center',
        flexShrink: 1,
    },
});
