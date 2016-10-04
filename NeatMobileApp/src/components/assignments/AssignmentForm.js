import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
  TextInput,
  DatePickerIOS,
  TouchableOpacity
} from 'react-native';

import styles from './styles';

/* TODO make classFK not hard coded
   TODO add tasks here maybe(?)
*/

var moment = require('moment');

class AssignmentForm extends Component{
  constructor(){
    super();

    this.state = {
      assignmentName:"",
      date: new Date(),
      classFK: 'http://127.0.0.1:8000/api/classes/1/',
      showDatePicker: false,
      errors: [],

    }
  }
  //POSTS to the api
    async onDonePressed(){
        try {
            let response = await fetch('http://127.0.0.1:8000/api/assignments/',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  assignmentName: this.state.assignmentName,
                  classFK: this.state.classFK,
                  dueDate: this.state.date,
                })
            });

            let responseJson = await response.text();



            //verify if our operation was a success or failure
            if(response.status >= 200 && response.status < 300){
                console.log("response succes is:" + responseJson);
                this.props.navigator.push({
                  id: 'AssignmentsDash'
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
        this.setState({date: date});
      };


    render(){

        // TODO add start date and due date
        var showDatePicker = this.state.showDatePicker ?
                    <DatePickerIOS
                        style={{ height: 150 }}
                        date={this.state.date} onDateChange={(date)=>this.setState({date})}
                        mode="date"/> : <View />

        return(
        <View style={{ marginTop: 65 }}>

            <TextInput
                    style={styles.input}
                    onChangeText={(val) => this.setState({assignmentName: val})}
                    placeholder="Assignment Name">
            </TextInput>



                <TouchableOpacity
                    style={styles.input}
                    onPress={() => this.setState({showDatePicker: !this.state.showDatePicker})}
                >

                    <Text>{moment(this.state.date).format('DD/MM/YYYY')}</Text>

                </TouchableOpacity>
                {showDatePicker}

            <TouchableHighlight
                onPress={this.onDonePressed.bind(this)}
                style={styles.button}>
                    <Text style={{ color: '#ffffff' }}>
                        Done
                    </Text>
            </TouchableHighlight>
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

module.exports = AssignmentForm;


/*
this cod should be added later

            <DatePickerIOS
                      date={this.state.date}
                      mode="date"
                      timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                      onDateChange={this.onDateChange}
                />
*/