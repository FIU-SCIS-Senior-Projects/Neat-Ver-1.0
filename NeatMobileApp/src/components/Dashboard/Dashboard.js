import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';

import * as Progress from 'react-native-progress';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { ButtonGroup } from 'react-native-elements';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';
import { colors } from '../styles';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  changeColor(progress, numTasks) {
    let color = '';
    if (numTasks === 0 || progress === 'Not Tracking Yet') {
      color = '#595959';
    } else if (progress === 'Significantly Behind') {
      color = '#F44336';
    } else if (progress === 'Considerably Behind') {
      color = '#ffcc00';
    } else if (progress === 'Slightly Behind') {
      color = '#e6e600';
    } else if (progress === 'On Track') {
      color = '#009688';
    }
    return color;
  }
  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  }
  renderRow(rowData) {
    const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
    // let numberOfTaskLeft = 2;
    const smartStatus = rowData['smart status'];

    let progress = rowData.progress; // Math.random();
    if (progress === 0 || rowData.tasks.length === 0) {
      progress = 0.0009;
    }

    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#DDD"
      >
        <View style={{ flexDirection: 'column', paddingTop: 12, paddingBottom: 12, paddingLeft: 10, paddingRight: 10 }}>
          <Text style={{ alignItems: 'flex-start', alignSelf: 'flex-start', fontSize: 14, fontWeight: '300', marginBottom: 4 }}> {rowData.assignmentName}</Text>
          <View style={{ flexDirection: 'row', paddingTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Progress.Circle
                style={{ alignSelf: 'flex-start', justifyContent: 'center' }}
                progress={progress}
                size={55}
                indeterminate={false}
                showsText
                color={this.changeColor(smartStatus, rowData.tasks.length)}
                direction="counter-clockwise"
              />
            </View>

            <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>
                  {(numberOfTaskLeft > 0) ? `${numberOfTaskLeft}  ` : null}
                </Text>
                <FontAwesome
                  name="puzzle-piece"
                  size={35}
                  color="#32C0B2"
                />
              </View>
              {rowData.tasks.length === 0 ? <Text>No Tasks</Text> : <Text>Open Tasks</Text>}
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end', alignSelf: 'center' }}>
              <Text style={{ fontSize: 18 }}>
                Due
              </Text>
              <Text>
                {moment().isAfter(rowData.dueDate)
                  ? 'Past Due' : `${moment(rowData.dueDate).fromNow()}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  render() {
    const buttons = ['Current', 'Completed'];
    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.props.onFilterPress}
          selectedIndex={this.props.selectedIndex}
          buttons={buttons}
          textStyle={{ fontSize: 10 }}
        />
        <Text style={styles.heading}>
          Hello Neat Dev Team!
        </Text>
        <ListView
          dataSource={this.props.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Dashboard.propTypes = {
};

export default Dashboard;
