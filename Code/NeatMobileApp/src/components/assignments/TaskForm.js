import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import styles from './styles';

import AuthService from '../../utilities/AuthService';
import { colors } from '../styles';
/*
   TODO add tasks here maybe(?)

   NOTE: you must create a class and a school before being able to add an assignment
*/

class TaskForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskName: '',
      dueDate: new Date(),
      // assignmentUrl: props.assignmentUrl,
      // taskList: props.assignment.tasks
      // user: `${CONFIG.server.host}/user/1/`,
      showDatePicker: false,
      errors: [],
      authInfo: null,
    };
  }

  componentDidMount() {
    AuthService.getLoginToken((err, authInfo) => {
      this.setState({
        authInfo,
      });
    });
  }

  // POSTS to the api
  async onDonePressed() {
    console.log(this.state.taskName);
    AuthService.addTask({
      name: this.state.taskName,
      // user: this.state.user,
      due: moment(this.state.dueDate).format('YYYY-MM-DD'),
      assignment: this.props.assignmentUrl,
    }, (results) => {
      if (results.success) {
        this.props.navigator.pop({
          id: 'AssignmentView',
          passProps: {
            assignmentUrl: this.state.assignmentUrl,
          },
        });
      }
    });
  }
  onDateChange = (date) => {
    this.setState({ dueDate: date });
  };

  render() {
    const showDatePicker = this.state.showDatePicker ?
      <DatePickerIOS
        style={{ height: 150 }}
        date={this.state.dueDate} onDateChange={this.onDateChange}
        mode="date"
      /> : <View />;

    return (
      <View style={{ alignItems: 'stretch' }}>
        <NavigationBar
          title={{
            title: 'Add Task',
            tintColor: colors.navBarText,
          }}
          leftButton={{
            title: <FontAwesome name="times" size={20} />,
            handler: () => this.props.navigator.pop(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <FontAwesome name="check" size={25} />,
            handler: () => this.onDonePressed(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <TextInput
          style={styles.input}
          onChangeText={(val) => this.setState({ taskName: val })}
          placeholder="Task Name"
          autoFocus
        />
        <Text style={{ paddingTop: 20 }}>Due Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => this.setState({ showDatePicker: !this.state.showDatePicker })}
        >

          <Text>{moment(this.state.dueDate).format('DD/MM/YYYY')}</Text>

        </TouchableOpacity>
        {showDatePicker}
      </View>
    );
  }
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i} style={styles.error}>{error}</Text>)}
    </View>
  );
};
TaskForm.propTypes = {
  navigator: React.PropTypes.object,
  assignmentUrl: React.PropTypes.object,
};

module.exports = TaskForm;
