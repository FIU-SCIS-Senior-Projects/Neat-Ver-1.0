import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  TextInput,
  DatePickerIOS,
  TouchableOpacity,
  Image,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

/* TODO make classFK not hard coded
   TODO add tasks here maybe(?)

   NOTE: you must create a class and a school before being able to add an assignment
*/

import moment from 'moment';
import CONFIG from '../../config';
import AuthService from '../../utilities/AuthService';

class TaskForm extends Component{
  constructor(props){
    super(props);

    this.state = {
      taskName:"",
      dueDate: new Date(),
      // assignmentUrl: props.assignmentUrl,
      //taskList: props.assignment.tasks
      user: CONFIG.server.host + '/user/1/',
      showDatePicker: false,
      errors: [],
      authInfo: null,
    }
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
    try {
      let response = await fetch(CONFIG.server.host + '/task/', {
        method: 'POST',
        headers: this.state.authInfo.header,
        body: JSON.stringify({
          taskName: this.state.taskName,
          user: this.state.user,
          dueDate: moment(this.state.dueDate).format('YYYY-MM-DD'),
          assignment: this.props.assignmentUrl,
        })
      });

        let responseJson = await response.text();


        //verify if our operation was a success or failure
        if(response.status >= 200 && response.status < 300){
            console.log("response succes is:" + responseJson);
            this.props.navigator.pop({
              id: 'AssignmentView',
              passProps:{
                assignmentUrl: this.state.assignmentUrl
              }
            });
            console.log('DONE BUTTON WAS PRESSED')
        }else{
          console.log("response failure is:" + responseJson);
          let errors = responseJson;
          throw errors;
        }

      } catch(errors) {

        console.log("catch errors:" + errors);

        let formErrors = JSON.parse(errors);

        let errorsArray = [];

        for(let key in formErrors){
          if(formErrors[key].length > 1){
            formErrors[key].map(error => errorsArray.push(`${key} ${error}`))
          }else {
            errorsArray.push(`${key} ${formErrors[key]}`)
          }
        }
        this.setState({errors: errorsArray});
      }
    }

     onDateChange = (date) => {
        this.setState({dueDate: date});
      };


    render(){
        var showDatePicker = this.state.showDatePicker ?
                    <DatePickerIOS
                        style={{ height: 150 }}
                        date={this.state.dueDate} onDateChange={this.onDateChange}
                        mode="date"/> : <View />

        return(
            <View style={{ alignItems: 'stretch' }}>
            <NavigationBar
              title={{
                title: 'Add Task',
              tintColor: '#F5FCFF',
            }}
              leftButton={{
                title: <FontAwesome name='times' size={20} />,
                handler: () => this.props.navigator.pop(),
                tintColor: '#F5FCFF',
              }}
              rightButton={{
                title: <FontAwesome name='check' size={25} />,
                handler: () => this.onDonePressed(),
                tintColor: '#F5FCFF',
              }}
              tintColor='#2194f3'
               />
                <TextInput
                        style={styles.input}
                        onChangeText={(val) => this.setState({taskName: val})}
                        placeholder="Task Name">
                </TextInput>
                    <Text style={{paddingTop: 20}}>Due Date</Text>
                    <TouchableOpacity style={styles.input}
                        onPress={() => this.setState({showDatePicker: !this.state.showDatePicker})}>

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
    {props.errors.map((error,i) => <Text key={i} style = {styles.error}>{error}</Text>)}
    </View>
  );
}

module.exports = TaskForm;
