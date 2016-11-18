import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  Animated,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';
import GenericPicker from '../GenericPicker';
import AssignmentPicker from '../AssignmentPicker';
import { colors } from '../styles';


/*
   NOTE: you must create school before being able to add an assignment
*/
const UIPICKER_HEIGHT = 216;

class AssignmentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      assignments: [],
      assignmentName: 'Select Assignment',
      assignPublic: true,
      assignUrl: '',
      assignmentValue: '',
      className: 'Select Class',
      private: true,
      dueDate: new Date(),
      classFK: '',
      classValue: '',
      isCollapsed: true,
      height: new Animated.Value(0),
      errors: [],
    };
  }

  componentDidMount() {
    this.fetchClasses();
  }

  componentWillReceiveProps() {
    this.fetchClasses();
  }

  // POSTS to the api
  onDonePressed() {
    if (this.state.assignPublic) {
      AuthService.joinAssignment({
        classFK: this.state.classFK,
        assignment: this.state.assignUrl,
      }, (results) => {
        // console.log(results);
        if (results.success) {
          this.props.navigator.pop({ id: 'AssignmentsDash' });
        }
      });
    } else {
      AuthService.addAssignment({
        assignmentName: this.state.assignmentName,
        classFK: this.state.classFK,
        due: moment(this.state.dueDate).format('YYYY-MM-DD'),
      }, (results) => {
        if (results.success) {
          this.props.navigator.pop({ id: 'AssignmentsDash' });
        }
      });
    }
  }

  onDateChange = (date) => {
    this.setState({ dueDate: date });
  };

  onValueChangeClass = (value) => {
    const val = JSON.parse(value);
    this.setState({
      classValue: value,
      className: val.className,
      classFK: val.url,
      isCollapsed: true,
      private: val.isPublic,
      assignments: val.assignments,
    });

    if (val.className === 'Add New Class') {
      this.props.navigator.push({
        type: 'Pop',
        id: 'ClassForm',
      });
    }
  }

  onValueChangeAssignment = (value) => {
    const val = JSON.parse(value);
    this.setState({
      assignmentValue: value,
      isCollapsed: true,
      assignmentName: val.assignmentName,
      dueDate: val.dueDate,
      assignPublic: val.isPublic,
      assignUrl: val.url,
    });
  }

  fetchClasses() {
    AuthService.getClasses((responseJson) => {
      const classList = responseJson;
      classList.push({ className: 'Add New Class' });
      this.setState({ dataSource: classList });
    });
  }

  render() {
    const animationConfig = {
      duration: 200,
    };
    const animation = Animated.timing;

    const height = (this.state.isCollapsed) ? 0 : UIPICKER_HEIGHT;

    const manualForm = (!this.state.private) ?
      <View>
        <View
          style={{ borderBottomWidth: 1,
            borderColor: '#2194f3' }}
        >
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.setState({ assignmentName: val })}
            placeholder="Assignment Name"
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              animation(this.state.height, Object.assign({
                toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0,
              }, animationConfig)).start();
              this.setState({ isCollapsed: !this.state.isCollapsed });
            }}
          >
            <Text>Due</Text>
          </TouchableOpacity>

          <Animated.View style={{ height: this.state.height, overflow: 'hidden' }}>
            <DatePickerIOS
              date={this.state.dueDate}
              onDateChange={this.onDateChange}
              mode="date"
              style={{ height }}
            />
          </Animated.View>
        </View>
      </View> :
      <AssignmentPicker
        list={this.state.assignments}
        name={this.state.assignmentName}
        pickerValue={this.state.assignmentValue}
        onValueChange={this.onValueChangeAssignment}
      />;
    return (
      <View style={[styles.container, { justifyContent: 'flex-start' }]}>
        <NavigationBar
          title={{
            title: 'Add Assignment',
            tintColor: colors.navBarText,
          }}
          leftButton={{
            title: <Icon name="ios-close" size={35} />,
            handler: () => this.props.navigator.pop(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <Icon name="ios-checkmark" size={35} />,
            handler: () => this.onDonePressed(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <View style={{ padding: 5 }} >
          <GenericPicker
            list={this.state.dataSource}
            name={this.state.className}
            pickerValue={this.state.classValue}
            onValueChange={this.onValueChangeClass}
          />
          {manualForm}
        </View>

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

AssignmentForm.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = AssignmentForm;
