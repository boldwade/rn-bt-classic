import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Tab = ({ icon, isSelected }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[{ color: isSelected ? 'black' : 'grey' }]}>{icon}</Text>
    </View>
);

const GridImage = ({ image, width }) => {
    return (
        <View
            key={image}
            style={{
                width: width,
                height: width,
                marginVertical: 10,
            }}
        >
            <Image source={{ uri: image }} style={{ flex: 1 }} />
        </View>
    );
};

export const TabBarAndShuffle = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [people, setPeople] = useState<Array<any>>([]);
    const transitionRef = useRef<TransitioningView>(null);

    const transition = (
        <Transition.Together>
            <Transition.In type="slide-bottom" durationMs={500} interpolation="easeInOut" />
            <Transition.In type="fade" durationMs={500} />
            <Transition.Change />
            <Transition.Out type="fade" durationMs={500} />
        </Transition.Together>
    );

    const fetchUsers = async (count: number = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`https://randomuser.me/api?results=${count}`);
            const result = await res.json();
            if (result?.results?.length) {
                setPeople(prevState => [...prevState, ...result.results]);
            } else {
                // eslint-disable-next-line no-alert
                window.alert('No users to add!');
            }
        } catch (err) {
            // eslint-disable-next-line no-alert
            window.alert('WTF!: ' + JSON.stringify(err));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (people?.length === 0) {
            fetchUsers(6);
        }
    }, [people]);

    const selectTab = (tabIndex: number) => {
        setSelectedTab(tabIndex);
        transitionRef?.current?.animateNextTransition();
    };

    const randomizeImages = (_people: Array<any>) => {
        const shuffledPeople = _people.sort(() => 0.5 - Math.random());
        setPeople(shuffledPeople);
        console.log('transitionRef?.current', transitionRef?.current);
        transitionRef?.current?.animateNextTransition();
    };

    const deleteImages = (_people: Array<any>) => {
        _people.pop();
        setPeople(_people);
        console.log('transitionRef?.current', transitionRef?.current);
        transitionRef?.current?.animateNextTransition();
    };

    useLayoutEffect(() => {
        console.log('transitionRef?.current', transitionRef?.current);
        transitionRef?.current?.animateNextTransition();
        transitionRef?.current?.animateNextTransition();
        transitionRef?.current?.animateNextTransition();
        transitionRef?.current?.animateNextTransition();
    }, []);

    return (
        <>
            <ActivityIndicator animating={isLoading} color={'blue'} size={'large'} style={{ top: '50%' }} />
            <Transitioning.View ref={transitionRef} transition={transition} style={{ flex: 1 }}>
                <View style={{ ...styles.tabContainer }}>
                    <View
                        style={[
                            {
                                position: 'absolute',
                                height: 70,
                                width: (width - 30) / 2,
                                backgroundColor: '#BADA55',
                                left: selectedTab === 0 ? 0 : undefined,
                                right: selectedTab === 1 ? 0 : undefined,
                            },
                        ]}
                    />

                    <TouchableOpacity style={{ flex: 1 }} onPress={() => selectTab(0)}>
                        <Tab icon="md-photos" isSelected={selectedTab === 0} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => selectTab(1)}>
                        <Tab icon="md-grid" isSelected={selectedTab === 1} />
                    </TouchableOpacity>
                </View>

                <View style={styles.imageContainer}>
                    {people.map(person => (
                        <GridImage key={person?.id?.value ?? person?.email} image={person?.picture?.large} width={width / (selectedTab === 0 ? 2 : 4) - 20} />
                    ))}
                </View>

                {selectedTab === 0 && (
                    <View
                        style={{
                            marginBottom: 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text>Images</Text>
                    </View>
                )}

                <TouchableWithoutFeedback onPress={() => deleteImages([...people])}>
                    <View
                        style={{
                            height: 70,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: selectedTab === 0 ? -70 : 0,
                            backgroundColor: 'red',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 24, color: 'white' }}>Delete Images</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => randomizeImages([...people])}>
                    <View
                        style={{
                            height: 70,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: selectedTab === 0 ? 0 : -70,
                            backgroundColor: '#BADA55',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 24, color: 'white' }}>Randomize Images</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Transitioning.View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContainer: {
        height: 70,
        flexDirection: 'row',
        marginTop: 50,
        borderRadius: 70,
        width: width - 30,
        marginHorizontal: 15,
        backgroundColor: 'lightgrey',
        overflow: 'hidden',
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
});
