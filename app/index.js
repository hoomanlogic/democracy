// PACKAGES
import React, { Component } from 'react';
import {
    AsyncStorage,
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import firebase from 'firebase';
import SQLite from 'react-native-sqlite-storage';
// COMPONENTS
import Compare from './flows/Compare';
import Loading from 'democracy/app/components/Loading';
// CONFIGS
import themes from './themes';
import firebaseConfig from '../firebase.config';

SQLite.enablePromise(true);

export default class App extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);

        var location;

        // Get initial device dimensions (orientation changes handled by View.onLayout)
        var dimensions = Dimensions.get('window');

        // Initialize connection to Firebase db (sync)
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();

        // Initialize connection to SQLite db (async)
        SQLite.openDatabase({
            name: 'democracy.db', createFromLocation: '~databases/democracy.db', readOnly: true
        })
        .then((sqldb) => {
            this.sqldb = sqldb;
            this.setState({ isSqlDbReady: true });
        })
        .catch((err) => {
            console.error(err);
        });

        // Get initial state
        this.state = {
            sharedStyles: getStyles(themes.darkTheme),
            theme: themes.darkTheme,
            dimensions,
            location
        };
    }

    componentDidMount () {
        location = AsyncStorage.getItem('@hoomanlogic-democracy:location').then(location => {
            if (location) {
                this.setState({ location });
            }
        });
    }

    updateLocation = (location) => {
        AsyncStorage.setItem('@hoomanlogic-democracy:location', location).then(() => {
            this.setState({ location });
        });
    }

    /******************************************
     * RENDERING
     *****************************************/
    render () {
        var { dimensions, location, isSqlDbReady, sharedStyles, theme } = this.state;
        var content;

        if (!isSqlDbReady) {
            content = <View style={sharedStyles.container}><Loading/></View>;
        }
        else {
            content = <Compare db={this.db} sqldb={this.sqldb} onSubscribe={this.updateLocation} { ...{ dimensions, location, sharedStyles, theme } }/>;
        }

        return (
            <View style={sharedStyles.container} onLayout={event => this.setState({ dimensions: event.nativeEvent.layout })}>
                {content}
            </View>
        );
    }
}

/******************************************
 * STYLES
 *****************************************/
const getStyles = function (theme) {
    var noBackground = 'transparent';
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bgColor,
        },
        list: {
            backgroundColor: noBackground,
            borderBottomWidth: 0,
            borderTopWidth: 0,
            marginLeft: 0,
            marginTop: 0,
        },
        listItem: {
            backgroundColor: noBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.bgColorLow,
            marginTop: 0,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            padding: 8,
            backgroundColor: noBackground,
            marginTop: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.bgColorLow,
        },
    });
};
