'use strict'
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry,StyleSheet,Text,View,TouchableHighlight,TouchableOpacity,
         TextInput,Image } from 'react-native';
import styles from './styles';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Logo from './../../assets/img/Logo_Neat.png';
//const userIcon = (<Icon name="fa-user" size={25} color ={'#900'}/>)


class Register extends Component {
  constructor(){
    super();

    this.state = {
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

  render() {
    return (
      <View style={styles.appContainer}>

          <View style ={styles.titleView}>
              <Text style = {styles.titleText}>
                Registration
              </Text>
          </View>

          <View style={styles.inputContainer}>

              <Text style={styles.texInputImage}> @ </Text>
              <TextInput style={styles.input}
                  onChangeText={(val) => this.setState({email: val})}
                  placeholder="Email"
              />
          </View>

          <View style={styles.inputContainer}>
              <Image style={styles.texInputImage}
               source={require('image!ic_perm_identity')}/>
              <TextInput style={styles.input}
              onChangeText={(val) => this.setState({username: val})}
              placeholder="Username"
              />
          </View>

          <View style={styles.inputContainer}>
              <Image style={styles.texInputImage}
               source={require('image!ic_lock_outline')}/>
              <TextInput style={styles.input}
              onChangeText={(val) => this.setState({password: val})}
              placeholder="Password"
              secureTextEntry={true}
              />
          </View>

          <View style={styles.inputContainer}>
              <Image style={styles.texInputImage}
               source={require('image!ic_lock_outline')}/>
              <TextInput style={styles.input}
              onChangeText={(val) => this.setState({password_confirmation: val})}
              placeholder="Confirm Password"
              secureTextEntry={true}
              />
          </View>

          <View>
              <TouchableOpacity style = {styles.btnContainer}
                onPress={(this.onPUTPressed.bind(this))} >
                <Image source={Logo} style={styles.logo}/>
                <Text style = {styles.buttonText}>Register</Text>
              </TouchableOpacity>
          </View>

          <Errors errors = {this.state.errors}/>

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



  export default Register
