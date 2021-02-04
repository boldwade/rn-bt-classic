import React, { useCallback, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const ANIMATION_DURATION = 500;
const ROW_HEIGHT = 70;

interface ListRowProps {
    dob: { age: string; date: string };
    email: string;
    name: { first: string; last: string; title: string };
    onRemove: () => void;
    picture: any;
    showDate?: boolean;
}

export const ListRow = (props: ListRowProps) => {
    const _animated = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('props.showDate', props.showDate);
    }, [props.showDate]);

    useEffect(() => {
        Animated.timing(_animated, { toValue: 1, duration: ANIMATION_DURATION, easing: Easing.ease }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRemove = useCallback(() => {
        if (props.onRemove) {
            Animated.timing(_animated, { toValue: 0, duration: ANIMATION_DURATION, easing: Easing.ease }).start(props.onRemove);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onRemove]);

    const rowStyles = [
        styles.row,
        {
            // height: _animated.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: [0, ROW_HEIGHT],
            // }),
            left: _animated.interpolate({
                inputRange: [0, 1],
                outputRange: [-300, 0],
            }),
        },
        { opacity: _animated },
        {
            transform: [
                { scale: _animated },
                // {
                //     rotate: _animated.interpolate({
                //         inputRange: [0, 1],
                //         outputRange: ['35deg', '0deg'],
                //     }),
                // },
            ],
        },
    ];

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                {/*<TouchableOpacity onPress={onRemove}>*/}
                <Animated.View style={rowStyles}>
                    <Image style={styles.image} source={{ uri: props?.picture?.thumbnail }} />
                    <View>
                        <Text style={styles.name}>
                            {props?.name?.first} {props?.name?.last}
                        </Text>
                        <Text style={styles.email}>{props?.email}</Text>
                    </View>
                </Animated.View>
                {/*</TouchableOpacity>*/}
            </View>
            <View style={{ right: props.showDate ? 80 : -20, position: 'absolute', overflow: 'visible', zIndex: 9999, elevation: 100 }}>
                <Text>{new Date(props?.dob.date).toLocaleDateString()}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: ROW_HEIGHT,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: '500',
    },
    email: {
        fontSize: 14,
    },
});
