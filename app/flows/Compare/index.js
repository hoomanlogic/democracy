import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    Tabs, Tab, Icon
} from 'react-native-elements';
import Politicians from 'democracy/app/views/Politicians';
import Subscriptions from 'democracy/app/views/Subscriptions';

class Compare extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor(props) {
        super(props);/**/
        // Get initial state
        this.state = {
            selectedTab: 'POLITICIANS',
            styles: getStyles(props.theme),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                styles: getStyles(nextProps.theme),
            });
        }
    }

    /******************************************
     * METHODS
     *****************************************/
    changeTab(selectedTab) {
        this.setState({ selectedTab });
    }

    /******************************************
     * RENDERING
     *****************************************/
    render() {
        var { db, dimensions, location, theme } = this.props;
        var { selectedTab, styles } = this.state;

        var isPoliticians = selectedTab === 'POLITICIANS';
        var isSubscriptions = selectedTab === 'SUBSCRIPTIONS';
        var renderPoliticiansIcon = () => <Icon name="torsos-all" type="foundation" size={26}/>;
        var renderSubscriptionsIcon = () => <Icon name="list" type="foundation" size={26}/>;

        return (
            <Tabs
                tabBarStyle={styles.tabBar}
            >
                <Tab
                    onPress={() => this.changeTab('POLITICIANS')}
                    renderIcon={renderPoliticiansIcon}
                    renderSelectedIcon={renderPoliticiansIcon}
                    selected={isPoliticians}
                    title={isPoliticians ? 'POLITICIANS' : null}
                >
                    <Politicians
                        body="usa-senate"
                        division={location}
                        db={db}
                        dimensions={dimensions}
                        style={styles.content}
                        theme={theme}
                    />
                </Tab>
                <Tab
                    onPress={() => this.changeTab('SUBSCRIPTIONS')}
                    renderIcon={renderSubscriptionsIcon}
                    renderSelectedIcon={renderSubscriptionsIcon}
                    selected={isSubscriptions}
                    title={isSubscriptions ? 'SUBSCRIPTIONS' : null}
                >
                    <Subscriptions
                        onSubscribe={this.props.onSubscribe}
                        onTab={(tab) => this.changeTab(tab)}
                        current={location}
                        db={db}
                        dimensions={dimensions}
                        style={styles.content}
                        theme={theme}
                    />
                </Tab>
            </Tabs>
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

export default Compare;
