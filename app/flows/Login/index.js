import React, { Component } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
const fbsdk = require('react-native-fbsdk');
const { AccessToken, LoginButton } = fbsdk;

class Login extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);/**/
        // Get initial state
        this.state = {
            styles: getStyles(props.theme),
        };
    }

    getAccessToken (callback) {
        AccessToken.getCurrentAccessToken().then(
            data => {
                callback(data.accessToken.toString());
            }
        );
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                styles: getStyles(nextProps.theme),
            });
        }
    }

    /******************************************
     * RENDERING
     *****************************************/
    render () {
        var { db, dimensions, theme, onAuthenticated } = this.props;
        var { styles } = this.state;
        // publishPermissions={['publish_actions']}
        return (
            <View>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                console.log(error);
                            }
                            else if (result.isCancelled) {

                            }
                            else {
                                AccessToken.getCurrentAccessToken().then(
                                    data => {
                                        onAuthenticated(data.accessToken.toString());
                                    }
                                );
                            }
                        }
                    }
                />
            </View>
        );
    }
}

const getStyles = function (theme) {
    return StyleSheet.create({
        content: {
            flex: 1,
        },
        tabBar: {
            marginLeft: 0,
            backgroundColor: theme.bgColorLow,
        },
    });
};

export default Login;
