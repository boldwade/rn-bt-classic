import React, { useRef } from 'react';
import { Animated, KeyboardEvent, TextInput } from 'react-native';
import styles, { IMAGE_HEIGHT, IMAGE_HEIGHT_SMALL } from '../styles';

// @ts-ignore
import logo from './logo.png';
import { useKeyboardListener } from "./KeyboardListener";

export const KeyboardModuleScreen = () => {
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const imageHeight = useRef(new Animated.Value(IMAGE_HEIGHT)).current;

    const keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
                useNativeDriver: false,
            }),
            Animated.timing(imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT_SMALL,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(keyboardHeight, {
                duration: event.duration,
                toValue: 0,
                useNativeDriver: false,
            }),
            Animated.timing(imageHeight, {
                duration: event.duration,
                toValue: IMAGE_HEIGHT,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const onKeyboardVisibilityChange = (isVisible: boolean, event: KeyboardEvent) => {
        console.log('isVisible', event);
        if (isVisible) {
            keyboardWillShow(event);
        } else {
            keyboardWillHide(event);
        }
    }
    useKeyboardListener({ onKeyboardVisibilityChange, useWillHide: true, useWillShow: true });

    return (
        <Animated.View style={[styles.container, { paddingBottom: keyboardHeight }]}>
            <Animated.Image source={logo} style={[styles.logo, { height: imageHeight }]} />
            <TextInput
                placeholder="Email"
                style={styles.input}
            />
            <TextInput
                placeholder="Username"
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
                placeholder="Email"
                style={styles.input}
            />
            <TextInput
                placeholder="Username"
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
        </Animated.View>
    );
};
