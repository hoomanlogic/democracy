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
    constructor(props) {
        super(props);
        this.state = {
            list: null,
            styles: getStyles(props.theme),
        };
    }

    componentDidMount() {
        var { db } = this.props;
        this.props.db.ref('body/usa-senate/division').once('value', snapshot => {
            // Convert object snapshot to array
            var divisions = snapshot.val();
            divisions = Object.keys(snapshot.val()).map(key => { return { name: divisions[key], value: key }; });

            // Sort by last name first
            divisions.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            // Add ability to view all
            divisions.unshift({ name: 'All', value: '' });

            // Set component state
            this.setState({
                list: divisions
            });
        });
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressRow(row) {
        this.props.onSubscribe(row.value);
        this.props.onTab('POLITICIANS');
    }

    /***************************************************************
     * RENDERING
     **************************************************************/
    render() {
        var { body, division, style, theme } = this.props;
        var { list, styles } = this.state;
        var filteredList;

        if (!list) {
            return <Loading theme={theme} />;
        }

        if (!body) {
            filteredList = list;
        }
        else {
            filteredList = list.filter(row => !!row.memberOf[body] && (!division || division === '*' || row.memberOf[body].division === division));
        }

        return (
            <View style={style}>
                <ScrollView keyboardShouldPersistTaps>
                    <List containerStyle={styles.list}>
                        {
                            filteredList.map((row, i) => (
                                <ListItem
                                    containerStyle={styles.listItem}
                                    titleStyle={styles.listItemTitle}
                                    key={i}
                                    onPress={() => this.pressRow(row)}
                                    roundAvatar
                                    title={row.name}
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
        actionButton: {
            width: 60,
            height: 60,
            position: 'absolute',
            bottom: 10,
            right: 40
        },
        actionIcon: {
            backgroundColor: theme.bgColorHigh,
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

export default Politicians;
