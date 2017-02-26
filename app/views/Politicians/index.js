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
        var { body, sqldb } = this.props;


        sqldb.executeSql(
            `SELECT p.icon, p.name, p.sort, m.termEnd, m.refId
            FROM politician p INNER JOIN membership m ON p.id = m.politicianId
            WHERE m.bodyId = '${body}'`
        )
        .then(([results]) => {
            var len = results.rows.length;
            var politicians = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                politicians.push(row);
            }

            // Sort by last name first
            politicians.sort((a, b) => {
                if (a.sort < b.sort) {
                    return -1;
                }
                else if (a.sort > b.sort) {
                    return 1;
                }
                return 0;
            });

            // Set component state
            this.setState({ politicians });
        })
        .catch((err) => {
            console.log(err);
        });

        // db.ref('vote/usa-senate').once('value', snapshot => {
        //     // Convert object snapshot to array
        //     var votes = snapshot.val();
        //     votes = Object.keys(snapshot.val()).map(key => votes[key]);

        //     // Sort by descending date
        //     votes.sort((a, b) => {
        //         if (a.date < b.date) {
        //             return 1;
        //         }
        //         else if (a.date > b.date) {
        //             return -1;
        //         }
        //         return 0;
        //     });

        //     // Set component state
        //     this.setState({ votes });
        // });
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

        if (!politicians) {
            return <Loading theme={theme} />;
        }

        return (
            <View style={style}>
                <ScrollView keyboardShouldPersistTaps="always">
                    <List containerStyle={styles.list}>
                        {
                            politicians.map((row, i) => (
                                <ListItem
                                    avatar={{ uri: 'https:' + row.icon }}
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
            </View>
        );

        // filteredList = filteredList.map(row => {
        //     var votingScore = 0;
        //     if (row.memberOf['usa-senate']) {
        //         votes.forEach(vote => {
        //             switch (vote.results[row.memberOf['usa-senate'].id]) {
        //                 case 0: // Nay on contentious vote
        //                     votingScore = votingScore + 1;
        //                     break;
        //                 case 1: // Yea on contentious vote
        //                     votingScore = votingScore - 2;
        //                     break;
        //                 case -1: // Did not vote on contentious vote
        //                     votingScore = votingScore - 1;
        //             }
        //         });
        //     }
        //     return { 
        //         ...row,
        //         score: votingScore
        //     };
        // });

        // return (
        //     <View style={style}>
        //         <ScrollView keyboardShouldPersistTaps="always">
        //             <List containerStyle={styles.list}>
        //                 {
        //                     filteredList.map((row, i) => (
        //                         <ListItem
        //                             avatar={{ uri: 'https:' + row.icon }}
        //                             containerStyle={styles.listItem}
        //                             titleStyle={styles.listItemTitle}
        //                             key={i}
        //                             onPress={() => this.pressRow(row)}
        //                             roundAvatar
        //                             title={`${row.name} [${row.score}]`}
        //                             underlayColor={styles.icon}
        //                             avatarStyle={styles.icon}
        //                         />
        //                     ))
        //                 }
        //             </List>
        //         </ScrollView>
        //     </View>
        // );
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
