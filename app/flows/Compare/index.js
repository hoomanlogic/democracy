import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import {
    Tabs, Tab, Icon
} from 'react-native-elements';
import Values from 'democracy/app/views/Values';
import Politicians from 'democracy/app/views/Politicians';

class Compare extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);/**/
        // Get initial state
        this.state = {
            selectedTab: 'POLITICIANS',
            styles: getStyles(props.theme),
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                styles: getStyles(nextProps.theme),
            });
        }
    }

    /******************************************
     * METHODS
     *****************************************/
    changeTab (selectedTab) {
        this.setState({ selectedTab });
    }

    /******************************************
     * RENDERING
     *****************************************/
    render () {
        var { db, dimensions, location, sharedStyles, sqldb, theme } = this.props;
        var { selectedTab, styles } = this.state;

        var isIssues = selectedTab === 'ISSUES';
        var isPoliticians = selectedTab === 'POLITICIANS';
        var renderIssuesIcon = () => <Icon name="comments" type="foundation" size={26}/>;
        var renderPoliticiansIcon = () => <Icon name="torsos-all" type="foundation" size={26}/>;

        return (
            <Tabs
                tabBarStyle={styles.tabBar}
            >
                <Tab
                    onPress={() => this.changeTab('ISSUES')}
                    renderIcon={renderIssuesIcon}
                    renderSelectedIcon={renderIssuesIcon}
                    selected={isIssues}
                    title={isIssues ? 'ISSUES' : null}
                >
                    <Values
                        db={db}
                        sqldb={sqldb}
                        dimensions={dimensions}
                        style={styles.content}
                        sharedStyles={sharedStyles}
                        theme={theme}
                    />
                </Tab>
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
                        sqldb={sqldb}
                        dimensions={dimensions}
                        style={styles.content}
                        sharedStyles={sharedStyles}
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
