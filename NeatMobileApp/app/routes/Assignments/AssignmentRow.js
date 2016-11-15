import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import styles from './styles';

class AssignmentRow extends Component {
  constructor(props) {
    super(props);
  }
  // onPressRow(rowData) {
  //   this.props.navigator.push({
  //     id: 'AssignmentView',
  //     title: rowData.assignmentName,
  //     passProps: {
  //       assignmentUrl: rowData.url,
  //       // title: rowData.assignmentName,
  //       onPress: this.AddPressed,
  //       rightText: '+',
  //     },
  //   });
  // }//TODO: Cannot be here
  changeColor(progress) {
    let color = '';
    if (progress < 0.33) {
      color = '#F44336';
    } else if (progress >= 0.33 && progress < 0.66) {
      color = '#ffcc00';
    } else {
      color = '#009688';
    }
    return color;
  }
  render() {
    console.log('renderRow', this.props.rowData);
    const numberOfTaskLeft = this.props.rowData.tasks.filter((task) => !task.isDone).length;
    const progress = Math.random();
    return (
      <TouchableHighlight
        onPress={this.props.onAssignmentDetailPress}
        // underlayColor="#ddd"
      >

        <View style={{ flexDirection: 'row', borderColor: '#f5fcff', borderBottomWidth: 1 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Progress.Circle
              style={{ alignSelf: 'center', justifyContent: 'center', paddingTop: 5 }}
              progress={progress}
              size={55}
              indeterminate={false}
              showsText
              color={this.changeColor(progress)}
              direction="counter-clockwise"/>
            <Text style={{ alignItems: 'flex-start', alignSelf: 'center', fontSize: 12, fontWeight: '300', paddingTop: 5 }}>{ this.props.rowData.assignmentName}</Text>
          </View>

          <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
            <Text style={{ fontSize: 20 }}>
              {(numberOfTaskLeft > 0) ? numberOfTaskLeft + '  ' : null}
            </Text>
            <Text>Open Task</Text>
            <FontAwesome
              name='puzzle-piece'
              size={50}
              color='#4EC0B2'
              />
          </View>

          <View style={{flex: 1, alignItems: 'center', alignSelf: 'center'}}>
            <Text>
              {moment().isAfter(this.props.rowData.dueDate)
                ? 'Past Due' : 'Due ' + moment(this.props.rowData.dueDate).from(this.props.rowData.startDate)}
            </Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = AssignmentRow;
