import React from 'react';
import {
  Text,
  View,
  ListView,
} from 'react-native';

import { ButtonGroup } from 'react-native-elements';
import styles from './styles';
import DashboardRow from './DashboardRow';

const Dashboard = (props) => {
  const onPressRow = (rowData) => {
    props.navigator.push({
      id: 'AssignmentView',
      title: rowData.assignmentName,
      passProps: {
        rowData,
      },
    });
  };
  const _renderSeparator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    );
  };
  const renderRow = (rowData) => {
    return (
      <DashboardRow
        rowData={rowData}
        onPress={() => onPressRow(rowData)}
      />
    );
  };
  const buttons = ['Current', 'Completed'];
  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={props.onFilterPress}
        selectedIndex={props.selectedIndex}
        buttons={buttons}
        textStyle={{ fontSize: 10 }}
      />
      <Text style={styles.heading}>
        Hello Neat Dev Team!
      </Text>
      <ListView
        dataSource={props.dataSource}
        renderRow={renderRow}
        renderSeparator={_renderSeparator}
        enableEmptySections
      />
    </View>
  );
};

Dashboard.propTypes = {
  navigator: React.PropTypes.object,
  onFilterPress: React.PropTypes.func,
  selectedIndex: React.PropTypes.number,
  dataSource: React.PropTypes.object,
};

export default Dashboard;
