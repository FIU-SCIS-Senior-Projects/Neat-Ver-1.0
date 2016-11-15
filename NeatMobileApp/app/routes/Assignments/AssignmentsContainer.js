import React, { Component } from 'react';
import {
  ListView,
} from 'react-native';
import Assignments from './Assignments';
import Routes from '../../config/routes';
import AuthService from '../../utilities/AuthService';

class AssignmentsContainer extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: ds,
    };
  }
  componentWillMount() {
    this.fetchAssignments();
  }
  fetchAssignments() {
    AuthService.fetchAssignments((error, results) => {
      console.log('assignment fetch', results);
      // if (error) console.log(error);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(results),
      });
    });
  }
  render() {
    return (
      <Assignments
        // onAssignmentDetailPress={() => this.props.navigator.push(Routes.getAssignmentDetailRoute())}
        assignmentList={this.state.dataSource}
      />
    );
  }
}


AssignmentsContainer.propTypes = {
  navigator: React.PropTypes.object,
};

export default AssignmentsContainer;
