import React, { Component } from 'react';
import {
  ListView,
} from 'react-native';
import CONFIG from '../../config/config';
import Classes from './Classes';

class ClassesContainer extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
    };
  }

  componentDidMount() {
    // this.setState({levels: (this.props.navigator.getCurrentRoutes(0).length)})
    this.fetchClasss();
  }
  componentWillReceiveProps() {
    this.fetchClasss();
  }

  fetchClasss() {
    return fetch(CONFIG.server.host + '/classes/')
          .then((response) => response.json())
          .then((responseJson) => {
            const classList = responseJson;
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(classList),
            });
          })
          .catch((error) => {
            console.error(error);
          });
  }

  render() {
      // console.log('current routes', this.props.navigator.getCurrentRoutes(0));
    return (
      <Classes dataSource={this.state.dataSource}/>
        );
  }
}

module.exports = ClassesContainer;
