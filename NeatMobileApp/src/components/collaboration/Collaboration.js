'use strict'

import React, { Component } from 'react';
import { View ,Text ,TextInput, TouchableHighlight ,Alert ,StyleSheet,ListView
} from 'react-native';
import _ from 'lodash';
import styles from './styles';
var authService = require('../../utilities/AuthService');
import * as Progress from 'react-native-progress';

class Collaboration extends Component{
constructor(props){
    super(props);
    this.state={
      assignmentUrl: this.props.assignmentUrl,
      assignmentProgress: 0.0,
      indeterminate: false,
      datasource: new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 != r2}),
    }
}//End of constructor

//Before this commponent mount we will reach to the api to get our data.
componentWillMount() {
  this.getAssignmentProgress();
}

sortAssignmetProgress(){
    response.sort(function (b, a) {
          if (a.percentage > b.percentage) {return 1;}
          if (a.percentage < b.percentage) {return -1;}
          // a must be equal to b
          return 0;
      })
}
   getAssignmentProgress(){
       //split the url coming from the assignment dashboard to get the id.
       var id = this.state.assignmentUrl.split("/");
       AuthService.getAssignmentProgress(id[5]).then((response) =>{
           const sortedProgress = this.sortAssignmetProgress(response);
           this.setState({
               datasource: this.state.datasource.cloneWithRows(sortedProgress)
            })//End of setState
        });//End of getAssignmentProgress
   }//End of getAssigmentProgress

    render(){
        console.log("AssigmentID: ", this.state.assignmentUrl);
        return(
         <View style={styles.container}>
             <TouchableHighlight style={styles.button}
             onPress={() => this._onAssignmentDashPress()}>
                 <Text style={styles.buttonText}>Assignment Dashboard</Text>
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
         if(percentage<0.25)    {return '#EF5350'
       }else if(percentage<0.50){return '#FFD54F'
       }else if(percentage<0.75){return '#42A5F5'
       }else                    {return '#599D95'
       }                         return 'white'
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
                </View>`

                <Progress.Bar progress={assignment.percentage}
                    width={300}
                    height={10}
                    color ={this._renderCollor(assignment.percentage)}/>
            </View>
        )
    }//End of _renderClassRow

  }//End of Collaboration_new

      module.exports = Collaboration;
