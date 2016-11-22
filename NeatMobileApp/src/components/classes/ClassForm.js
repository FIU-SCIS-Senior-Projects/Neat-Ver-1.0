import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';
import styles from './styles';
import AuthService from '../../utilities/AuthService';
import CONFIG from '../../config';
import { colors } from '../styles';

/* TODO
change school id to dynamic
*/
// For demo purposes only
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class ClassForm extends Component {
  constructor() {
    super();

    this.state = {
      className: '',
      classID: getRandomInt(100, 200),
      school: `${CONFIG.server.host}/school/1/`,
      authInfo: null,
    };
  }

  componentDidMount() {
    AuthService.getLoginToken((err, authInfo) => {
      this.setState({
        authInfo,
      });
    });
  }
  // POSTS to the api
  async onDonePressed() {
    AuthService.addClass({
      name: this.state.className,
      identifier: this.state.classID,
      school: this.state.school,
    }, (results) => {
      if (results.success) {
        this.props.navigator.pop({
          id: 'ClassList',
        });
      }
    });
  }

  onBackPressed() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View >
        <NavigationBar
          title={{
            title: 'Add a New Class',
            tintColor: colors.navBarText,
          }}
          leftButton={{
            title: <FontAwesome name="times" size={20} />,
            handler: () => this.onBackPressed(),
            tintColor: colors.navBarText,
          }}
          rightButton={{
            title: <FontAwesome name="check" size={25} />,
            handler: () => this.onDonePressed(),
            tintColor: colors.navBarText,
          }}
          tintColor={colors.navBarColor}
        />
        <TextInput
          style={styles.input}
          onChangeText={(val) => this.setState({ className: val })}
          placeholder="Class Name"
        />
      </View>
    );
  }
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i} style={styles.error}>{error}</Text>)}
    </View>
  );
};

ClassForm.propTypes = {
  navigator: React.PropTypes.object,
};

module.exports = ClassForm;
