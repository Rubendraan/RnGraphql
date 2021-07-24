import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

const GET_STUDENT = gql`
    query student($studentId: String) {
        student(id: $studentId) {
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

const UPDATE_STUDENT= gql`
    mutation updateStudent(
        $id: String!,
        $studentID: String!,
        $name: String!,
        $course: String!,
        $address: String!,
        $hobby: String!,
        $age: Int!) {
        updateStudent(
        id: $id,
        isbn: $studentID,
        name: $name,
        course: $course,
        address: $address,
        hobby: $hobby,
        age: $age) {
            updated_date
        }
    }
`;

class EditBookScreen extends Component {
  static navigationOptions = {
    title: 'Edit Student',
  };

  state = {
    studentID: '',
    name: '',
    course: '',
    address: '',
    age: '',
    hobby: '',
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }
  
  render() {
    const { navigation } = this.props;
    const { studentID, name, course, address, age, hobby } = this.state;
    return (
      <Query query={GET_STUDENT} variables={{ studentId: navigation.getParam('id') }}>
        {({ loading, error, data }) => {
          if (loading) return(<View style={styles.activity}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>);
          if (error) return(<Text>`Error! ${error.message}`</Text>);
          return (
            <Mutation mutation={UPDATE_STUDENT} key={data.student._id} onCompleted={() => navigation.goBack()}>
              {(updateStudent, { loading2, error2 }) => (
                <ScrollView style={styles.container}>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'studentID'}
                        defaultValue={data.student.studentID}
                        onChangeText={(text) => this.updateTextInput(text, 'studentID')}
                    />
                  </View>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'name'}
                        defaultValue={data.student.name}
                        onChangeText={(text) => this.updateTextInput(text, 'name')}
                    />
                  </View>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'course'}
                        defaultValue={data.student.course}
                        onChangeText={(text) => this.updateTextInput(text, 'course')}
                    />
                  </View>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'address'}
                        multiline={true}
                        numberOfLines={4}
                        defaultValue={data.student.address}
                        onChangeText={(text) => this.updateTextInput(text, 'address')}
                    />
                  </View>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'age'}
                        defaultValue={data.student.age.toString()}
                        keyboardType='numeric'
                        onChangeText={(text) => this.updateTextInput(text, 'age')}
                    />
                  </View>
                  <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'hobby'}
                        defaultValue={data.student.hobby}
                        onChangeText={(text) => this.updateTextInput(text, 'hobby')}
                    />
                  </View>
                  <View>
                    <Button
                      large
                      leftIcon={{name: 'save'}}
                      title='Save'
                      onPress={() => {
                        if (this.state.studentID === '')
                          this.state.studentID = data.student.studentID;
                        if (this.state.name === '')
                          this.state.name = data.student.name;
                        if (this.state.course === '')
                          this.state.course = data.student.course;
                        if (this.state.address === '')
                          this.state.address = data.student.address;
                        if (this.state.hobby === '')
                          this.state.hobby = data.student.hobby;
                        if (this.state.age === '')
                          this.state.age = data.student.age;
                        updateStudent({
                          variables: {
                            id: data.student._id,
                            isbn: this.state.studentID,
                            title: this.state.name,
                            author: this.state.course,
                            description: this.state.address,
                            publisher: this.state.hobby,
                            published_year: parseInt(this.state.age),
                          }
                        })
                          .then(res => res)
                          .catch(err => <Text>{err}</Text>);
                      }} />
                  </View>
                  {loading2 && <View style={styles.activity}>
                      <ActivityIndicator size="large" color="#0000ff" />
                    </View>}
                  {error2 && <Text>`Error! ${error2.message}`</Text>}
                </ScrollView>
              )}
            </Mutation>
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
    marginBottom: 20,
    padding: 5,
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
  textInput: {
    fontSize: 18,
    margin: 5,
  },
})

export default EditBookScreen;