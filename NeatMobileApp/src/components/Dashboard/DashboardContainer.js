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
import Dashboard from './Dashboard';
import { colors } from '../styles';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
      authInfo: null,
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
  onPressRow(rowData) {
    this.props.navigator.push({
      id: 'AssignmentView',
      title: rowData.assignmentName,
      passProps: {
        onPress: this.AddPressed,
        rowData,
      },
    });
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

  // changeColor(progress, numTasks) {
  //   let color = '';
  //   if (numTasks === 0 || progress === 'Not Tracking Yet') {
  //     color = '#595959';
  //   } else if (progress === 'Significantly Behind') {
  //     color = '#F44336';
  //   } else if (progress === 'Considerably Behind') {
  //     color = '#ffcc00';
  //   } else if (progress === 'Slightly Behind') {
  //     color = '#e6e600';
  //   } else if (progress === 'On Track') {
  //     color = '#009688';
  //   }
  //   return color;
  // }

  // _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
  //   return (
  //     <View
  //       key={`${sectionID}-${rowID}`}
  //       style={{
  //         height: adjacentRowHighlighted ? 4 : 1,
  //         backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
  //       }}
  //     />
  //   );
  // }
  // renderRow(rowData) {
  //   const numberOfTaskLeft = rowData.tasks.filter((task) => !task.isDone).length;
  //   // let numberOfTaskLeft = 2;
  //   const smartStatus = rowData['smart status'];
  //   console.log('Assignment');
  //
  //   let progress = rowData.progress; // Math.random();
  //   if (progress === 0 || rowData.tasks.length === 0) {
  //     progress = 0.0009;
  //   }
  //
  //   return (
  //     <TouchableHighlight
  //       onPress={() => this.onPressRow(rowData)}
  //       underlayColor="#DDD"
  //     >
  //       <View style={{ flexDirection: 'column', paddingTop: 12, paddingBottom: 12, paddingLeft: 10, paddingRight: 10 }}>
  //         <Text style={{ alignItems: 'flex-start', alignSelf: 'flex-start', fontSize: 14, fontWeight: '300', marginBottom: 4 }}> {rowData.assignmentName}</Text>
  //         <View style={{ flexDirection: 'row', paddingTop: 8 }}>
  //           <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  //             <Progress.Circle
  //               style={{ alignSelf: 'flex-start', justifyContent: 'center' }}
  //               progress={progress}
  //               size={55}
  //               indeterminate={false}
  //               showsText
  //               color={this.changeColor(smartStatus, rowData.tasks.length)}
  //               direction="counter-clockwise"
  //             />
  //           </View>
  //
  //           <View style={{ flex: 1, alignItems: 'center', alignSelf: 'auto' }}>
  //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //               <Text style={{ fontSize: 20 }}>
  //                 {(numberOfTaskLeft > 0) ? `${numberOfTaskLeft}  ` : null}
  //               </Text>
  //               <FontAwesome
  //                 name="puzzle-piece"
  //                 size={35}
  //                 color="#32C0B2"
  //               />
  //             </View>
  //             {rowData.tasks.length === 0 ? <Text>No Tasks</Text> : <Text>Open Tasks</Text>}
  //           </View>
  //
  //           <View style={{ flex: 1, alignItems: 'flex-end', alignSelf: 'center' }}>
  //             <Text style={{ fontSize: 18 }}>
  //               Due
  //             </Text>
  //             <Text>
  //               {moment().isAfter(rowData.dueDate)
  //                 ? 'Past Due' : `${moment(rowData.dueDate).fromNow()}`}
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableHighlight>
  //   );
  // }
  render() {
    // console.log('current routes', this.props.navigator.getCurrentRoutes(0));
    // const buttons = ['Current', 'Completed'];
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
            // title: <FontAwesome name="sign-out" size={25} />,
            title: 'Logout',
            handler: () => AuthService.logout(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        {/* <ButtonGroup
          onPress={this.filterAssignments}
          selectedIndex={selectedIndex}
          buttons={buttons}
          textStyle={{ fontSize: 10 }}
        />
        <Text style={styles.heading}>
          Hello Neat Dev Team!
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections
        /> */}
        <Dashboard
          dataSource={this.state.dataSource}
          onFilterPress={this.filterAssignments}
          selectedIndex={selectedIndex}
        />
      </View>
    );
  }
}

DashboardContainer.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = DashboardContainer;
