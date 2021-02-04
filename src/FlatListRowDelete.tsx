import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, NativeSyntheticEvent, NativeTouchEvent, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListRow } from './ListRow';
import { Separator } from 'native-base';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export const FlatListRowDelete = () => {
    const [isLoading, setLoading] = useState(true);
    const [people, setPeople] = useState<Array<any>>([]);
    // let [showDate, setShowDate] = useState(false);

    const addUser = async (count: number = 1) => {
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

    const handleAddUser = (_: NativeSyntheticEvent<NativeTouchEvent>) => addUser(1);

    const removeUser = (index: number) => {
        setLoading(true);
        const newPeople = [...people];
        newPeople.splice(index, 1);
        setPeople(newPeople);
        setLoading(false);
    };

    useEffect(() => {
        if (people.length <= 30) {
            addUser(30);
        }
    }, [people]);

    const handleSwipe = () => {
        console.log('handleSwipe');
        // setShowDate(prevState => !prevState);
        const p = people.map(x => {
            return {
                ...x,
                showDate: !x.showDate,
            };
        });
        setPeople(p);
    };

    // const renderRightDateList = () => {
    //     return (
    //         <View style={{ backgroundColor: '#fff', width: 100 }}>
    //             <Text>Text</Text>
    //             {/*<FlatList*/}
    //             {/*    data={people}*/}
    //             {/*    ItemSeparatorComponent={() => <Separator style={{ height: 1, backgroundColor: '#e5159b' }} />}*/}
    //             {/*    keyExtractor={item => item?.login?.username}*/}
    //             {/*    renderItem={({ item, index }) => <View style={{ height: 50 }}><Text>{new Date(item?.dob.date).toLocaleDateString()}</Text></View>}*/}
    //             {/*    snapToEnd={true}*/}
    //             {/*    snapToStart={true}*/}
    //             {/*/>*/}
    //         </View>
    //     );
    // };

    return (
        <>
            <ActivityIndicator animating={isLoading} color={'blue'} size={'large'} style={{ top: '50%' }} />
            <Swipeable
                onSwipeableWillClose={handleSwipe}
                onSwipeableRightWillOpen={handleSwipe}
                overshootRight={false}
                renderRightActions={() => (
                    <View style={{ backgroundColor: 'red' }}>
                        <Text>Test</Text>
                    </View>
                )}
            >
                <View style={styles.container}>
                    <View style={{ alignSelf: 'flex-end', backgroundColor: 'red' }}>
                        <Text>Test</Text>
                    </View>
                    <FlatList
                        // CellRendererComponent={({ children, item, ...props }) => {
                        //     return (
                        //         <View {...props} style={{ overflow: 'visible', zIndex: 999, elevation: 10 }}>
                        //             {children}
                        //         </View>
                        //     );
                        // }}
                        // CellRendererComponent={_ => <ViewOverflow />}
                        data={people}
                        ItemSeparatorComponent={() => <Separator style={{ height: 1, backgroundColor: '#e5159b' }} />}
                        keyExtractor={item => item?.login?.username}
                        ListHeaderComponent={() => <Button disabled={isLoading} onPress={handleAddUser} title="Add Person" />}
                        renderItem={({ item, index }) => <ListRow {...item} key={item?.login?.username} onRemove={() => removeUser(index)} />}
                        // contentContainerStyle={{ backgroundColor: 'yellow', overflow: 'visible', width: 300 }}
                        // // columnWrapperStyle={{ backgroundColor: 'green' }}
                        // style={{ overflow: 'visible', width: 300, backgroundColor: 'red' }}
                    />
                </View>
            </Swipeable>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow: 'visible',
    },
});
