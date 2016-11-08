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
  Image
} from 'react-native';

import styles from './styles';
import NavigationBar from 'react-native-navbar';

var moment = require('moment'),
    CONFIG = require('../../config.js');

/* TODO
change school id to dynamic
*/
//For demo purposes only
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class ClassForm extends Component{
  constructor(){
    super();

    this.state = {
      className:"",
      classID: getRandomInt(100,200),
      school: CONFIG.server.host + '/schools/1/',

    }
  }
  //POSTS to the api
    async onDonePressed(){
        try {
            let response = await fetch(CONFIG.server.host + '/classes/',{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  className: this.state.className,
                  classID: this.state.classID,
                  school: this.state.school
                })
            });

            let responseJson = await response.text();



            //verify if our operation was a success or failure
            if(response.status >= 200 && response.status < 300){
                console.log("response succes is:" + responseJson);
                this.props.navigator.pop({
                  id: 'ClassList'
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

      onBackPressed() {
         this.props.navigator.pop()

      }

render(){

        return(
          <Image source={require('../../assets/img/blurback.jpg')} style={styles.backgroundImage}>
          <View
            // style={{ marginTop: 65 }}
            >
          <NavigationBar
            title={{title: 'Add a New Class'}}
            leftButton={{
              title: 'Cancel',
              handler: () => this.onBackPressed()
            }}
            rightButton={{
              title: 'Done',
              handler: () => this.onDonePressed()
            }}
            tintColor='#4EC0B2'
             />
              <TextInput
                      style={styles.input}
                      onChangeText={(val) => this.setState({className: val})}
                      placeholder="Class Name">
              </TextInput>

              {/* <TouchableHighlight
                  onPress={this.onDonePressed.bind(this)}
                  style={styles.button}>
                      <Text style={styles.buttonText}>
                          Done
                      </Text>
              </TouchableHighlight>

              <TouchableHighlight
                  onPress={this.onBackPressed.bind(this)}
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
    {props.errors.map((error,i) => <Text key={i} style = {styles.error}>{error}</Text>)}
    </View>
  );
}

module.exports = ClassForm;
