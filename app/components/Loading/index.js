
import React from 'react';
import {
    ActivityIndicator,
    View
} from 'react-native';

function Loading () {
    var style = {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    };
    return (
        <View style={style}>
            <ActivityIndicator size="large" />
        </View>
    );
}

export default Loading;
