import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import AuthService from '../../utilities/AuthService';
import { colors } from '../styles';

// const Classes = require('./Classes');


class ClassView extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds,
      classUrl: props.classUrl,
      authInfo: null,
    };
  }

  componentDidMount() {
    this.fetchAssignmentsForClass();
  }
  componentWillReceiveProps() {
    this.fetchAssignmentsForClass();
  }
  onAddAssignment() {
    this.props.navigator.push({
      id: 'AssignmentForm',
      type: 'Pop',
      passProps: {
        classUrl: this.state.classUrl,
      },
    });
  }
  onPressRow(rowData) {
    // console.log('on class assignment press', rowData);
    this.props.navigator.push({
      id: 'AssignmentView',
      passProps: {
        assignmentUrl: rowData.url,
        assignmentName: rowData.assignmentName,
        rowData,
      },
    });
  }
  fetchAssignmentsForClass() {
    const that = this;
    AuthService.getAssignmentsForClass((responseJson) => {
      const display = responseJson.filter((assignment) => {
        return assignment.classFK === that.state.classUrl;
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(display),
      });
    });
  }
  pressDashboard() {
    this.props.navigator.pop({
      id: 'ClassList',
    });
  }
  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={styles.List}>

          <Text>{rowData.assignmentName}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <NavigationBar
          title={{
            title: this.props.className,
            tintColor: colors.navBarText,
          }}
          leftButton={{
            title: <FontAwesome name="chevron-left" size={20} />,
            handler: () => this.pressDashboard(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <FontAwesome name="plus" size={25} />,
            handler: () => this.onAddAssignment(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
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

ClassView.propTypes = {
  navigator: React.PropTypes.object,
  className: React.PropTypes.string.isRequired,
  classUrl: React.PropTypes.string.isRequired,
};

module.exports = ClassView;
