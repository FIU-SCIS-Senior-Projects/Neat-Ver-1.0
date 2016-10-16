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
  ListView
} from 'react-native';

import styles from './styles';


class AssignmentView extends Component{

    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state={
            dataSource: ds.cloneWithRows(props.assignment.tasks)
        };
    }
    onAddTask(){
        this.props.navigator.push({
            id: 'TaskForm'
        });
    }

    renderRow(rowData){

        return(
            <View style={styles.List}>
                <Text>{rowData.taskName}</Text>
            </View>
        );
    }

    render(){
        return(
        <View >

            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}
            />

            <TouchableHighlight style={styles.button}
                onPress={this.onAddTask.bind(this)}
            >
                <Text style={styles.buttonText}>
                        Add Task
                </Text>
            </TouchableHighlight>
        </View>
        );
    }
}

module.exports = AssignmentView;
