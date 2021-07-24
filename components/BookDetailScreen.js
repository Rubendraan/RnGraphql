import React, { Component } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_STUDENT = gql`
    query student($bookId: String) {
        student(id: $bookId) {
            _id
            studentID
            name
            course
            address
            age
            hobby
            updated_date
        }
    }
`;

const DELETE_STUDENT = gql`
  mutation removeStudent($id: String!) {
    removeStudent(id:$id) {
      _id
    }
  }
`;

class BookDetailScreen extends Component {
  static navigationOptions = {
    title: 'Student Details',
  };
  render() {
    const { navigation } = this.props;
    return (
        <Query pollInterval={500} query={GET_STUDENT} variables={{ bookId: navigation.getParam('id') }}>
            {({ loading, error, data }) => {
                if (loading) return(<View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                  </View>);
                if (error) return(<Text>`Error! ${error.message}`</Text>);
                return (
                    <ScrollView>
                        <Card style={styles.container}>
                            <View style={styles.subContainer}>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>studentID:</Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.studentID}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>name: </Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.name}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>course: </Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.course}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>address: </Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.address}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>age: </Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.age}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>hobby: </Text>
                                    <Text style={{fontSize: 18, marginBottom: 10}}>{data.student.hobby}</Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Updated Date: </Text>
                                    <Text style={{fontSize: 18}}>{data.student.updated_date}</Text>
                                </View>
                            </View>
                            <Mutation mutation={DELETE_STUDENT} key={data.student._id} onCompleted={() => navigation.goBack()}>
                                {(removeStudent, { loading2, error2 }) => (
                                    <View style={styles.subContainer}>
                                        <Button
                                        style={styles.detailButton}
                                        large
                                        backgroundColor={'#CCCCCC'}
                                        leftIcon={{name: 'edit'}}
                                        title='Edit'
                                        onPress={() => {
                                            navigation.navigate('EditStudent', { id: `${data.student._id}`, });
                                        }} />
                                        <Button
                                        style={styles.detailButton}
                                        large
                                        backgroundColor={'#999999'}
                                        color={'#FFFFFF'}
                                        leftIcon={{name: 'delete'}}
                                        title='Delete'
                                        onPress={() => {
                                            removeStudent({ variables: { id: data.student._id } })
                                            .then(res => res)
                                            .catch(err => <Text>{err}</Text>);
                                        }} />
                                        {loading2 && <View style={styles.activity}>
                                            <ActivityIndicator size="large" color="#0000ff" />
                                          </View>}
                                        {error2 && <Text>`Error! ${error2.message}`</Text>}
                                    </View>
                                )}
                            </Mutation>
                        </Card>
                    </ScrollView>
                );
            }}
        </Query>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subContainer: {
        flex: 1,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailButton: {
        marginTop: 10
    }
})

export default BookDetailScreen;