// PACKAGES
import React, { Component } from 'react';
import {
    AsyncStorage,
    Dimensions,
    StyleSheet,
    View
} from 'react-native';
import firebase from 'firebase';
// COMPONENTS
import Compare from './flows/Compare';
import Login from './flows/Login';
// CONFIGS
import themes from './themes';
import firebaseConfig from '../firebase.config';

export default class App extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor(props) {
        super(props);

        var location;

        // Get initial device dimensions (orientation changes handled by View.onLayout)
        var dimensions = Dimensions.get('window');

        // Get data
        this.db = firebase.database();

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
            this.setState({ location })
        });
    }

    /******************************************
     * RENDERING
     *****************************************/
    render() {
        var { accessToken, dimensions, location, styles, theme } = this.state;
        var flow;
        // if (accessToken) {
        flow = <Compare db={this.db} onSubscribe={this.updateLocation} { ...{ dimensions, location, theme } }/>;
        // }
        // else {            
        //     flow = <Login ref={ref => this.login = ref} onAuthenticated={(accessToken) => this.setState({ accessToken })} { ...{ dimensions, theme } }/>
        // }
        return (
            <View style={styles.container} onLayout={event => this.setState({ dimensions: event.nativeEvent.layout })}>
                {flow}
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

/******************************************
 * INITIALIZATION
 *****************************************/
// Initialize Database Connection
firebase.initializeApp(firebaseConfig);
