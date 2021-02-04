import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import { ListRow } from './ListRow';

export const FlatListRowDelete = () => {
    const [isLoading, setLoading] = useState(true);
    const [people, setPeople] = useState<Array<any>>([]);

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
        addUser(10);
    }, []);

    return (
        <>
            <ActivityIndicator animating={isLoading} color={'blue'} size={'large'} style={{ top: '50%' }} />
            <FlatList
                style={{ marginTop: 20 }}
                data={people}
                renderItem={({ item, index }) => <ListRow {...item} key={item?.login?.username} onRemove={() => removeUser(index)} />}
                keyExtractor={item => item?.login?.username}
                ListHeaderComponent={() => <Button disabled={isLoading} onPress={handleAddUser} title="Add Person" />}
            />
        </>
    );
};
