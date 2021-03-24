/***
 Use this component inside your React Native Application.
 A scrollable list with different item type
 */
import React from "react";
import { Dimensions, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";
import { RandomUser, RandomUserService } from "./services/random-user.service";
import FastImage from 'react-native-fast-image'
import ListLetterIndex from "./AlphabetFlatList/ListLetterIndex";
import ISectionData from "./AlphabetFlatList/interfaces/ISectionData";
import getSectionData from "./AlphabetFlatList/utilities/getSectionData";

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};

let containerCount = 0;

interface CellContainerProps {
    style: StyleProp<ViewStyle>;
}

class CellContainer extends React.Component<CellContainerProps> {
    _containerId = 0;

    constructor(args) {
        super(args);
        this._containerId = containerCount++;
    }

    render() {
        return <View {...this.props}>{this.props.children}<Text>Cell Id: {this._containerId}</Text></View>;
    }
}

/***
 * To test out just copy this component and render in you root component
 */
export default class AlphabetRecycleScreen extends React.Component {
    _layoutProvider: LayoutProvider;
    rowHeight = 70;
    state: { dataProvider?: DataProvider; sectionData?: ISectionData[]; } = {};

    flatListRef = React.createRef<RecyclerListView<any, any>>();

    constructor(args) {
        super(args);

        let { width } = Dimensions.get("window");

        //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
        //Create the layout provider
        //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
        //Second: Given a type and object set the height and width for that type on given object
        //If you need data based check you can access your data provider here
        //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
        //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
        this._layoutProvider = new LayoutProvider(
            _ => 0,
            (type, dim) => {
                dim.width = width;
                dim.height = this.rowHeight;
            }
        );

        //Since component should always render once data has changed, make data provider part of the state
        this.loadRandomUsers();
    }

    loadRandomUsers = async () => {
        const randomUsers = await this.getRandomUsers(2000);
        const sectionData = getSectionData(randomUsers.map(r => ({ key: r.login.md5, value: r.name?.first })))

        const dp = new DataProvider((r1: RandomUser, r2: RandomUser) => false);
        const dataProvider = dp.cloneWithRows(randomUsers)
        this.setState({ dataProvider, sectionData });
    }

    async getRandomUsers(n: number): Promise<RandomUser[]> {
        const r = await new RandomUserService().GetRandomUsers(n);
        try {
            const sortedUsers = r?.sort(((a, b) => a.name?.first?.toLowerCase().localeCompare(b.name?.first?.toLowerCase())));
            return sortedUsers;
        } catch (e) {
            console.error(e);
        }
        return [];
    }

    //Given type and data return the view component
    rowRenderer = (type, data: RandomUser) => {
        //You can return any view here, CellContainer has no special significance
        return (
            <View style={{ flexDirection: 'row', height: this.rowHeight, overflow: 'hidden' }} key={data.login.md5}>
                <TouchableOpacity onPress={() => console.log('onPress', data.login.md5)}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <FastImage style={styles.image} source={{ uri: data?.picture?.thumbnail }} />
                        <View>
                            <Text style={styles.name}>
                                {data?.name?.first} {data?.name?.last}
                            </Text>
                            <Text style={styles.email}>{data?.email}</Text>
                        </View>
                    </View>
                    <View style={{ right: data?.showDate ? 80 : -20, position: 'absolute', overflow: 'visible', zIndex: 9999, elevation: 100 }}>
                        <Text>{new Date(data?.dob?.date ?? '').toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    onScrollToSection = (loweredLetter: string) => {
        if (!this.flatListRef.current) {
            return;
        }

        const index = this.state.dataProvider?.getAllData()?.findIndex((d: RandomUser) => d.name.first?.toLowerCase().startsWith(loweredLetter)) ?? -1;
        console.log('onScrollToSection', loweredLetter, index);
        if (index > -1) {
            this.flatListRef.current.scrollToIndex(index, true);
        }
    };

    render() {
        return (
            <>
                <View style={{ minHeight: 1, minWidth: 1, flex: 1 }}>
                    {this.state.dataProvider && (
                        <RecyclerListView
                            dataProvider={this.state.dataProvider}
                            layoutProvider={this._layoutProvider}
                            ref={this.flatListRef}
                            rowRenderer={this.rowRenderer}
                        />
                    )}

                    <ListLetterIndex
                        onPressLetter={this.onScrollToSection}
                        sectionData={this.state.sectionData}
                    />
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#00a1f1"
    },
    containerGridLeft: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#ffbb00"
    },
    containerGridRight: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#7cbb00"
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
