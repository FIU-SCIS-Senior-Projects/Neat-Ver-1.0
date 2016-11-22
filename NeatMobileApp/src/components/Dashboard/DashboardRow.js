import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import styles from './styles';
import { colors } from '../styles';

const DashboardRow = (props) => {
  const rowData = props.rowData;
  const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
  const smartStatus = rowData['smart status'];

  let progress = rowData.progress; // Math.random();
  if (progress === 0 || rowData.tasks.length === 0) {
    progress = 0.0009;
  }

  const changeColor = (rowProgress, numTasks) => {
    let color = '';
    if (numTasks === 0 || rowProgress === 'Not Tracking Yet') {
      color = '#595959';
    } else if (rowProgress === 'Significantly Behind') {
      color = '#F44336';
    } else if (rowProgress === 'Considerably Behind') {
      color = '#ffcc00';
    } else if (rowProgress === 'Slightly Behind') {
      color = '#e6e600';
    } else if (rowProgress === 'On Track') {
      color = '#009688';
    }
    return color;
  };

  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor="#DDD"
    >
      <View style={{ flexDirection: 'column', paddingTop: 12, paddingBottom: 12, paddingLeft: 10, paddingRight: 10 }}>
        <Text style={{ alignItems: 'flex-start', alignSelf: 'flex-start', fontSize: 14, fontWeight: '300', marginBottom: 4 }}> {rowData.name}</Text>
        <View style={{ flexDirection: 'row', paddingTop: 8 }}>
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Progress.Circle
              style={{ alignSelf: 'flex-start', justifyContent: 'center' }}
              progress={progress}
              size={55}
              indeterminate={false}
              showsText
              color={changeColor(smartStatus, rowData.tasks.length)}
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
};
DashboardRow.propTypes = {
  onPress: React.PropTypes.func,
  rowData: React.PropTypes.object,
};

export default DashboardRow;
