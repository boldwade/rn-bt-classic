import React from 'react';
import styles from '../styles';

// @ts-ignore
import logo from './logo.png';
import { FormInputs } from "./FormInputs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dimensions, View } from 'react-native';

const window = Dimensions.get('window');

export const KeyboardAwareScrollViewScreen = () => {
    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: '#4c69a5' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={[styles.container, { height: window.height * 1 }]}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
        >
            <FormInputs />
        </KeyboardAwareScrollView>
    );
};
