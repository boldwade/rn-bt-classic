import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Text, View, Animated, ActivityIndicator, Image } from 'react-native';
import { RandomUser, RandomUserService } from "./services/random-user.service";
import styles from "./styles";

export const CustomScrollViewF = () => {
    const randomUserService: RandomUserService = new RandomUserService();
    const [isLoading, setLoading] = useState(true);
    const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
    const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
    const [randomUsers, setRandomUsers] = useState<RandomUser[]>([]);

    const scrollIndicator = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('customScrollViewF:loaded:fetching users');
        (async () => {
            setLoading(true);
            if (!randomUsers.length) {
                const r = await randomUserService.GetRandomUsers(20);
                try {
                    const sortedUsers = r?.sort(((a, b) => a.name?.first?.toLowerCase().localeCompare(b.name?.first?.toLowerCase())));
                    setRandomUsers(sortedUsers);
                } catch (e) {
                    console.error(e);
                }
            }
            setLoading(false);
        })()
    }, [randomUsers]);

    const scrollIndicatorSize = completeScrollBarHeight > visibleScrollBarHeight
        ? (visibleScrollBarHeight * visibleScrollBarHeight) / completeScrollBarHeight
        : visibleScrollBarHeight;

    const difference = visibleScrollBarHeight > scrollIndicatorSize
        ? visibleScrollBarHeight - scrollIndicatorSize
        : 1;

    const scrollIndicatorPosition = Animated.multiply(
        scrollIndicator,
        visibleScrollBarHeight / completeScrollBarHeight
    ).interpolate({
        inputRange: [0, difference],
        outputRange: [0, difference],
        extrapolate: 'clamp'
    });

    const renderRandomUser = () => {
        return (
            <>
                {randomUsers.map((user: RandomUser) => {
                    return (
                        <View style={{ flexDirection: 'row', marginBottom: 50 }} key={user.login.md5}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Image style={styles.image} source={{ uri: user?.picture?.thumbnail }} />
                                <View>
                                    <Text style={styles.name}>
                                        {user?.name?.first} {user?.name?.last}
                                    </Text>
                                    <Text style={styles.email}>{user?.email}</Text>
                                </View>
                            </View>
                            <View style={{ right: user.showDate ? 80 : -20, position: 'absolute', overflow: 'visible', zIndex: 9999, elevation: 100 }}>
                                <Text>{new Date(user?.dob.date).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    );
                })}
            </>
        )
    }

    return (
        <>
            {isLoading && (
                <View style={{
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
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator animating={true} size="large" color={'#a9a9a9'} style={{ backgroundColor: 'transparent' }} />
                    <Text>Loading...</Text>
                </View>
            )}
            <View style={{ flex: 1, backgroundColor: '#892cdc' }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 28, fontWeight: '700' }}>
                        Custom Scroll Bar
                    </Text>
                </View>
                <View style={{ flex: 1, marginVertical: 20 }}>
                    <View
                        style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 20 }}
                    >
                        <ScrollView
                            contentContainerStyle={{ paddingRight: 14 }}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={1}
                            // bounces={true}
                            // alwaysBounceVertical={true}
                            onContentSizeChange={(w, h) => {
                                console.log('onContentSizeChange', w, h);
                                setCompleteScrollBarHeight(h || 1)
                            }}
                            onLayout={event => {
                                console.log('onLayout', event.nativeEvent.layout);
                                setVisibleScrollBarHeight(event.nativeEvent.layout.height);
                            }}
                            onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollIndicator } } }],
                                    { useNativeDriver: false }
                                )
                            }
                        >
                            {renderRandomUser()}
                        </ScrollView>
                        <View
                            style={{
                                height: '100%',
                                width: 6,
                                backgroundColor: '#52057b',
                                borderRadius: 8,
                                marginRight: -10,
                                marginLeft: 10,
                            }}
                        >
                            <Animated.View
                                style={{
                                    width: 6,
                                    borderRadius: 8,
                                    backgroundColor: '#bc6ff1',
                                    height: scrollIndicatorSize,
                                    transform: [{ translateY: scrollIndicatorPosition }]
                                }}
                            />
                        </View>
                    </View>
                </View>
                {/*<View style={{ flex: 4 }} />*/}
            </View>
        </>
    );
}
