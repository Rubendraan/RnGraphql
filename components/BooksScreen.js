import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_STUDENT = gql`
  {
    students {
      _id
      name
      course
    }
  }
`;

class BooksScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'LIST OF STUDENTS',
            headerRight: (
            <Button
                buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
                onPress={() => { navigation.push('AddStudent') }}
            />
            ),
        };
    };

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.title}
            onPress={() => {
                this.props.navigation.navigate('StudentDetails', {
                    id: `${item._id}`,
                });
            }}
            chevron
            bottomDivider
        />
    )

    render() {
        return (
            <Query pollInterval={500} query={GET_STUDENT}>
                {({ loading, error, data }) => {
                    if (loading) return(
                        <View style={styles.activity}>
                            <ActivityIndicator size="large" color="#0000ff"/>
                        </View>
                    );
                    if (error) return(
                        <View style={styles.activity}>
                            <Text>`Error! ${error.message}`</Text>
                        </View>
                    );
                    return (
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={data.students}
                            renderItem={this.renderItem}
                        />
                    );
                }}
            </Query>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default BooksScreen;