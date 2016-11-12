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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'
import styles from './styles';
import Assignments from './UserAssignment';
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
        //console.log("rowData before is: " + JSON.stringify(rowData));
        rowData.isDone = !rowData.isDone;
        this.forceUpdate();
        //console.log("rowData is: " + JSON.stringify(rowData));
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
               <CheckBox
                checked={rowData.isDone}
                onPress={() => {this.toogleSwitched(rowData); console.log("clicked on voluechange")}}
                // containerStyle={{paddingLeft: 80, marginBottom: 5}}
              />
                    {/* <Switch
                        onValueChange={() => {this.toogleSwitched(rowData); console.log("clicked on voluechange")}}
                        style={{paddingLeft: 80, marginBottom: 5}}
                        value={rowData.isDone} /> */}
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
               <Text>{rowData.taskName}</Text>
               </View>
            </View>
        );
    }

    render(){
        return(
            <View style={styles.container}>
            <NavigationBar
              title={{
                title: this.props.rowData.assignmentName,
                tintColor: '#F5FCFF',
              }}
              leftButton={{
                title: <FontAwesome name='chevron-left' size={20} />,
                handler: () => this.pressDashboard(),
                tintColor: '#F5FCFF',
              }}
              rightButton={{
                title: <FontAwesome name='plus' size={25} />,
                handler: () => this.onAddTask(),
                tintColor: '#F5FCFF',
              }}
              tintColor='#2194f3'
               />
            <ScrollView>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                enableEmptySections
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
        );
    }
}

module.exports = AssignmentView;
