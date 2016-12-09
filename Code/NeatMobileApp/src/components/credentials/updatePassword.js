'use strict'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Text,View,TouchableHighlight,
         TextInput,Image,AlertIOS } from 'react-native';
 import styles from './styles';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)
import AuthService from '../../utilities/AuthService';


var t = require('tcomb-form-native');
var Form = t.form.Form;

var UpdatePasswordForm = t.struct({
  code         : t.String,
  newPassword  : t.String,
  email        : t.String,
});

var options = {
  auto: 'placeholders',
    fields: {
        code: {
            autoCapitalize: 'none',
            error         : 'Enter valid code',
        },
        email:{
            autoCapitalize: 'none',
            keyboardType  : 'email-address',
            error         : 'Enter email address',
        },
        newPassword: {
            secureTextEntry: true,
            error          : 'Enter new password'
        },
    }
}


class UpdatePassword extends Component {
  constructor(props){
    super(props);

    this.state = {
      value: {
      },
      code:"",
      showValidation: false,
      email: "",
      password: "",
      errors: [],
      showProgress: false,
      success: false,
      errors: [],
    }
  }

onUpdatePasswordPressed(){
  this.setState({showProgess: true});
  var value = this.refs.form.getValue();

  AuthService.changePassword({
      //value
      newPassword: this.state.value.newPassword,
      code: this.state.value.code,
      email: this.state.value.email,
    }, (results)=> {
          this.setState(Object.assign({
              showProgress: false
          }, results));

        if(results.success){
            console.log('Valid password');
            this.setState({
                value : {},
                success: false,
                badCredentials: false,
                unknownError: false
            });
            this.props.navigator.push({
                id: 'Login'
            });

        }else{
            console.log('Invalid password' + results);
        }
  });
}


  render() {
      let errorCtrl = <View />;
      console.log('state info: ', this.state.success, this.state.badCredentials, this.state.unknownError, this.state.value);

      if (!this.state.success && this.state.badCredentials) {
        errorCtrl = (<Text style={styles.error}>
            Please verify your information and try again!
        </Text>);
      }

      if (!this.state.success && this.state.unknownError) {
        errorCtrl = (<Text style={styles.error}>
            We experienced an unexpected issue, try again!
        </Text>)
      }

    return (
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo}/>
        <Text style={styles.heading}>
          NEAT
        </Text>
        <View style={styles.inputs, styles.inputContainer}>
          <Form
            ref="form"
            type={UpdatePasswordForm}
            options={options}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
          />
        </View>

        <TouchableHighlight style = {styles.button} onPress={this.onUpdatePasswordPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Update
          </Text>
        </TouchableHighlight>
        {errorCtrl}
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

export default UpdatePassword;
