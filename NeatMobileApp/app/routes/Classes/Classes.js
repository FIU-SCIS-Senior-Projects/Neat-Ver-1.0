import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  TouchableHighlight,
} from 'react-native';
import styles from './styles';

class Classes extends Component {
  constructor(props) {
    super(props);
  }
  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => this.onPressRow(rowData)}
        underlayColor='#ddd'
      >
      <View style={styles.List}>
        <Text style={styles.rowLabel}>{rowData.className}</Text>
      </View>
     </TouchableHighlight>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={{ flex: 1, alignSelf: 'stretch' }}
          dataSource={this.props.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    );
  }
}

Classes.propTypes = {
};

export default Classes;
