'use strict'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Text,View,TouchableHighlight,
         TextInput,Image,AlertIOS } from 'react-native';
// import styles from './styles';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)

var authService = require('../../utilities/AuthService');
var Header = require('./../Header');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var ResetPasswordForm = t.struct({
  username: t.String,
  //email: t.String,
  //password: t.String,
  //passwordAgain: t.String,
});

var options = {
  auto: 'placeholders',
  fields: {
/*    email: {
      autoCapitalize: 'none',
      keyboardType: 'email-address',
  },*/
    username: {
          autoCapitalize: 'none',
          error: 'Enter username'
    },
    /*password: {
      secureTextEntry: true,
      error: 'Enter password'
    },
    passwordAgain: {
      secureTextEntry: true,
      error: 'Enter password'
  },*/
  }
}


class ResetPassword extends Component {
  constructor(){
    super();

    this.state = {
      value: {
      },
      showValidation: false,
      //username: [],
      //email: "",
      //password: "",
      //password_confirmation: "",
      errors: [],
      success: false,
    }
  }

onRequestPressed(){

  console.log("show progress bar..");
  this.setState({showProgress: true});
  var value = this.refs.form.getValue();

  authService.requestCode({
      username: this.state.value.username,

    }, (results)=> {
        console.log("inside results");
          this.setState(Object.assign({
              showProgress: false
          }, results));
      if(results.success){
        //this.validateCode();
        console.log('Valid user');
        this.setState({
          value : {},
          success: false,
          badCredentials: false,
          unknownError: false
        })
    }else{
        console.log('error during codeRequest: ', results);
    }
  });
}
onValidate(){
    this.props.navigator.push({
      id: 'UpdatePassword'
    });
}
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

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#FFF',
      padding: 35,
      flex: 1,
    },
    logo: {
      alignSelf: 'center',
      width: 175,
      height: 175,
    },
    heading: {
      fontSize: 65,
      fontWeight: '300',
      alignSelf: 'center',
    },
    button: {
      height: 50,
      backgroundColor: '#FFF',
      borderColor: '#599D95',
      alignSelf: 'center',
      width: 275,
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      borderWidth: 2
    },
    textButton:{
      color: 'white'
    },
    buttonText:{
      fontSize: 16,
      color: 'grey',
      alignSelf: 'center',
      fontWeight: '100'
    },
    input:{
      height: 50,
      marginTop: 20,
      padding: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48bbec',
      borderRadius: 0,
      color: '#48BBEC',
  },
    inputs: {
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    inputIcon: {
        marginLeft: 15,
        width: 21,
        height: 21
    },
    inputContainer: {
        padding: 10,
        alignItems: 'stretch',
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 16,
        paddingLeft: 10
    },
    registerForgotContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
    },
    registerContainer: {
      alignItems: 'flex-start',
      padding: 15,
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
})

export default ResetPassword;
