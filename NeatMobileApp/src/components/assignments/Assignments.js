import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  NavigatorIOS,
  ListView
} from 'react-native';

import styles from './styles';
import * as Progress from 'react-native-progress';

var AssignmentForm = require('./AssignmentForm');

class Assignments extends Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
          dataSource: ds.cloneWithRows([
            'Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4'
          ]),

          progress: 0.20,
          indeterminate: false,
        };
      }

    render(){
        return(
            <View>
                <ListView style={{ paddingBottom: 150}}
                    dataSource={this.state.dataSource}
                    renderRow={
                        (rowData) =>
                            <View style={styles.circles}>
                            <Text style={styles.List}>{rowData}</Text>
                            <Progress.Circle
                                style={styles.progress}
                                progress={this.state.progress}
                                indeterminate={this.state.indeterminate}
                                direction="counter-clockwise"
                            />

                        </View>
                    }
                />

                <TouchableHighlight
                    onPress={this.onAddPressed.bind(this)}
                    style={styles.button}>
                    <Text style={{ color: '#ffffff' }}>
                            Add Assignment
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }

    onAddPressed(){
        this.props.navigator.push({
              id: 'AssignmentForm'
            });
    }
}


module.exports = Assignments;