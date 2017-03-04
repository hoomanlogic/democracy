import React from 'react';
import {
    Text,
    View
} from 'react-native';
import { Icon } from 'react-native-elements';

function FlowCrumb ({ theme, title, subtitle, onPress }) {
    return (
        <View style={{ padding: 8, flex: 1, flexDirection: 'row' }}>
            <Icon name="chevron-left" size={32} color={theme.foreColor} onPress={onPress}/>
            <View style={{ flex: 1 }}>
                <Text style={{ color: theme.foreColor, fontSize: 24 }}>{title}</Text>
                {subtitle ? <Text style={{ color: theme.foreColorLow, fontSize: 12 }}>{subtitle}</Text> : undefined}
            </View>
        </View>
    );
}

export default FlowCrumb;
