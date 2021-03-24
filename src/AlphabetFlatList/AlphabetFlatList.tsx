import * as React from "react";
import { FlatList, FlatListProps, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import getSectionData from "./utilities/getSectionData";
import ListLetterIndex, { ListLetterIndexProps } from "./ListLetterIndex";
import IData from "./interfaces/IData";
import ISectionData from "./interfaces/ISectionData";

interface AlphabetListProps extends FlatListProps<IData>, Omit<ListLetterIndexProps, 'onPressLetter' | 'sectionData'> {
    rowHeight: number;
}

export default class AlphabetList extends React.PureComponent<AlphabetListProps> {
    state: { sectionData: ISectionData[]; } = { sectionData: [] };

    flatListRef = React.createRef<FlatList>();

    componentDidMount() {
        this.setSectionData();
    }

    componentDidUpdate(prevProps: AlphabetListProps) {
        if (prevProps.data?.length !== this.props.data?.length) {
            this.setSectionData();
        }
    }

    getItemLayout = (data: any[] | null | undefined, index: number) => {
        console.log('getItemLayout', index);
        return { index, length: this.props.rowHeight, offset: this.props.rowHeight * index }
    }

    setSectionData = () => {
        const { data = [] } = this.props;
        if (data?.length) {
            const sectionData = getSectionData([...data]);
            this.setState({ sectionData });
        }
    };

    onScrollToSection = (loweredLetter: string) => {
        if (!this.flatListRef.current) {
            return;
        }

        const index = this.props.data?.findIndex(d => d.value.toLowerCase().startsWith(loweredLetter)) ?? -1;
        if (index > -1) {
            this.flatListRef.current.scrollToIndex({ index, animated: (this.props.data?.length ?? 0) < 500 });
        }
    };

    onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number; }) => {
        const offset = info.averageItemLength * info.index;
        this.flatListRef.current?.scrollToOffset({ offset });
        setTimeout(() => this.flatListRef.current?.scrollToIndex({ index: info.index }), 50);
    }

    onRenderItem = (info: ListRenderItemInfo<IData>) => {
        console.log('onRenderItem', info.index);
        if (this.props.renderItem) {
            return this.props.renderItem(info)
        }

        return (
            <View style={[styles.listItemContainer, { height: this.props.rowHeight }]}>
                <Text style={styles.listItemLabel}>{info.item.value}</Text>
            </View>
        );
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <FlatList
                    {...this.props}
                    fadingEdgeLength={100}
                    getItemLayout={this.getItemLayout} // YAGNI - this could be a prop
                    initialNumToRender={20}
                    keyExtractor={item => item.key}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                    ref={this.flatListRef}
                    renderItem={this.onRenderItem}
                />

                <ListLetterIndex
                    letterIndexContainer={this.props.letterIndexContainer}
                    letterIndexItem={this.props.letterIndexItem}
                    letterIndexLabel={this.props.letterIndexLabel}
                    onPressLetter={this.onScrollToSection}
                    sectionData={this.state.sectionData}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },

    listItemContainer: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: "center",
        borderTopColor: "#e6ebf2",
        borderTopWidth: 1,
        overflow: 'hidden'
    },

    listItemLabel: {
        color: "#1c1b1e",
        fontSize: 14,
    },
});
