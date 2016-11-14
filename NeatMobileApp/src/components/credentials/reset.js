'use strict'

import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Text,View,TouchableHighlight,
         TextInput,Image,AlertIOS } from 'react-native';
 import styles from './styles';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)

var authService = require('../../utilities/AuthService');
var Header = require('./../Header');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var ResetPasswordForm = t.struct({
  email: t.String
});

var options = {
  auto: 'placeholders',
  fields: {
    email: {
      autoCapitalize: 'none',
      keyboardType: 'email-address',
      error          : 'Enter valid e-mail address'
  }
  }
}


class ResetPassword extends Component {
  constructor(){
    super();

    this.state = {
      value: {
      },
      showValidation: false,
      email: "",
      errors: [],
      success: false,
    }
  }

onRequestPressed(){
  console.log("show progress bar..");
  this.setState({showProgress: true});
  var value = this.refs.form.getValue();

  authService.requestCode({
      email: this.state.value.email,

    }, (results)=> {
        console.log("inside results");
          this.setState(Object.assign({
              showProgress: false
          }, results));
      if(results.success){
        this.setState({
          value : "",
          success: false,
          badCredentials: false,
          unknownError: false,
        })
        this.props.navigator.push({
          id: 'UpdatePassword'
        });
    }else{
        console.log('error during codeRequest');
    }
  });
}

/*
validateCode(){
    //It is recommended using the Alert.alert method for cross-platform
    //support if you don't need to create iOS-only prompts.
    AlertIOS.prompt(
        'Code Validation',
        'We have sent you a code number to your primary email address, please enter the code bellow and click validade to continue the password reset process.',
        [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'},
            {text: 'Validate', onPress: () => this.onValidate()},
        ],
    );
}
*/

  render() {
    return (
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo}/>
        <Text style={styles.heading}>
          NEAT
        </Text>
        <View style={styles.inputs, styles.inputContainer}>
          <Form
            ref="form"
            type={ResetPasswordForm}
            options={options}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
          />
        </View>

        <TouchableHighlight style = {styles.button} onPress={this.onRequestPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Request
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

//Thisplays the errors if any
const Errors = (props) => {
  return (
    <View>
    {props.errors.map((error,i) => <Text key={i} style = {styles.error}>{error}</Text>)}
    </View>
  );
}

export default ResetPassword;
