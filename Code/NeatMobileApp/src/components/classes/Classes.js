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

class Classes extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
      authInfo: null,
    };
  }

  componentDidMount() {
    this.setState({ levels: (this.props.navigator.getCurrentRoutes(0).length) });
    // AuthService.getLoginToken((err, authInfo) => {
    //   this.setState({
    //     authInfo,
    //   });
    this.fetchClasses();
  }
  componentWillReceiveProps() {
    this.fetchClasses();
  }

  onAddPressed() {
    this.props.navigator.push({
      type: 'Pop',
      id: 'ClassForm',
    });
  }
  onBackPressed() {
    this.props.navigator.pop();
  }

  onPressRow(rowData) {
    // console.log('class rowData', rowData);

    this.props.navigator.push({
      id: 'ClassView',
      passProps: {
        classUrl: rowData.url,
        className: rowData.name,
      },
    });
  }

  fetchClasses() {
    AuthService.getClasses((responseJson) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson),
      });
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
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor="#ddd"
      >
        <View style={styles.List}>
          <Text style={styles.rowLabel}>{rowData.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={{
            title: 'Classes',
            tintColor: colors.navBarText,
          }}
          leftButton={(this.state.levels < 2) ? { title: '' } : {
            title: <FontAwesome name="chevron-left" size={20} />,
            handler: () => this.onBackPressed(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <FontAwesome name="plus" size={25} />,
            handler: () => this.onAddPressed(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <ListView
          style={{ flex: 1, alignSelf: 'stretch' }}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Classes.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = Classes;
