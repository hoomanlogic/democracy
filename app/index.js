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
//import Login from './flows/Login';
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

        // Initialize connection to Firebase db
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();

        // Initialize connection to SQLite db
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
            styles: getStyles(themes.darkTheme),
            theme: themes.darkTheme,
            dimensions,
            accessToken: false,
            location
        };
    }

    componentDidMount () {
        // if (this.login) {
        //     this.login.getAccessToken((accessToken) => this.setState({ accessToken }));
        // }
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
        var { /*accessToken, */dimensions, location, isSqlDbReady, styles, theme } = this.state;
        var content;

        if (!isSqlDbReady) {
            content = <View style={styles.container}><Loading/></View>;
        }
        else {
            // if (accessToken) {
            content = <Compare db={this.db} sqldb={this.sqldb} onSubscribe={this.updateLocation} { ...{ dimensions, location, theme } }/>;
            // }
            // else {            
            //     flow = <Login ref={ref => this.login = ref} onAuthenticated={(accessToken) => this.setState({ accessToken })} { ...{ dimensions, theme } }/>
            // }
        }

        return (
            <View style={styles.container} onLayout={event => this.setState({ dimensions: event.nativeEvent.layout })}>
                {content}
            </View>
        );
    }
}

/******************************************
 * STYLES
 *****************************************/
const getStyles = function (theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.bgColor,
        },
    });
};
