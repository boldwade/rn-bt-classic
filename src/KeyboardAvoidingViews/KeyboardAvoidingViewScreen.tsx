import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import styles from '../styles';

// @ts-ignore
import logo from './logo.png';
import { FormInputs } from "./FormInputs";

export const KeyboardAvoidingViewScreen = () => {
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <FormInputs />
        </KeyboardAvoidingView>
    );
};
