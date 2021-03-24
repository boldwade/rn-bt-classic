import * as React from "react";
import { FlatList, StyleProp, StyleSheet, Text, TextStyle, TouchableHighlight, View, ViewStyle } from "react-native";
import ISectionData from "./interfaces/ISectionData";
import { LoadingIndicator } from "../components/loading-indicator";

export interface ListLetterIndexProps {
    letterIndexContainer?: StyleProp<ViewStyle>;
    letterIndexItem?: StyleProp<ViewStyle>;
    letterIndexLabel?: StyleProp<TextStyle>;

    onPressLetter: (loweredLetter: string) => void;
    sectionData: ISectionData[] | undefined;
}

export default class ListLetterIndex extends React.PureComponent<ListLetterIndexProps> {
    state: { isLoading: boolean } = { isLoading: false };

    renderLetterItem = (props: { item: ISectionData; index: number }) => {
        const handleLetterPressed = async () => {
            this.setState({ isLoading: true }, () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.props.onPressLetter(props.item.title.toLowerCase());
                        setTimeout(() => {
                            this.setState({ isLoading: false }, resolve);
                        }, 100)
                    }, 1);
                });
            });
        }
        return (
            <TouchableHighlight onPress={handleLetterPressed} style={[styles.letterIndexItem, this.props.letterIndexItem]} hitSlop={{ bottom: 15, right: 15, left: 15, top: 15 }}>
                <Text style={[styles.letterIndexLabel, this.props.letterIndexLabel]}>{props.item.title}</Text>
            </TouchableHighlight>
        );
    };

    render() {
        return (
            <>
                <LoadingIndicator isLoading={this.state.isLoading} />
                <View style={[styles.letterIndexContainer, this.props.letterIndexContainer]}>
                    <FlatList
                        data={this.props.sectionData}
                        renderItem={this.renderLetterItem}
                        keyExtractor={(i) => i.title}
                    />
                </View>
            </>
        );
    }
}

const sizes = {
    containerWidth: 30,
    fontSize: 18,
    itemHeight: 30,
};

const styles = StyleSheet.create({
    letterIndexContainer: {
        height: "100%",
        position: "absolute",
        top: 0,
        right: 5,
    },

    letterIndexItem: {
        width: sizes.containerWidth,
        height: sizes.itemHeight,
        alignItems: "center",
        justifyContent: "center",
    },

    letterIndexLabel: {
        fontSize: sizes.fontSize,
        fontWeight: "bold",
        color: "#fafafa",
        textShadowColor: 'black',
        textShadowOffset: { height: 0, width: 3 },
        textShadowRadius: 20,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
});
