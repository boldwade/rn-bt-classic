import React, { useCallback, useEffect, useState } from 'react';
import { PureComponent } from 'react';
import { EmitterSubscription, Keyboard, KeyboardEvent, KeyboardEventName } from 'react-native';

interface KeyboardListenerProps {
    onKeyboardVisibilityChange: (isVisible: boolean, event: KeyboardEvent) => void;
    // These events will only work (maybe) when/if androidmanifest.xml windowSoftInputMode is changed to 'adjustResize'
    useWillHide?: boolean;
    // These events will only work (maybe) when/if androidmanifest.xml windowSoftInputMode is changed to 'adjustResize'
    useWillShow?: boolean;
}

interface KeyboardListenerState {
    keyboardHideListener: EmitterSubscription;
    keyboardShowListener: EmitterSubscription;
}

export class KeyboardListener extends PureComponent<KeyboardListenerProps, KeyboardListenerState> {
    showEventName: KeyboardEventName = this.props.useWillShow ? 'keyboardWillShow' : 'keyboardDidShow';
    hideEventName: KeyboardEventName = this.props.useWillHide ? 'keyboardWillHide' : 'keyboardDidHide';
    handleKeyboardShow = (event: KeyboardEvent) => this.props.onKeyboardVisibilityChange(true, event);
    handleKeyboardHide = (event: KeyboardEvent) => this.props.onKeyboardVisibilityChange(false, event);

    componentDidMount() {
        Keyboard.addListener(this.showEventName, this.handleKeyboardShow);
        Keyboard.addListener(this.hideEventName, this.handleKeyboardHide);
    }

    componentWillUnmount() {
        Keyboard.removeListener(this.showEventName, this.handleKeyboardShow);
        Keyboard.removeListener(this.hideEventName, this.handleKeyboardHide);
    }

    render() {
        return <></>;
    }
}

export function useKeyboardListener(props: KeyboardListenerProps) {
    const showEventName: KeyboardEventName = props.useWillShow ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEventName: KeyboardEventName = props.useWillHide ? 'keyboardWillHide' : 'keyboardDidHide';
    const handleKeyboardShow = useCallback((event: KeyboardEvent) => props.onKeyboardVisibilityChange(true, event), []);
    const handleKeyboardHide = useCallback((event: KeyboardEvent) => props.onKeyboardVisibilityChange(false, event), []);

    useEffect(() => {
        Keyboard.addListener(showEventName, handleKeyboardShow);
        Keyboard.addListener(hideEventName, handleKeyboardHide);
        return () => {
            Keyboard.removeListener(showEventName, handleKeyboardShow);
            Keyboard.removeListener(hideEventName, handleKeyboardHide);
        };
    }, []);
}
