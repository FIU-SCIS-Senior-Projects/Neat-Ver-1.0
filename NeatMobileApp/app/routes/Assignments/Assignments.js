import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
} from 'react-native';
import AssignmentRow from './AssignmentRow';
import styles from './styles';

class Assignments extends Component {
  constructor(props) {
    super(props);
  }
  renderRow(rowData) {
    return (
      <AssignmentRow
        rowData={rowData}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.heading}>
          Hello Neat Dev Team!
        </Text> */}
        <ListView
          style={{ backgroundColor: 'transparent' }}
          dataSource={this.props.assignmentList}
          renderRow={(rowData) => this.renderRow(rowData)}
          enableEmptySections
        />
      </View>
    );
  }
}

Assignments.propTypes = {
  // onAssignmentDetailPress: React.PropTypes.func,
  // assignmentList: React.PropTypes
  //       .arrayOf(React.PropTypes.object).isRequired,
};

export default Assignments;
