import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  ListView,
  ScrollView,
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var ClassForm = require('./ClassForm');
var ClassView = require('./ClassView');
var moment = require('moment'),
    CONFIG = require('../../config.js');

class Classes extends Component{
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
          dataSource: ds
        };
      }

      componentDidMount(){
        this.fetchClasss();
      }
      componentWillReceiveProps(){
        this.fetchClasss();
      }

      fetchClasss(){
        return fetch(CONFIG.server.host + '/class/')
              .then((response) => response.json())
              .then((responseJson) => {

                var classList = responseJson;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(classList)
                })
              })
              .catch((error) => {
                console.error(error);
              });
      }

      onAddPressed(){
        this.props.navigator.push({
            id: 'ClassForm'
        });
      }
      onBackPressed(){
        this.props.navigator.pop();
      }

      onPressRow(rowData){

        this.props.navigator.push({
            id: 'ClassView',
            passProps: {
                classUrl: rowData.url
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

                <Text>{rowData.className}</Text>
            </View>
         </TouchableHighlight>
        )
      }

    render(){
        return(
            <ScrollView>
                <Text style={{ padding: 20, justifyContent: 'center'}}>Class Dashboard</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections= {true}
                />

                <TouchableHighlight style={styles.button}
                    onPress={this.onAddPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Add Class
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.button}
                    onPress={this.onBackPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Back
                    </Text>
                </TouchableHighlight>
            </ScrollView>
        );
    }
}


module.exports = Classes;
