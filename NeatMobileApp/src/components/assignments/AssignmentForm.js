import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  Picker,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';

/*
   TODO add tasks here maybe(?)

   NOTE: you must create school before being able to add an assignment
*/
const PickerItem = Picker.Item;
class AssignmentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reducedList: {},
      dataSource: [],
      assignmentName: '',
      dueDate: new Date(),
      classFK: '', // props.classUrl,
      showDatePicker: false,
      showPicker: false,
      errors: [],
      classObj: {},
      className: 'Select Class',
      pickerValue: 'Select Class',
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
    AuthService.addAssignment({
      assignmentName: this.state.assignmentName,
      classFK: this.state.classFK,
      dueDate: moment(this.state.dueDate).format('YYYY-MM-DD'),
    }, (results) => {
      if (results.success) {
        this.props.navigator.pop({ id: 'AssignmentsDash' });
      }
      console.log(results);
    });
    // try {
    //   let response = await fetch(CONFIG.server.host + '/assignment/', {
    //     method: 'POST',
    //     headers: this.state.authInfo.header,
    //     body: JSON.stringify({
    //       assignmentName: this.state.assignmentName,
    //       classFK: this.state.classFK,
    //       dueDate: moment(this.state.dueDate).format('YYYY-MM-DD')
    //     })
    //   });
    //
    //   let responseJson = await response.text();
    //
    //   //verify if our operation was a success or failure
    //   if (response.status >= 200 && response.status < 300) {
    //     console.log("response succes is:" + this.state.assignmentName);
    //     this.props.navigator.pop({id: 'AssignmentsDash'});
    //     console.log('DONE BUTTON WAS PRESSED')
    //   } else {
    //     console.log("response failure is:" + responseJson);
    //     let errors = responseJson;
    //     throw errors;
    //   }
    //
    // } catch (errors) {
    //
    //   console.log("catch errors:" + errors);
    //
    //   let formErrors = JSON.parse(errors);
    //
    //   let errorsArray = [];
    //
    //   for (let key in formErrors) {
    //     if (formErrors[key].length > 1) {
    //       formErrors[key].map(error => errorsArray.push(`${key} ${error}`))
    //     } else {
    //       errorsArray.push(`${key} ${formErrors[key]}`);
    //     }
    //   }
    //   this.setState({ errors: errorsArray });
    // }
  }

  onDateChange = (date) => {
    this.setState({ dueDate: date });
  };

  onValueChange = (value) => {
    const val = JSON.parse(value);

    this.setState({
      pickerValue: value,
      className: val.className,
      classFK: val.url,
    });
    // console.log('value change ', val.className);
    if (val.className === 'CREATE') {
      this.props.navigator.push({
        type: 'Pop',
        id: 'ClassForm',
      });
    }
  }

  fetchClasses() {
    AuthService.getClasses((responseJson) => {
      const classList = responseJson;
      const reduced = {};
      classList.map((s) => {
        reduced[s.classID] = s.className;
      });
      this.setState({ dataSource: classList, reducedList: reduced });
    });
  }

  render() {
    const showDatePicker = this.state.showDatePicker
      ? <DatePickerIOS
        style={{ height: 150 }}
        date={this.state.dueDate}
        onDateChange={this.onDateChange}
        mode="date"
      />
      : <View />;
    // const height = (this.state.isCollapsed) ? 0 : UIPICKER_HEIGHT;
    const pickItems = this.state.dataSource.map((classObj, i) => {
      return <PickerItem key={i} value={JSON.stringify(classObj)} label={classObj.className} />;
    });

    const showPicker = this.state.showPicker
      ? <Picker
        selectedValue={this.state.pickerValue}
        onValueChange={this.onValueChange}
      >
        {pickItems}
        <PickerItem value={'{"className": "CREATE"}'} label="Add new class" />
      </Picker> : <View />;

    return (
      <View style={[styles.container, { justifyContent: 'flex-start' }]}>
        <NavigationBar
          title={{
            title: 'Add Assignment',
            tintColor: '#F5FCFF',
          }}
          leftButton={{
            title: <FontAwesome name="times" size={20} />,
            handler: () => this.props.navigator.pop(),
            tintColor: '#F5FCFF',
          }}
          rightButton={{
            title: <FontAwesome name="check" size={25} />,
            handler: () => this.onDonePressed(),
            tintColor: '#F5FCFF',
          }}
          tintColor="#2194f3"
        />
        <View style={{ padding: 5 }} >
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.setState({ assignmentName: val })}
            placeholder="Assignment Name"
          />

          <Text style={{ paddingTop: 20 }}>
              Due Date
            </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => this.setState({ showDatePicker: !this.state.showDatePicker })}
          >
            <Text>{moment(this.state.dueDate).format('MM/DD/YYYY')}</Text>
          </TouchableOpacity>
          {showDatePicker}
          <TouchableOpacity
            onPress={() => this.setState({ showPicker: !this.state.showPicker })}
          >
            <Text>{this.state.className}</Text>
          </TouchableOpacity>
          {showPicker}
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
