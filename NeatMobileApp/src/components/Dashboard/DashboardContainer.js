import React, { Component } from 'react';
import {
  View,
  ListView,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import AuthService from '../../utilities/AuthService';
import Dashboard from './Dashboard';
import { colors } from '../styles';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds,
      selectedIndex: 0,
      assignmentList: [],
    };
    this.filterAssignments = this.filterAssignments.bind(this);
  }

  componentDidMount() {
    this.getAssignments();
  }
  componentWillReceiveProps() {
    this.getAssignments();
  }
  onAddPressed() {
    this.props.navigator.push({
      id: 'AssignmentForm',
    });
  }
  getAssignments() {
    AuthService.getAssignments((assignmentList) => {
      const filteredList = this.getCurrentAssignmentList(assignmentList);
      this.setState({
        assignmentList,
        selectedIndex: 0,
        dataSource: this.state.dataSource.cloneWithRows(filteredList),
      });
    });
  }

  getCurrentAssignmentList(assignmentList) {
    return assignmentList.filter((assignment) => {
      return (assignment.tasks.filter((task) => !task.isDone).length) > 0
        || assignment.tasks.length === 0;
    });
  }

  getCompletedAssignmentList(assignmentList) {
    return assignmentList.filter((assignment) => {
      return (assignment.tasks.filter((task) => task.isDone).length) === assignment.tasks.length
        && assignment.tasks.length !== 0;
    });
  }

  filterAssignments(selectedIndex) {
    let func = null;
    if (selectedIndex === 0) func = this.getCurrentAssignmentList;
    else if (selectedIndex === 1) func = this.getCompletedAssignmentList;
    const list = func(this.state.assignmentList);
    this.setState({
      selectedIndex,
      dataSource: this.state.dataSource.cloneWithRows(list),
    });
  }

  render() {
    const { selectedIndex } = this.state;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: 'Dashboard',
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <Icon name="ios-add" size={35} />,
            handler: () => this.onAddPressed(),
            tintColor: colors.navBarText,
          }}
          leftButton={{
            title: 'Logout',
            handler: () => AuthService.logout(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <Dashboard
          dataSource={this.state.dataSource}
          onFilterPress={this.filterAssignments}
          selectedIndex={selectedIndex}
          onAddPressed={() => this.onAddPressed()}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

DashboardContainer.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = DashboardContainer;
