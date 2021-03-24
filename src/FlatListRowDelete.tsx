import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Button, NativeScrollEvent, NativeSyntheticEvent, NativeTouchEvent, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListRow } from './ListRow';
import { Separator } from 'native-base';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import debounce from "@react-navigation/stack/lib/typescript/src/utils/debounce";

export const FlatListRowDelete = () => {
    const [isLoading, setLoading] = useState(false);
    const [people, setPeople] = useState<Array<any>>([]);
    // const [showDate, setShowDate] = useState(false);

    // const dateListRef = useRef<FlatList<any>>(null);
    // let peopleListRef = useRef<FlatList<any>>(null);

    const addUser = useCallback(
        async (count: number = 1) => {
            console.log('addUser', count);
            if (isLoading) {
                return;
            }

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
        },
        [isLoading]
    );

    const handleAddUser = (_: NativeSyntheticEvent<NativeTouchEvent>) => addUser(1);

    useEffect(() => {
        if (people.length <= 30) {
            addUser(30);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const handleSwipe = () => {
    //     console.log('handleSwipe');
    //     setShowDate(prevState => !prevState);
    //     // const p = people.map(x => {
    //     //     return {
    //     //         ...x,
    //     //         showDate: !x.showDate,
    //     //     };
    //     // });
    //     // setPeople(p);
    // };

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

    const removeUser = useCallback(
        (index: number) => {
            setLoading(true);
            const newPeople = [...people];
            newPeople.splice(index, 1);
            setPeople(newPeople);
            setLoading(false);
        },
        [people]
    );

    const activityIndicator = useMemo(() => <ActivityIndicator animating={isLoading} color={'blue'} size={'large'} style={{ top: '50%', zIndex: 1 }} />, [isLoading]);
    const renderItem = useCallback(({ item, index }) => <ListRow {...item} key={item?.login?.username} onRemove={() => removeUser(index)} />, [removeUser]);
    const itemSeparator = () => <Separator style={{ height: 1, backgroundColor: '#e5159b' }} />;
    const listHeader = () => <Button disabled={isLoading} onPress={handleAddUser} title="Add Person" />;
    // const renderDateItem = ({ item }) => <ListRowDate key={item?.login?.username} date={item.dob.date} />;
    // const dummyHeader = () => <View style={{ height: 35 }} />;

    // const renderDatesList = () => (
    //     <View style={{ width: 100 }}>
    //         <FlatList
    //             data={people}
    //             ref={dateListRef}
    //             ItemSeparatorComponent={itemSeparator}
    //             keyExtractor={item => item?.login?.username}
    //             ListHeaderComponent={dummyHeader}
    //             renderItem={renderDateItem}
    //             scrollEnabled={false}
    //         />
    //     </View>
    // );
    //
    // const debouncedScroll = debounce((offset: number) => dateListRef?.current?.scrollToOffset({ animated: false, offset }), 50);
    // const handlePeopleListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => debouncedScroll(event.nativeEvent.contentOffset.y);
    const handleEndReached = useCallback(() => {
        if (isLoading) {
            return;
        }
        addUser(10);
    }, [addUser, isLoading]);

    // const createPeopleListRef = (instance: string) => {
    //     peopleListRef.current = instance;
    // };

    return (
        <>
            {activityIndicator}
            <Swipeable overshootRight={false} renderRightActions={() => <View style={{ width: 50 }} />}>
                {/*<View style={styles.container}>*/}
                <FlatList
                    data={people}
                    // ref={createPeopleListRef}
                    ItemSeparatorComponent={itemSeparator}
                    keyExtractor={item => item?.login?.username}
                    ListHeaderComponent={listHeader}
                    // ListFooterComponent={activityIndicator}
                    // onScroll={handlePeopleListScroll}
                    // onEndReached={handleEndReached}
                    scrollEnabled={true}
                    // scrollEventThrottle={}
                    renderItem={renderItem}
                    // refreshing={isLoading}
                    fadingEdgeLength={100}
                    removeClippedSubviews={false}
                    // style={{ overflow: 'visible' }}
                    // contentContainerStyle={{ overflow: 'visible' }}
                    // getItemLayout={}
                    // onViewableItemsChanged={}
                />
                {/*</View>*/}
            </Swipeable>
        </>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: '#fff',
//         overflow: 'visible',
//     },
// });
