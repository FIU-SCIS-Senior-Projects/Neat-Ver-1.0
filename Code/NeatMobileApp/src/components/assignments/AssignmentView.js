import React, { Component } from 'react';
import {
  View,
  ListView,
  ScrollView,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import moment from 'moment';
import styles from './styles';
import AuthService from '../../utilities/AuthService';
import { colors } from '../styles';


class AssignmentView extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds,
      assignmentUrl: props.rowData.url,
      toggleState: true,
      trueSwitchIsOn: true,
    };
  }

  componentDidMount() {
    this.fetchTasks();
  }
  componentWillReceiveProps() {
    this.fetchTasks();
  }
  onAddTask() {
    this.props.navigator.push({
      id: 'TaskForm',
      type: 'Pop',
      passProps: {
        assignmentUrl: this.props.rowData.url,
      },
    });
  }
  fetchTasks() {
    AuthService.getTasks((responseJson) => {
      const selectedAssignment =
          responseJson.filter((assignment) => this.props.rowData.pk === assignment.pk)[0];
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(selectedAssignment.tasks),
      });
    });
  }

  pressDashboard() {
    this.props.navigator.pop();
  }
  toogleSwitched(rowData) {
    rowData.isDone = !rowData.isDone;
    const newRowData = Object.assign({}, rowData);

    this.forceUpdate();

    AuthService.updateTasks(rowData.url, newRowData, (responseData) => {
      console.log(`PUT success or err with response: ${JSON.stringify(responseData)}`);
    });
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
    return (
      <View>
        <CheckBox
          // right
          // iconRight
          checkedTitle={rowData.name}
          title={`${rowData.name} - ${moment(rowData.dueDate).fromNow()}`}
          checked={rowData.isDone}
          onPress={() => this.toogleSwitched(rowData)}
          containerStyle={{ backgroundColor: 'white', paddingBottom: 5, borderRadius: 0, borderWidth: 0 }}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: this.props.rowData.assignmentName,
            tintColor: colors.navBarText,
            style: { fontSize: 20, fontWeight: '500' },
          }}
          leftButton={{
            title: <Icon name="ios-arrow-back" size={30} />,
            handler: () => this.pressDashboard(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <Icon name="ios-add" size={35} />,
            handler: () => this.onAddTask(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections
            renderSeparator={this._renderSeparator}
          />
        </ScrollView>
      </View>
    );
  }
}

AssignmentView.propTypes = {
  navigator: React.PropTypes.object,
  rowData: React.PropTypes.object,
};

module.exports = AssignmentView;
