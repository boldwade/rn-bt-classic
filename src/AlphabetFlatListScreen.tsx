import React, { useEffect, useState } from 'react';
import { Image, ListRenderItemInfo, SafeAreaView, Text, View } from 'react-native';
import { RandomUser, RandomUserService } from "./services/random-user.service";
import styles from "./styles";
import AlphabetList from "./AlphabetFlatList/AlphabetFlatList";
import IData from "./AlphabetFlatList/interfaces/IData";
import { LoadingIndicator } from "./components/loading-indicator";

export const AlphabetFlatListScreen = () => {
    const randomUserService: RandomUserService = new RandomUserService();
    const [isLoading, setLoading] = useState(true);
    const [randomUsers, setRandomUsers] = useState<RandomUser[]>([]);
    const rowHeight = 100;

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (!randomUsers.length) {
                console.log('AlphabetFlatList:loaded:fetching users');
                const r = await randomUserService.GetRandomUsers(550);
                try {
                    const sortedUsers = r?.sort(((a, b) => a.name?.first?.toLowerCase().localeCompare(b.name?.first?.toLowerCase())));
                    setRandomUsers(sortedUsers);
                } catch (e) {
                    console.error(e);
                }
            }
            setTimeout(() => setLoading(false), 500);
        })()
    }, [randomUsers]);


    const renderRandomUserRow = (info: ListRenderItemInfo<IData>) => {
        const item = info.item;
        const user = randomUsers.find(r => r.login.md5 === item.key);
        return (
            <View style={{ flexDirection: 'row', height: rowHeight, overflow: 'hidden' }} key={item.key}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Image style={styles.image} source={{ uri: user?.picture?.thumbnail }} />
                    <View>
                        <Text style={styles.name}>
                            {user?.name?.first} {user?.name?.last}
                        </Text>
                        <Text style={styles.email}>{user?.email}</Text>
                    </View>
                </View>
                <View style={{ right: user?.showDate ? 80 : -20, position: 'absolute', overflow: 'visible', zIndex: 9999, elevation: 100 }}>
                    <Text>{new Date(user?.dob?.date ?? '').toLocaleDateString()}</Text>
                </View>
            </View>
        )
    }

    const getMappedUsers = (): IData[] => randomUsers.map(r => ({ key: r.login.md5, value: r.name?.first }))

    return (
        <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: '#968484' }}>
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 28, fontWeight: '700' }}>
                        Alphabet scroll bar
                    </Text>
                </View>
                <View style={{ flex: 1, marginVertical: 10 }}>
                    <AlphabetList data={getMappedUsers()} renderItem={renderRandomUserRow} rowHeight={rowHeight} />
                </View>
            </View>
            <LoadingIndicator isLoading={isLoading} />
        </SafeAreaView>
    );
}
