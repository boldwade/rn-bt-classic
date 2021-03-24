import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingIndicatorProps {
    isLoading?: boolean;
}

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
    return (
        <>
            {props.isLoading && (
                <View style={styles.container}>
                    <ActivityIndicator animating={true} size="large" color={'#a9a9a9'} style={{ backgroundColor: 'transparent' }} />
                    <Text>Loading...</Text>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 100,
        width: 100,
        zIndex: 1,
        borderRadius: 10,
        borderColor: 'transparent',
        borderWidth: 1,
        left: '40%',
        top: '40%',
        backgroundColor: '#A7A2A280',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
