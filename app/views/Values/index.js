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

class Values extends Component {
    /******************************************
     * COMPONENT LIFECYCLE
     *****************************************/
    constructor (props) {
        super(props);
        this.state = {
            flow: Flow.Values,
            motions: null,
            selectedValue: null,
            styles: getStyles(props.theme),
            values: null,
        };
    }

    componentDidMount () {
        // Listen for hardware back press to reverse flow
        BackAndroid.addEventListener('hardwareBackPress', this.pressBack);
        // Get values
        this.getValues();
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressBack = () => {
        var { flow } = this.state;
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
            motions: null,
        });
        // Return true to flag the hardware backpress as handled
        return true;
    }

    pressIssue = (row) => {
        this.setState({
            flow: Flow.Value,
            selectedValue: row,
        });
        // Get motions for selected value
        this.getMotions(row.id);
    }

    pressMotion = (row) => {
        this.setState({
            flow: Flow.Motion,
            selectedMotion: row,
        });
    }

    pressThumbDown = () => {

    }

    pressThumbUp = () => {
        
    }

    /***************************************************************
     * METHODS
     **************************************************************/
    getMotions (valueId) {
        var { sqldb } = this.props;
        // Get bodies/divisions of government
        sqldb.executeSql(
            `SELECT m.id, m.date, m.name, m.pass
            FROM value_activity a INNER JOIN motion m ON a.motionId = m.id
            WHERE a.valueId = '${valueId}'
            ORDER BY m.date DESC`
        )
        .then(([results]) => {
            var len = results.rows.length;
            var motions = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                // Add this row
                motions.push(row);
            }
            // Set component state
            this.setState({ motions });
        })
        .catch((err) => {
            console.error(err);
        });
    }

    getValues () {
        var { sqldb } = this.props;
        // Get bodies/divisions of government
        sqldb.executeSql(
            `SELECT i.id, i.name, i.icon
            FROM value i
            ORDER BY i.name`
        )
        .then(([results]) => {
            var len = results.rows.length;
            var values = [];
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                // Add this row
                values.push(row);
            }
            // Set component state
            this.setState({ values });
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
        var { flow, motions, selectedValue, styles, values } = this.state;
        var pane;

        switch (flow) {
            case Flow.Values:
                if (!values) {
                    return <Loading theme={theme}/>;
                }
                pane = (
                    <ScrollView keyboardShouldPersistTaps="always">
                        <List containerStyle={sharedStyles.list}>
                            {
                                values.map((row, i) => (
                                    <ListItem
                                        avatar={{ uri: 'http:' + row.icon }}
                                        containerStyle={sharedStyles.listItem}
                                        titleStyle={styles.listItemTitle}
                                        key={i}
                                        onPress={() => this.pressIssue(row)}
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
                break;
            case Flow.Value:
                if (!motions) {
                    return <Loading theme={theme}/>;
                }
                pane = (
                    <ScrollView keyboardShouldPersistTaps="always">
                        <FlowCrumb title={selectedValue.name} theme={theme} onPress={this.pressBack}/>
                        <List containerStyle={sharedStyles.list}>
                            {
                                motions.map((row, i) => (
                                    <View key={i}>
                                        <View style={styles.listItemTitleBox}>
                                            <Text style={styles.listItemTitle}>{row.name}</Text>
                                        </View>
                                        <View
                                            style={sharedStyles.row}
                                        >
                                            <View style={styles.thumb}>
                                                <Icon color={theme.foreColorLow} name={row.pass ? 'check' : 'close'} color={row.pass ? 'green' : 'red'} type="material" size={26}></Icon>
                                            </View>
                                            <View style={styles.date}>
                                                <Text style={styles.listItemSubtitle}>{new Date(Date.parse(row.date)).toLocaleDateString()}</Text>
                                            </View>
                                            <View style={styles.thumb}>
                                                <Icon color={theme.foreColorLow} name="thumb-up" type="material" size={26} onPress={() => this.pressThumbUp(row)}></Icon>
                                            </View>
                                            <View style={styles.thumb}>
                                                <Icon color={theme.foreColorLow} name="thumb-down" type="material" size={26} onPress={() => this.pressThumbDown(row)}></Icon>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            }
                        </List>
                    </ScrollView>
                );
                break;
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
        listItemTitleBox: {
            padding: 8,
        },
        date: {
            flex: 1,
        },
        thumb: {
            paddingLeft: 8,
            paddingRight: 8,
        },
        listItemTitle: {
            color: theme.foreColor,
        },
        listItemSubtitle: {
            color: theme.foreColorLow,
            textAlign: 'center',
        },
        icon: {
            backgroundColor: noBackground,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            padding: 8,
            backgroundColor: theme.bgColorLow,
            marginTop: 0,
            borderBottomWidth: 1,
        }
    });
};

/***************************************************************
 * PRIVATE
 **************************************************************/
const Flow = {
    Values: 0,
    Value: 1,
};

/***************************************************************
 * EXPORT
 **************************************************************/
export default Values;
