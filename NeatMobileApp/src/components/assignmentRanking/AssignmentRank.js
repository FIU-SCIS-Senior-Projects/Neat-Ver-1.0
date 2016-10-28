'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet,ListView
} from 'react-native';
import _ from 'lodash';
var authService = require('../../utilities/AuthService');
import * as Progress from 'react-native-progress';
var Assignments = require('../assignments/UserAssignment');
//import api from './../../utilities/api';
//This is only used to test the list, it has to be removed later
const userClasses =[
    {
    className: "Calculus I",
     assignments: [
         "homework I",
         "class project I"]
     },
    {  className: "Physics 2",
     assignments: [
         "homework 3",
         "class project 4"]
     },
    {  className: "Programming III",
     assignments: [
         "homework 2",
         "project I"]
     },
]
//This is only used to test the list, it has to be removed later
const assignmentProgress =[
  {
   "name":"Nelson",
   "perc":0.9
  },
  {
    "name":"sailen",
    "perc":0.8
  },
  {
   "name":"Nilda",
   "perc":0.65
  },
  {
    "name":"Carlos",
    "perc":0.5
  },
  {
   "name":"John",
   "perc":0.5
  },
  {
    "name":"Ruben",
    "perc":0.4
  }
]


class AssignmentRank extends Component{
  constructor(props){
    super(props);

    this.state={
      assignmentUrl: this.props.assignmentUrl,
      assignmentProgress: 0.0,
      indeterminate: false,
      datasource: new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 != r2}),
    }
  }

 //Before this commponent mount we will reach to the api to get our data.
    componentWillMount(){
        var id = this.state.assignmentUrl.split("/");
        authService.getAssignmentProgress(id[5]).then((response) =>{
            this.setState({
                datasource: this.state.datasource.cloneWithRows(
    /*
    response.sort(function(a, b) {
        return a.percentage.localeCompare(b.percentage));
    }


    response.sort(function(a, b) {
    return a.percentage.localeCompare(b.percentage));
    }
    */
                    response.sort(function (b, a) {
                          if (a.percentage > b.percentage) {
                            return 1;
                          }
                          if (a.percentage < b.percentage) {
                            return -1;
                          }
                          // a must be equal to b
                          return 0;
                    })

                )
            })
        });
    }

  render(){
      console.log("AssigmentID: ", this.state.assignmentUrl);
    return(
        <View style={styles.container}>
        <TouchableHighlight style={styles.button}
        onPress={() => this._onAssignmentDashPress()}
        >
            <Text style={styles.buttonText}>
                    Assignment Dashboard
            </Text>
        </TouchableHighlight>
            <ListView
                style = {styles.listRow}
                dataSource = {this.state.datasource}
                renderRow = {(assignment) => {
                    return this._renderClassRow(assignment)
                }}
                renderSeparator={(sectionId, rowId) =>
                    <View key={rowId} style={styles.separator} />}
            />
        </View>
    )
  }

  _renderCollor(percentage){
      if(percentage<0.25){
        return '#EF5350'
    }else if(percentage<0.50){
        return '#FFD54F'
    }else if(percentage<0.75){
        return '#42A5F5'
    }else{
        return '#599D95'
    }
    return 'white'
}

  _onAssignmentDashPress(){
      this.props.navigator.pop();
    }

  _renderClassRow(assignment){
      return(
          <View style={styles.assignmentRow}>
            <View style = {styles.nameAndPercentageTextContainer}>
                <Text style = {styles.rowStudentName}>
                    {assignment.name}
                </Text>

                <Text style = {styles.rowPercentageCompletion}>
                    {(assignment.percentage * 100) + "%"}
                </Text>
            </View>
            <Progress.Bar progress={assignment.percentage}
                          width={300}
                          height={10}
                          color ={this._renderCollor(assignment.percentage)}/>
          </View>
      )
  }
}

const styles = StyleSheet.create({
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#8E8E8E',
    },
    nameAndPercentageTextContainer:{
        flex: 1,
        flexDirection: 'row',
    },
    rowStudentName:{
        flex:1,
        alignItems: 'flex-start',
        fontSize: 20,
        fontWeight: '200',
        alignSelf: 'center',
    },
    rowPercentageCompletion:{
        alignItems: 'flex-end',
        fontSize: 20,
        fontWeight: '100',
        alignSelf: 'center',
    },
    assignmentRow:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        borderColor: '#599D95',
        paddingBottom: 10,
    },
    assignmentName:{
        borderColor: '#599D95',

    },
    assignmentView:{
        flex: 1,
        borderColor: 'blue',

    },
    container: {
        flex: 1,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10,
        paddingTop:20,
        backgroundColor: '#FFF',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 3,
        marginTop: 20,
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        borderColor: '#599D95',
    },
    buttonText:{
        fontSize: 18,
        color: 'grey',
        fontWeight: '100',
    },
  })

    module.exports = AssignmentRank;
