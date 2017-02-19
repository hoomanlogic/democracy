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
            this.setState({
                list: politicians
            });
        });
    }

    /***************************************************************
     * EVENT HANDLING
     **************************************************************/
    pressRow(row) {
        console.log(row);
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
                                    avatar={{ uri: 'https:' + row.icon }}
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
