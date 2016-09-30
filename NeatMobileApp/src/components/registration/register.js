'use strict'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Text,View,TouchableHighlight,TouchableOpacity,
         TextInput,Image } from 'react-native';
// import styles from './styles';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)

var authService = require('../../utilities/AuthService');

var t = require('tcomb-form-native');
var Form = t.form.Form;

var RegisterForm = t.struct({
  username: t.String,
  email: t.String,
  password: t.String,
  passwordAgain: t.String,
});

var options = {
  auto: 'placeholders',
  fields: {
    email: {
      autoCapitalize: 'none',
      keyboardType: 'email-address',
    },
    username: {
      autoCapitalize: 'none',
      error: 'Enter username'
    },
    password: {
      secureTextEntry: true,
      error: 'Enter password'
    },
    passwordAgain: {
      secureTextEntry: true,
      error: 'Enter password'
    },
  }
}


class Register extends Component {
  constructor(){
    super();

    this.state = {
      value: {

      },
      username: [],
      email: "",
      password: "",
      password_confirmation: "",
      errors: [],
    }
  }
  /*
  Get all users => We are not doing anything with this yet, but it is working,
  you can verify this by opening the debug tools and see the list of users
  */
  onGetPressed(){
    fetch('http://127.0.0.1:8000/restapi/users/')
    .then((response)=>response.json())
    .then((responseData)=>{
      console.log("Response Body ->" + JSON.stringify(responseData))
      this.setState({username: responseData.username});
    })
    .done();
  };

/*
In this function we are using the ES7 way to handle requests by using
promises via an asyncronous function and the await key-word; see
react documentation on Network
*/
async onPUTPressed(){
  try {
    let response = await fetch('http://127.0.0.1:8000/restapi/register/',{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
        })
    });

    let responseJson = await response.text();

    /*
      The above information is all we need to touch our api with a PUT requests
      ad the following to the above code for completion

        }catch (errors){
          console.log("catch errors:" + errors);
      }
      and tht is all the rest of the code is just to identify if we have
      a success or failure; in that case log the error and present it to the
      user.
    */

    //verify if our operation was a success
    if(response.status >= 200 && response.status < 300){
        console.log("response succes is:" + responseJson);
        this.props.navigator.push({
          id: 'StudentDashboard'
        });
        console.log('you have pushe the login button')
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

onRegisterPressed(){
  this.setState({showProgess: true});
  var value = this.refs.form.getValue();

  authService.register(value, (results)=> {
      // this.setState(Object.assign({
      //     showProgress: false
      // }, results));
      if(results.success){
        this.props.navigator.pop();
        console.log('you have register in');
        this.setState({value: null})
      }
  });
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
            type={RegisterForm}
            options={options}
            value={this.state.value}
            onChange={(value) => this.setState({value})}
          />
        </View>
        <TouchableHighlight style = {styles.button} onPress={this.onRegisterPressed.bind(this)} >
          <Text style = {styles.buttonText}>
            Register
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

export default Register;
