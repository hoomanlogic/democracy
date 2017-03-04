// @flow
import React, { Component } from 'react';
import {
    BackAndroid,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    Icon,
    List,
    ListItem
} from 'react-native-elements';
import FlowCrumb from 'democracy/app/components/FlowCrumb';
import Loading from 'democracy/app/components/Loading';

class Issues extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);
        this.state = {
            activityMap: {},
            issues: null,
            selectedIssue: null,
            styles: getStyles(props.theme),
        };
    }

    componentDidMount () {
        var { db } = this.props;

        // Back up flow
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.state.selectedIssue) {
                this.setState({ selectedIssue: null });
                return true;
            }
            return false;
        });

        db.ref('issue').once('value', snapshot => {
            // Convert object snapshot to array
            var issues = snapshot.val();
            issues = Object.keys(snapshot.val()).map(key => { return { ...issues[key], key }; });

            // Sort by name
            issues.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            // Set component state
            this.setState({ issues });
        });

        db.ref('vote/usa-senate').once('value', snapshot => {
            // Convert object snapshot to array
            var votes = snapshot.val();
            votes = Object.keys(snapshot.val()).map(key => votes[key]);

            // Sort by descending date
            votes.sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                }
                else if (a.date > b.date) {
                    return -1;
                }
                return 0;
            });

            // Set component state
            this.setState({ votes });
        });
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressActivityRow (row) {
        var resultsMap = {};
        this.setState({
            selectedActivity: row.key,
            resultsMap
        });
    }

    pressRow (row) {
        var { db } = this.props;
        var activityMap = {};
        this.setState({
            selectedIssue: row.key,
            activityMap
        });

        var keys = Object.keys(row.activity);
        keys.reverse();
        keys.forEach(key => {
            db.ref(row.activity[key]).once('value', snapshot => {
                // Convert object snapshot to array
                var activity = snapshot.val();

                // Set component state
                activityMap[key] = activity;
                this.setState({ activityMap });
            });
        });
    }

    /***************************************************************
     * RENDERING
     **************************************************************/
    render () {
        var { sharedStyles, style, theme } = this.props;
        var { activityMap, issues, selectedIssue, styles } = this.state;
        var keys, pane;

        if (!issues) {
            return <Loading theme={theme}/>;
        }

        if (selectedIssue) {
            if (!Object.keys(activityMap).length) {
                return <Loading theme={theme}/>;
            }
            keys = Object.keys(activityMap);
            keys.reverse();
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <FlowCrumb title={issues.filter(a => a.key === selectedIssue)[0].name} theme={theme} onPress={() => this.setState({ selectedIssue: null })}/>
                    <List containerStyle={sharedStyles.list}>
                        {
                            keys.map(key => { return { ...activityMap[key], key }; }).map((row, i) => (
                                <View
                                    key={i}
                                    style={sharedStyles.row}
                                >
                                    <View style={styles.liTitle}>
                                        <Text style={styles.listItemTitle}>{row.text}</Text>
                                    </View>
                                    <View style={styles.thumb}>
                                        <Icon color={theme.foreColorLow} name="thumb-up" type="material" size={26} onPress={() => this.pressActivityRow(row)}></Icon>
                                    </View>
                                    <View style={styles.thumb}>
                                        <Icon color={theme.foreColorLow} name="thumb-down" type="material" size={26} onPress={() => this.pressActivityRow(row)}></Icon>
                                    </View>
                                </View>
                            ))
                        }
                    </List>
                </ScrollView>
            );
        }
        else {            
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <List containerStyle={sharedStyles.list}>
                        {
                            issues.map((row, i) => (
                                <ListItem
                                    avatar={{ uri: 'http:' + row.icon }}
                                    containerStyle={sharedStyles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressRow(row)}
                                    roundAvatar
                                    title={row.name}
                                    underlayColor="transparent"
                                    avatarStyle={styles.icon}
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            );
        }

        return (
            <View style={style}>
                {pane}
            </View>
        );
    }
}

/***************************************************************
 * STYLING
 **************************************************************/
const noBackground = 'transparent';
const getStyles = function (theme) {
    return StyleSheet.create({
        liTitle: {
            flex: 1
        },
        thumb: {
            padding: 8,
        },
        listItemTitle: {
            color: theme.foreColor,
        },
        icon: {
            backgroundColor: noBackground,
        },
    });
};

/***************************************************************
 * EXPORT
 **************************************************************/
export default Issues;
