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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';
var moment = require('moment');

import styles from './styles';
import AuthService from '../../utilities/AuthService';

import CONFIG from '../../config';

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
      school: CONFIG.server.host + '/school/1/',
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
  //POSTS to the api
  async onDonePressed() {
    try {
      let response = await fetch(CONFIG.server.host + '/class/', {
        method: 'POST',
        headers: this.state.authInfo.header,
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
            title={{
              title: 'Add a New Class',
              tintColor: '#F5FCFF',
            }}
            leftButton={{
              title: <FontAwesome name='times' size={20} />,
              handler: () => this.onBackPressed(),
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
                      onChangeText={(val) => this.setState({className: val})}
                      placeholder="Class Name">
              </TextInput>
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
