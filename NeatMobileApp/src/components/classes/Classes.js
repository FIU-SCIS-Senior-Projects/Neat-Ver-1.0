import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Navigator,
  ListView
} from 'react-native';

import styles from './styles';

var ClassForm = require('./ClassForm');
var ClassView = require('./ClassView');

class Classes extends Component{
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
          dataSource: ds,
        };
      }

      componentDidMount(){
        this.fetchClasses();
      }

      
      fetchClasses(){
        return fetch('http://52.87.176.128/api/classes/')
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

      //Dictates the action of add class button. Loads Classform Route
      onAddPressed(){
        this.props.navigator.push({
            id: 'ClassForm'
        });
      }

      //Dictates the action of press on class. Loads Classview Route
      onPressRow(rowData){

      console.log("Class url" + rowData.url)
        this.props.navigator.push({
            id: 'ClassView',
            //Passing the classURL to use later on in creating assingment
            passProps: {
                classUrl: rowData.url
            }
        });
      }

      //Styling using the row data
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
            <View>
                <Text style={{ padding: 20, justifyContent: 'center'}}>Class Dashboard</Text>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />

                <TouchableHighlight style={styles.button}
                    onPress={this.onAddPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Add Class
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}


module.exports = Classes;
