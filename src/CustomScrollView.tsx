import React, { PureComponent } from "react";
import { ActivityIndicator, Animated, Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import styles from "./styles";
import { RandomUser, RandomUserService } from "./services/random-user.service";

export class CustomScrollView extends PureComponent {
    randomUserService: RandomUserService;

    state = {
        indicator: new Animated.Value(0),
        isLoading: true,
        randomUsers: [],
        visibleHeight: 0,
        wholeHeight: 1,
    }

    constructor(props) {
        super(props);
        this.randomUserService = new RandomUserService();
    }

    async componentDidMount() {
        this.state.isLoading = true;
        this.setState({ isLoading: true });
        const result = await this.randomUserService.GetRandomUsers(20);
        this.setState({ isLoading: false, randomUsers: result ?? [] });
    }

    get renderRandomUser() {
        return (
            <>
                {this.state.randomUsers.map((user: RandomUser) => {
                    return (
                        <View style={{ flexDirection: 'row' }} key={user.login.md5}>
                            <View style={{ flex: 1 }}>
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

    onContentSizeChange = (w: number, h: number) => {
        console.log('onContentSizeChange', w, h);
        // this.setState({ wholeHeight: height });
    }

    onLayout = (event: LayoutChangeEvent) => {
        console.log('onLayout', event);
        // return ({ nativeEvent: { layout: { x, y, width, height } } }) => {
        //     console.log('onLayout2', x, y, width, height);
        //     // this.setState({ visibleHeight: height })
        // }
    }

    onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        console.log('onScroll', event);
    }

    render() {
        const indicatorSize = this.state.wholeHeight > this.state.visibleHeight
            ? this.state.visibleHeight * this.state.visibleHeight / this.state.wholeHeight
            : this.state.visibleHeight;

        const difference = this.state.visibleHeight > indicatorSize
            ? this.state.visibleHeight - indicatorSize
            : 1;

        return (
            <View>
                <ActivityIndicator animating={this.state.isLoading} color={'blue'} size={'large'} style={{ top: '50%' }} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={this.onContentSizeChange}
                    onLayout={this.onLayout}
                    scrollEventThrottle={16}
                    // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.indicator } } }], { useNativeDriver: false })}
                    onScroll={this.onScroll}
                    children={this.renderRandomUser}
                />
                <View style={styles.indicatorWrapper} />
                {/*<Animated.View style={[*/}
                {/*    styles.indicator,*/}
                {/*    {*/}
                {/*        height: indicatorSize,*/}
                {/*        transform: [*/}
                {/*            {*/}
                {/*                translateY:*/}
                {/*                    Animated.multiply(this.state.indicator, this.state.visibleHeight / this.state.wholeHeight)*/}
                {/*                        .interpolate({*/}
                {/*                            inputRange: [0, difference],*/}
                {/*                            outputRange: [0, difference],*/}
                {/*                            extrapolate: 'clamp',*/}
                {/*                        })*/}
                {/*            }*/}
                {/*        ]*/}
                {/*    }]}*/}
                {/*>*/}
                {/*    <Text>Test1</Text>*/}
                {/*</Animated.View>*/}
            </View>
        )
    }
}
