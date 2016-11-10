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
  ListView,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import NavigationBar from 'react-native-navbar';

import styles from './styles';

var Assignments = require('./UserAssignment');
import CONFIG from '../../config';

import AuthService from '../../utilities/AuthService';


class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state={
            dataSource: ds,
            assignmentUrl: props.rowData.url,
            toggleState: true,
            trueSwitchIsOn: true,
        };
    }

    componentDidMount(){
      AuthService.getLoginToken((err, authInfo) => {
        this.setState({
          authInfo,
        });
        // this.fetchTasks();
      });
      if(this.props.rowData.tasks) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.rowData.tasks)
        });
      }
    }
    componentWillReceiveProps(){
        this.fetchTasks();
    }
    fetchTasks(){
        return fetch(CONFIG.server.host + '/dashboard/', {
          method: 'GET',
          headers: this.state.authInfo.header,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          var assignmentList = responseJson;
          var selectedAssignment =
            assignmentList.filter((assignment) => this.props.rowData.pk === assignment.pk)[0];
            console.log('found assignment from filter ', selectedAssignment);
          this.setState({
              dataSource: this.state.dataSource.cloneWithRows(selectedAssignment.tasks)
          })
        })
        .catch((error) => {
          console.error(error);
        });
    }

  onAddTask() {
    this.props.navigator.push({
      id: 'TaskForm',
      type: 'Pop',
      passProps: {
        assignmentUrl: this.props.rowData.url,
      },
    });
    }

    pressDashboard(){
        // let route = this.props.navigator.getCurrentRoutes().find((route) => route.id === 'AssignmentsDash');
        console.log(this.props.navigator.getCurrentRoutes());
        // this.props.navigator.popToRoute(route);
      // this.props.navigator.resetTo(this.props.navigator.getCurrentRoutes()[0]);
      this.props.navigator.pop();
    }
    toogleSwitched(rowData){
        // console.log("rowData before is: " + JSON.stringify(rowData));
        rowData.isDone = !rowData.isDone;
        this.forceUpdate();
        // console.log("rowData is: " + JSON.stringify(rowData));
        console.log('rowData from toggle', rowData);
        fetch(rowData.url, {
              method: 'PUT',
              headers: this.state.authInfo.header,
              body: JSON.stringify({
                // assignment: rowData.assignment,
                // user: rowData.user,
                // taskName: rowData.taskName,
                // isDone: rowData.isDone,
                // hoursPlanned: rowData.hoursPlanned,
                // hoursCompleted: rowData.hoursCompleted,
                // startDate: rowData.startDate,
                // endDate: rowData.endDate,
                ...rowData,
                isDone: rowData.isDone,

              })
        })
        .then((response) => response.json())
        .then((responseData) => console.log("PUT success with response: " + JSON.stringify(responseData)))
        .catch((errpr) => console.error(error));

    }

    async putToogleData(rowData){
    }


    renderRow(rowData){
        // console.log("Before return render, rowData: " + JSON.stringify(rowData));
        return(
               <View style={styles.List}>
                    <Switch
                        onValueChange={() => {this.toogleSwitched(rowData); console.log("clicked on voluechange")}}
                        style={{paddingLeft: 80, marginBottom: 5}}
                        value={rowData.isDone} />
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
               <Text>{rowData.taskName}</Text>
               </View>
            </View>
        );
    }

    render(){
        return(
          <Image source={require('../../assets/img/blurback.jpg')} style={styles.backgroundImage}>
          {/* <Text style={styles.label}>{this.props.rowData.assignmentName}</Text> */}
            <View style={styles.container}>
            <NavigationBar
              title={{title: this.props.rowData.assignmentName}}
              leftButton={{
                title: 'Back',
                handler: () => this.pressDashboard()
              }}
              rightButton={{
                title: 'Add',
                handler: () => this.onAddTask()
              }}
              tintColor='#4EC0B2'
               />
            <ScrollView>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                enableEmptySections= {true}
              />
            </ScrollView>
              {/* <TouchableHighlight style={styles.button}
                  onPress={this.onAddTask.bind(this)}
              >
                  <Text style={styles.buttonText}>
                          Add Task
                  </Text>
              </TouchableHighlight> */}

              {/* <TouchableHighlight style={styles.button}
                  onPress={this.pressDashboard.bind(this)}
              >
                  <Text style={styles.buttonText}>
                          Assignment Dashboard
                  </Text>
              </TouchableHighlight> */}
            </View>
          </Image>
        );
    }
}

module.exports = AssignmentView;
