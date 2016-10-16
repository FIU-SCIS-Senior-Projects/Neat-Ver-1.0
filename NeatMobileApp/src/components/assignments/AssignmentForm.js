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
  TouchableOpacity
} from 'react-native';

import styles from './styles';

/* TODO make classFK not hard coded
   TODO add tasks here maybe(?)

   NOTE: you must create a class and a school before being able to add an assignment
*/

var moment = require('moment');

class AssignmentForm extends Component{
  constructor(){
    super();

    this.state = {
      assignmentName:"",
      dueDate: new Date(),
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
                  dueDate: moment(this.state.dueDate).format('YYYY-MM-DD')
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
        this.setState({dueDate: date});
      };


    render(){
        var showDatePicker = this.state.showDatePicker ?
                    <DatePickerIOS
                        style={{ height: 150 }}
                        date={this.state.dueDate} onDateChange={this.onDateChange}
                        mode="date"/> : <View />

        return(
        <View style={{ marginTop: 65 }}>

            <TextInput
                    style={styles.input}
                    onChangeText={(val) => this.setState({assignmentName: val})}
                    placeholder="Assignment Name">
            </TextInput>
                <Text style={{paddingTop: 20}}>Due Date</Text>
                <TouchableOpacity style={styles.input}
                    onPress={() => this.setState({showDatePicker: !this.state.showDatePicker})}>

                    <Text>{moment(this.state.dueDate).format('DD/MM/YYYY')}</Text>

                </TouchableOpacity>
                {showDatePicker}

            <TouchableHighlight
                onPress={this.onDonePressed.bind(this)}
                style={styles.button}>
                    <Text style={styles.buttonText}>
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
