import React from 'react';
import { View } from 'react-native';
import styles from '../styles';

// @ts-ignore
import logo from './logo.png';
import { FormInputs } from "./FormInputs";

export const KeyboardCoveringScreen = () => {
    return (
        <View style={styles.container}>
            <FormInputs />
        </View>
    );
};
