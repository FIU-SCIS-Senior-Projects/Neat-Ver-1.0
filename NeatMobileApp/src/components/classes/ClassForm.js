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

/* TODO 
change school id to dynamic
Get Token from when user logs in


*/
//For demo purposes only
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var moment = require('moment');

class ClassForm extends Component{
  constructor(){
    super();

    this.state = {
      className:"",
      classID: getRandomInt(100,200),
      school: 'http://52.87.176.128/api/schools/2/',

    }
  }
  //POSTS to the api
    async onDonePressed(){
        try {
            let response = await fetch('http://52.87.176.128/api/classes/',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Token 344009168785e1fc0d1ab09ea197412f291206ac'
                },
                body: JSON.stringify({
                  className: this.state.className,
                  classID: this.state.classID,
                  school: this.state.school,
                })
            });

            let responseJson = await response.text();



            //verify if our operation was a success or failure
            if(response.status >= 200 && response.status < 300){
                console.log("response succes is:" + responseJson);
                this.props.navigator.push({
                  id: 'ClassDash'
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

        return(
        <View style={{ marginTop: 65 }}>

            <TextInput
                    style={styles.input}
                    onChangeText={(val) => this.setState({className: val})}
                    placeholder="Class Name">
            </TextInput>

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

module.exports = ClassForm;
