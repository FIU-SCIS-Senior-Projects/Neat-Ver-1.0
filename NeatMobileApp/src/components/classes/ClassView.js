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
  Image
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

//TODO uses this variable to
var Classes = require('./Classes');
import CONFIG from '../../config';
import AuthService from '../../utilities/AuthService';

class ClassView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

      this.state = {
        dataSource: ds,
        classUrl: props.classUrl,
        authInfo: null,
      };
    }

    componentDidMount(){
      AuthService.getLoginToken((err, authInfo) => {
        this.setState({
          authInfo,
        });
        this.fetchAssignmentsForClass();
      });
    }

    componentWillReceiveProps(){
        this.fetchAssignmentsForClass();
    }

    fetchAssignmentsForClass(){

    return fetch(CONFIG.server.host +'/assignment/', {
      method: 'GET',
      headers: this.state.authInfo.header,
    })
              .then((response) => response.json())
              .then((responseJson) => {
                var display = [];
                var j = 0
                console.log(responseJson);
                for(var i = 0; i < responseJson.length; i++){
                    if(responseJson[i].classFK ===  this.state.classUrl){
                        display[j] = responseJson[i];
                        j++;
                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(display)
                })
              })
              .catch((error) => {
                console.error(error);
              });
    }

    onAddAssignment(){
        this.props.navigator.push({
            id: 'AssignmentForm',
            type: 'Pop',
            passProps:{
                classUrl: this.state.classUrl
            }
        });
    }
    pressDashboard(){
         this.props.navigator.pop({
            id: 'ClassList'
        });
    }
    onPressRow(rowData){
      console.log('on class assignment press', rowData);
        this.props.navigator.push({
            id: 'AssignmentView',
            passProps: {
              assignmentUrl: rowData.url,
              assignmentName: rowData.assignmentName,
              rowData,
            }
        });
    }



    renderRow(rowData){

        return(
        <TouchableHighlight
                onPress={() => this.onPressRow(rowData)}
                underlayColor='#ddd'
              >
            <View style={styles.List}>

                <Text>{rowData.assignmentName}</Text>
            </View>
         </TouchableHighlight>
        )
      }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          title={{
            title: this.props.className,
            tintColor: '#F5FCFF',
          }}
          leftButton={{
            title: <FontAwesome name='chevron-left' size={20} />,
            handler: () => this.pressDashboard(),
            tintColor: '#F5FCFF',
          }}
          rightButton={{
            title: <FontAwesome name='plus' size={25} />,
            handler: () => this.onAddAssignment(),
            tintColor: '#F5FCFF',
          }}
          tintColor='#2194f3'
           />
        <View style={styles.container}>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
        </View>
        </View>
        );
    }
}

module.exports = ClassView;
