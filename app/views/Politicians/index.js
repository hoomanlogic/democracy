// @flow
import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import {
    Icon,
    List,
    ListItem
} from 'react-native-elements';
import Loading from 'democracy/app/components/Loading';

class Politicians extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);
        this.state = {
            politicians: null,
            votes: null,
            styles: getStyles(props.theme),
        };
    }

    componentDidMount () {
        var { db } = this.props;
        this.props.db.ref('politician').once('value', snapshot => {
            // Convert object snapshot to array
            var politicians = snapshot.val();
            politicians = Object.keys(snapshot.val()).map(key => politicians[key]);

            // Sort by last name first
            politicians.sort((a, b) => {
                if (a.sortName < b.sortName) {
                    return -1;
                }
                else if (a.sortName > b.sortName) {
                    return 1;
                }
                return 0;
            });

            // Set component state
            this.setState({ politicians });
        });

        this.props.db.ref('vote/usa-senate').once('value', snapshot => {
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
    pressRow (row) {
        console.log(row);
    }

    /***************************************************************
     * RENDERING
     **************************************************************/
    render () {
        var { body, division, style, theme } = this.props;
        var { politicians, styles, votes } = this.state;
        var filteredList;

        if (!politicians || !votes) {
            return <Loading theme={theme} />;
        }

        if (!body) {
            filteredList = politicians;
        }
        else {
            filteredList = politicians.filter(row => !!row.memberOf[body] && (!division || division === '*' || row.memberOf[body].division === division));
        }

        filteredList = filteredList.map(row => {
            var votingScore = 0;
            if (row.memberOf['usa-senate']) {
                votes.forEach(vote => {
                    switch (vote.results[row.memberOf['usa-senate'].id]) {
                        case 0: // Nay on contentious vote
                            votingScore = votingScore + 1;
                            break;
                        case 1: // Yea on contentious vote
                            votingScore = votingScore - 2;
                            break;
                        case -1: // Did not vote on contentious vote
                            votingScore = votingScore - 1;
                    }
                });
            }
            return { 
                ...row,
                score: votingScore
            };
        });

        return (
            <View style={style}>
                <ScrollView keyboardShouldPersistTaps>
                    <List containerStyle={styles.list}>
                        {
                            filteredList.map((row, i) => (
                                <ListItem
                                    avatar={{ uri: 'https:' + row.icon }}
                                    containerStyle={styles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressRow(row)}
                                    roundAvatar
                                    title={`${row.name} [${row.score}]`}
                                    underlayColor={styles.icon}
                                    avatarStyle={styles.icon}
                                />
                            ))
                        }
                    </List>
                </ScrollView>
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
export default Politicians;
