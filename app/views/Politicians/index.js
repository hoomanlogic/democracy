// @flow
import React, { Component } from 'react';
import {
    BackAndroid,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import {
    List,
    ListItem
} from 'react-native-elements';
import FlowCrumb from 'democracy/app/components/FlowCrumb';
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
        var { sqldb } = this.props;

        // Back up flow
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.state.selectedBody) {
                // Clear selection to return to Body/Division list
                this.setState({
                    selectedBody: null,
                    selectedDivision: null
                });
                return true;
            }
            return false;
        });

        sqldb.executeSql(
            `SELECT d.id, d.name, d.bodyId, b.name AS bodyName
            FROM body b INNER JOIN division d ON b.id = d.bodyId
            ORDER BY b.name, d.name`
        )
        .then(([results]) => {
            var len = results.rows.length;
            var divisions = [];
            var currentBody;
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                // Start with All option for each body of government
                if (currentBody !== row.bodyId) {
                    divisions.push({
                        id: '',
                        name: 'All',
                        bodyId: row.bodyId,
                        bodyName: row.bodyName,
                    });
                    currentBody = row.bodyId;
                }
                // Add this row
                divisions.push(row);
            }

            // Set component state
            this.setState({ divisions });
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

    getPoliticians (bodyId, divisionId) {
        var { sqldb } = this.props;
        var query;
        if (divisionId) {
            query = `SELECT p.icon, p.name, p.sort, m.termEnd, m.refId
            FROM politician p INNER JOIN membership m ON p.id = m.politicianId
            WHERE m.bodyId = '${bodyId}' AND m.divisionId = '${divisionId}'`;
        }
        else {
            query = `SELECT p.icon AS icon, p.name AS name, p.sort AS sort, m.termEnd AS termEnd, m.refId AS refId, d.name AS divisionName
            FROM politician p INNER JOIN (membership m LEFT JOIN division d ON m.bodyId = d.bodyId AND m.divisionId = d.id) ON p.id = m.politicianId
            WHERE m.bodyId = '${bodyId}'`;
        }
        sqldb.executeSql(query)
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
            console.error(err);
        });
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressRow (row) {
        console.log(row);
    }

    pressDivisionRow (row) {
        // Set selected state
        this.setState({ selectedBody: row.bodyId , selectedDivision: row.id, politicians: null });
        this.getPoliticians(row.bodyId, row.id);
    }

    /***************************************************************
     * RENDERING
     **************************************************************/
    render () {
        var { sharedStyles, style, theme } = this.props;
        var { divisions, politicians, selectedBody, selectedDivision, styles } = this.state;
        var pane;
        
        if (selectedBody) {
            if (!politicians) {
                return <View style={style}><Loading/></View>;
            }
            var division = divisions.filter(a => a.id === selectedDivision && a.bodyId === selectedBody)[0];
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <FlowCrumb
                        title={division.name}
                        subtitle={division.bodyName}
                        theme={theme}
                        onPress={() => this.setState({ selectedBody: null, selectedDivision: null, politicians: null })}
                    />
                    <List containerStyle={sharedStyles.list}>
                        {
                            politicians.map((row, i) => (
                                <ListItem
                                    avatar={{ uri: 'https:' + row.icon }}
                                    containerStyle={sharedStyles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressRow(row)}
                                    roundAvatar
                                    title={row.name}
                                    subtitle={selectedDivision ? undefined : row.divisionName}
                                    underlayColor="transparent"
                                    avatarStyle={styles.icon}
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            );
        }
        else {
            if (!divisions) {
                return <View style={style}><Loading/></View>;
            }
            pane = (
                <ScrollView keyboardShouldPersistTaps="always">
                    <List containerStyle={sharedStyles.list}>
                        {
                            divisions.map((row, i) => (
                                <ListItem
                                    containerStyle={sharedStyles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressDivisionRow(row)}
                                    title={row.name}
                                    subtitle={row.bodyName}
                                    underlayColor="transparent"
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
        listItemTitle: {
            color: theme.foreColor,
        },
        icon: {
            backgroundColor: noBackground,
            height: 50,
            width: 50,
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
