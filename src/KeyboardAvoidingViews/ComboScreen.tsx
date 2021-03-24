import React, { useRef } from 'react';
import { Animated, KeyboardEvent, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from '../styles';

// @ts-ignore
import logo from './logo.png';
import { useKeyboardListener } from "./KeyboardListener";
import { ScrollView } from 'react-native-gesture-handler';

export const ComboScreen = () => {
    const imageHeight = useRef(new Animated.Value(IMAGE_HEIGHT)).current;

    const keyboardWillShow = (event) => {
        Animated.timing(imageHeight, {
            duration: event.duration,
            toValue: IMAGE_HEIGHT_SMALL,
            useNativeDriver: false,
        }).start();
    };

    const keyboardWillHide = (event) => {
        Animated.timing(imageHeight, {
            duration: event.duration,
            toValue: IMAGE_HEIGHT,
            useNativeDriver: false,
        }).start();
    };

    const keyboardDidShow = (event) => {
        Animated.timing(imageHeight, {
            toValue: IMAGE_HEIGHT_SMALL,
            useNativeDriver: false,
        }).start();
    };

    const keyboardDidHide = (event) => {
        Animated.timing(imageHeight, {
            toValue: IMAGE_HEIGHT,
            useNativeDriver: false,
        }).start();
    };

    const onKeyboardVisibilityChange = (isVisible: boolean, event: KeyboardEvent) => {
        console.log('isVisible', event);
        if (isVisible) {
            if (Platform.OS === 'ios') {
                keyboardWillShow(event);
            } else {
                keyboardDidShow(event);
            }
        } else {
            if (Platform.OS === 'ios') {
                keyboardWillHide(event);
            } else {
                keyboardDidHide(event);
            }
        }
    }
    useKeyboardListener({ onKeyboardVisibilityChange, useWillHide: Platform.OS === 'ios', useWillShow: Platform.OS === 'ios' });

    return (
        <View style={{ flex: 1, backgroundColor: '#4c69a5', alignItems: 'center' }}>
            <Animated.Image source={logo} style={[styles.logo, { height: imageHeight }]} />
            <ScrollView style={{ flex: 1 }}>

                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                >
                    <TextInput
                        placeholder="Name"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Surname"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Password"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                    />
                </KeyboardAvoidingView>
            </ScrollView>
            <View>
                <TouchableOpacity style={styles.register}>
                    <Text>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
