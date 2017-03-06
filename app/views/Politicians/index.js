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
            divisions: null,
            flow: Flow.Divisions,
            politicians: null,
            selectedDivision: null,
            selectedPolitician: null,
            styles: getStyles(props.theme),
            votes: null,
        };
    }

    componentDidMount () {
        // Listen for hardware back press to reverse flow
        BackAndroid.addEventListener('hardwareBackPress', this.pressBack);
        // Get list of divisions
        this.getDivisions();
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressBack = () => {
        var { flow, politicians } = this.state;
        // Do not handle the hardware backpress
        // when at the beginning of the flow
        if (flow === 0) {
            return false;
        }
        // Back up to previous flow pane and clear results of it.
        // This is done to ensure the loading indicator will display,
        // rather than displays the results for a previous selection.
        this.setState({ 
            flow: flow - 1,
            politicians: flow < 2 ? null : politicians,
            votes: null,
        });
        // Return true to flag the hardware backpress as handled
        return true;
    }

    pressDivision = (row) => {
        // Set selected division and advance flow
        this.setState({
            flow: Flow.Policitians,
            selectedDivision: row
        });
        // Get list of politicians that are members of the selected division
        this.getPoliticians(row.bodyId, row.id);
    }

    pressPolitician = (row) => {
        // Set selected politician and advance flow
        this.setState({
            flow: Flow.Politician,
            selectedPolitician: row
        });
        // Get list of votes for the selected politician
        this.getVotes(row.id);
    }

    /***************************************************************
     * METHODS
     **************************************************************/
    getDivisions () {
        var { sqldb } = this.props;
        // Get bodies/divisions of government
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
            console.error(err);
        });
    }

    getPoliticians (bodyId, divisionId) {
        var { sqldb } = this.props;
        var query;
        if (divisionId) {
            query = `SELECT p.id AS id, p.icon AS icon, p.name AS name, p.sort AS sort, m.termEnd AS termEnd, m.refId AS refId, d.name AS divisionName, b.name AS bodyName
            FROM politician p INNER JOIN (membership m LEFT JOIN (division d LEFT JOIN body b ON d.bodyId = b.id) ON m.bodyId = d.bodyId AND m.divisionId = d.id) ON p.id = m.politicianId
            WHERE m.bodyId = '${bodyId}' AND m.divisionId = '${divisionId}'
            ORDER BY p.sort`;
        }
        else {
            query = `SELECT p.id AS id, p.icon AS icon, p.name AS name, p.sort AS sort, m.termEnd AS termEnd, m.refId AS refId, d.name AS divisionName, b.name AS bodyName
            FROM politician p INNER JOIN (membership m LEFT JOIN (division d LEFT JOIN body b ON d.bodyId = b.id) ON m.bodyId = d.bodyId AND m.divisionId = d.id) ON p.id = m.politicianId
            WHERE m.bodyId = '${bodyId}'
            ORDER BY p.sort`;
        }
        sqldb.executeSql(query)
        .then(([results]) => {
            var len = results.rows.length;
            var politicians = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                politicians.push(row);
            }

            // Set component state
            this.setState({ politicians });
        })
        .catch((err) => {
            console.error(err);
        });
    }

    getVotes (politicianId) {
        var { sqldb } = this.props;
        sqldb.executeSql(`SELECT t.name, t.date, v.vote, t.tieBreaker, t.pass
            FROM tally t INNER JOIN vote v ON t.id = v.tallyId
            WHERE v.politicianId = '${politicianId}'
            ORDER BY t.date DESC`)
        .then(([results]) => {
            var len = results.rows.length;
            var votes = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                votes.push(row);
            }

            // Set component state
            this.setState({ votes });
        })
        .catch((err) => {
            console.error(err);
        });
    }

    /***************************************************************
     * RENDERING
     **************************************************************/
    render () {
        var { sharedStyles, style, theme } = this.props;
        var { divisions, flow, politicians, selectedDivision, selectedPolitician, styles, votes } = this.state;
        var pane;
        
        switch (flow) {
            case Flow.Divisions:
                if (!divisions) {
                    return this.renderLoading(style);
                }
                // TODO: Switch to ListView, renderSectionHeader, cloneWithRowsAndSections solution
                pane = (
                    <ScrollView keyboardShouldPersistTaps="always">
                        <List containerStyle={sharedStyles.list}>
                            {
                                divisions.map((row, i) => {
                                    return (
                                        <ListItem
                                            containerStyle={sharedStyles.listItem}
                                            titleStyle={styles.listItemTitle}
                                            key={i}
                                            onPress={() => this.pressDivision(row)}
                                            title={row.name}
                                            subtitle={row.bodyName}
                                            underlayColor="transparent"
                                        />
                                    );
                                })
                            }
                        </List>
                    </ScrollView>
                );
                break;
            case Flow.Policitians:
                if (!politicians) {
                    return this.renderLoading(style);
                }
                pane = (
                    <ScrollView keyboardShouldPersistTaps="always">
                        <FlowCrumb
                            title={selectedDivision.name}
                            subtitle={selectedDivision.bodyName}
                            theme={theme}
                            onPress={this.pressBack}
                        />
                        <List containerStyle={sharedStyles.list}>
                            {
                                politicians.map((row, i) => (
                                    <ListItem
                                        avatar={{ uri: 'https:' + row.icon }}
                                        containerStyle={sharedStyles.listItem}
                                        titleStyle={styles.listItemTitle}
                                        key={i}
                                        onPress={() => this.pressPolitician(row)}
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
                break;
            case Flow.Politician:
                // TODO: Show all issues politician has voted on
                // TODO: Show "the talk", pull twitter feeds related to this politician
                if (!votes) {
                    return this.renderLoading(style);
                }
                pane = (
                    <ScrollView keyboardShouldPersistTaps="always">
                        <FlowCrumb
                            title={selectedPolitician.name}
                            subtitle={`${selectedPolitician.bodyName}${selectedPolitician.divisionName ? ': ' + selectedPolitician.divisionName : ''}`}
                            theme={theme}
                            onPress={this.pressBack}
                        />
                        <List containerStyle={sharedStyles.list}>
                            {
                                votes.map((row, i) => (
                                    <ListItem
                                        containerStyle={sharedStyles.listItem}
                                        titleStyle={styles.listItemTitle}
                                        key={i}
                                        title={row.name}
                                        subtitle={new Date(Date.parse(row.date)).toLocaleDateString()}
                                        underlayColor="transparent"
                                        avatarStyle={styles.icon}
                                        leftIcon={row.pass ? { name: 'check', color: 'green' } : { name: 'close', color: 'red' }}
                                        rightIcon={row.vote === 1 ? { name: 'thumb-up', type: 'material' } : (row.vote === 0 ? { name: 'thumb-down', type: 'material' } : { name: 'not-interested', type: 'material' })}
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

    renderLoading (style) {
        return (
            <View style={style}><Loading/></View>
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
 * PRIVATE
 **************************************************************/
const Flow = {
    Divisions: 0,
    Policitians: 1,
    Politician: 2
};

/***************************************************************
 * EXPORT
 **************************************************************/
export default Politicians;
