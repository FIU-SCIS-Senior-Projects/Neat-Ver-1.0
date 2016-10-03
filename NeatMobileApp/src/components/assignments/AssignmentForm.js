import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
  TextInput,
  DatePickerIOS
} from 'react-native';

import styles from './styles';

class AssignmentForm extends Component{
  constructor(){
    super();

    this.state = {
      taskName: "",
      assignment:"",
      date: new Date(),
      errors: [],

    }
  }
    async onDonePressed(){
        try {
            let response = await fetch('http://52.87.176.128/restapi/assginment/',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  taskName: this.state.taskName,
                  assignment: this.state.assignment,

                })
            });

            let responseJson = await response.text();

            /*
              The above information is all we need to touch our api with a PUT requests

              and tht is all the rest of the code is just to identify if we have
              a success or failure; in that case log the error and present it to the
              user.
            */

            //verify if our operation was a success
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
        return(
        <View style={{ marginTop: 65 }}>

            <TextInput
                    //onChangeText={(text)=> this.setState({text})}
                    style={styles.input}
                    onChangeText={(val) => this.setState({taskName: val})}
                    placeholder="taskName">
            </TextInput>

            <DatePickerIOS
                      date={this.state.date}
                      mode="date"
                      timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                      onDateChange={this.onDateChange}
                />


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

