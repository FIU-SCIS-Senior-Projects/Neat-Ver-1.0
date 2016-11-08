import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  Image,
  Picker,
  Animated
} from 'react-native';

import styles from './styles';
import NavigationBar from 'react-native-navbar';
const UIPICKER_HEIGHT = 300;

/* TODO make classFK not hard coded
   TODO add tasks here maybe(?)

   NOTE: you must create a class and a school before being able to add an assignment
*/

var moment = require('moment'),
  CONFIG = require('../../config.js');

var PickerItem = Picker.Item;

class AssignmentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0),
      reducedList: {},
      dataSource: [],
      assignmentName: "",
      dueDate: new Date(),
      classFK: props.classUrl,
      showDatePicker: false,
      errors: [],
      classObj: {},
      className: 'Select Class',
      value: {}
    }
    // console.log(this.state.classFK);
  }

  componentDidMount() {
    this.fetchClasss();
  }

  fetchClasss() {
    return fetch(CONFIG.server.host + '/classes/').then((response) => response.json()).then((responseJson) => {

      let classList = responseJson;
      console.log(classList);
      let reduced = {};
      classList.map((s) => {
        reduced[s.classID] = s.className;
      });
      console.log(reduced);

      this.setState({dataSource: classList, reducedList: reduced})
    }).catch((error) => {
      console.error(error);
    });
  }

  //POSTS to the api
  async onDonePressed() {

    try {
      let response = await fetch(CONFIG.server.host + '/assignments/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentName: this.state.assignmentName,
          classFK: this.state.classFK,
          dueDate: moment(this.state.dueDate).format('YYYY-MM-DD')
        })
      });

      let responseJson = await response.text();

      //verify if our operation was a success or failure
      if (response.status >= 200 && response.status < 300) {
        console.log("response succes is:" + this.state.assignmentName);
        this.props.navigator.pop({id: 'AssignmentsDash'});
        console.log('DONE BUTTON WAS PRESSED')
      } else {
        console.log("response failure is:" + responseJson);
        let errors = responseJson;
        throw errors;
      }

    } catch (errors) {

      console.log("catch errors:" + errors);

      let formErrors = JSON.parse(errors);

      let errorsArray = [];

      for (let key in formErrors) {
        if (formErrors[key].length > 1) {
          formErrors[key].map(error => errorsArray.push(`${key} ${error}`))
        } else {
          errorsArray.push(`${key} ${formErrors[key]}`)
        }
      }
      this.setState({errors: errorsArray});
    }
  }

  onDateChange = (date) => {
    this.setState({dueDate: date});
  };

  render() {
    // let animation = Animated.timing;
    // let animationConfig = {duration: 200};
    var showDatePicker = this.state.showDatePicker
      ? <DatePickerIOS
          style={{height: 150}}
          date={this.state.dueDate}
          onDateChange={this.onDateChange}
          mode="date"/>
      : <View/>

    const height = (this.state.isCollapsed) ? 0 : UIPICKER_HEIGHT;
    const pickItems = this.state.dataSource.map((classObj) => {
      return <PickerItem key={classObj.classID} value={classObj} label={classObj.className}/>
    });
    return (
      <Image
        source={require('../../assets/img/blurback.jpg')}
        style={styles.backgroundImage}>
        <View style={{alignItems: 'stretch'}}>
        <NavigationBar
          title={{title: 'Add Assignment'}}
          leftButton={{
            title: 'Cancel',
            handler: () => this.props.navigator.pop()
          }}
          rightButton={{
            title: 'Done',
            handler: () => this.onDonePressed()
          }}
          tintColor='#4EC0B2'
           />
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.setState({assignmentName: val})}
            placeholder="Assignment Name">
          </TextInput>

          <Text style={{paddingTop: 20}}>
            Due Date
          </Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => this.setState({showDatePicker: !this.state.showDatePicker})}>
            <Text>{moment(this.state.dueDate).format('MM/DD/YYYY')}</Text>

          </TouchableOpacity>
            {showDatePicker}

          <TouchableOpacity
            onPress={() => {
            Animated.timing(this.state.height, Object.assign({
              toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0
            }, {duration: 200})).start();
            this.setState({isCollapsed: !this.state.isCollapsed});
          }}>
            <Text>{this.state.className}</Text>

          </TouchableOpacity>

          <Animated.View style={{height: this.state.height, overflow: 'hidden'}}>
            <Picker
                  selectedValue={this.state.className}
                  onValueChange={(value) => this.setState({classObj: value, className: value.className})}>
                  {pickItems}
                  <PickerItem value='CREATE' label='Add new class'/>
                </Picker>
          </Animated.View>

          {/* <TouchableHighlight
            onPress={this.onDonePressed.bind(this)}
            style={styles.button}>
            <Text style={styles.buttonText}>
              Done
            </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.props.navigator.pop()}
            style={styles.button}>
            <Text style={styles.buttonText}>
              Back
            </Text>
          </TouchableHighlight> */}
        </View>
      </Image>
    );
  }
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i} style={styles.error}>{error}</Text>)}
    </View>
  );
}

module.exports = AssignmentForm;
