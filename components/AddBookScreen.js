import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text } from 'react-native';
import { Button } from 'react-native-elements';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const ADD_STUDENT = gql`
    mutation AddStudent(
        $studentID: String!,
        $name: String!,
        $course: String!,
        $address: String!,
        $hobby: String!,
        $age: Int!) {
        addStudent(
            studentID: $studentID,
            name: $name,
            course: $course,
            address: $address,
            hobby: $hobby,
            age: $age) {
            _id
        }
    }
`;

class AddBookScreen extends Component {
  static navigationOptions = {
    title: 'Add Student',
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
    const { studentID, name, course, address, age, hobby } = this.state;
    return (
      <Mutation mutation={ADD_STUDENT} onCompleted={() => this.props.navigation.goBack()}>
          {(addStudent, { loading, error }) => (
            <ScrollView style={styles.container}>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'studentID'}
                    value={this.state.studentID}
                    onChangeText={(text) => this.updateTextInput(text, 'studentID')}
                />
              </View>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'name'}
                    value={this.state.name}
                    onChangeText={(text) => this.updateTextInput(text, 'name')}
                />
              </View>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'course'}
                    value={this.state.course}
                    onChangeText={(text) => this.updateTextInput(text, 'course')}
                />
              </View>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'address'}
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.address}
                    onChangeText={(text) => this.updateTextInput(text, 'address')}
                />
              </View>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'age'}
                    value={this.state.age}
                    keyboardType='numeric'
                    onChangeText={(text) => this.updateTextInput(text, 'age')}
                />
              </View>
              <View style={styles.subContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder={'hobby'}
                    value={this.state.hobby}
                    onChangeText={(text) => this.updateTextInput(text, 'hobby')}
                />
              </View>
              <View>
                <Button
                  large
                  leftIcon={{name: 'save'}}
                  title='Save'
                  onPress={() => {
                    addStudent({
                      variables: {
                        studentID: this.state.studentID,
                        name: this.state.name,
                        course: this.state.course,
                        address: this.state.address,
                        hobby: this.state.hobby,
                        age: parseInt(this.state.age),
                      }
                    })
                      .then(res => this.setState({ studentID: '', name: '', course: '', address: '', age: '', hobby }))
                      .catch(err => <Text>{err}</Text>);
                  }} />
              </View>
              {loading && <View style={styles.activity}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>}
              {error && <Text>`Error! ${error.message}`</Text>}
            </ScrollView>
          )}
        </Mutation>
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

export default AddBookScreen;