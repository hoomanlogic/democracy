// @flow
import React, { Component } from 'react';
import {
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
        var { style, theme } = this.props;
        var { activityMap, issues, selectedIssue, styles } = this.state;
        var keys, pane;

        if (!issues) {
            return <Loading theme={theme} />;
        }

        if (selectedIssue) {
            if (!Object.keys(activityMap).length) {
                return <Loading theme={theme} />;
            }
            keys = Object.keys(activityMap);
            keys.reverse();
            // pane = (
            //     <View>{activityMap.name} - {key}</View>
            // );
            // {keys.map((key, i) => {
            //     activityMap[key].results
            //     return (
            //         <ListItem
            //             avatar={{ uri: 'http:' + row.icon }}
            //             containerStyle={styles.listItem}
            //             titleStyle={styles.listItemTitle}
            //             key={i}
            //             onPress={() => this.pressRow(row)}
            //             roundAvatar
            //             title={row.name}
            //             underlayColor={styles.icon}
            //             avatarStyle={styles.icon}
            //         />
            //     );
            // })}
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <View><Text>{issues.filter(a => a.key === selectedIssue)[0].name}</Text></View>
                    <List containerStyle={styles.list}>
                        {
                            keys.map(key => { return { ...activityMap[key], key }; }).map((row, i) => (
                                <ListItem
                                    containerStyle={styles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressActivityRow(row)}
                                    title={row.text}
                                    underlayColor="transparent"
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            );
        }
        else {            
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <List containerStyle={styles.list}>
                        {
                            issues.map((row, i) => (
                                <ListItem
                                    avatar={{ uri: 'http:' + row.icon }}
                                    containerStyle={styles.listItem}
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
        list: {
            backgroundColor: noBackground,
            marginLeft: 0,
            marginTop: 0,
            marginBottom: 70,
        },
        listItem: {
            backgroundColor: noBackground,
            marginTop: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.bgColorLow,
        },
        listItemTitle: {
            color: theme.foreColor,
        },
        icon: {
            backgroundColor: noBackground,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            padding: 8,
        },
    });
};

/***************************************************************
 * EXPORT
 **************************************************************/
export default Issues;
