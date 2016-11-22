import React, { Component } from 'react';
import { Animated, View, TouchableOpacity, Text, TextInput, DatePickerIOS } from 'react-native';
import styles from './styles';

const UIPICKER_HEIGHT = 216;

class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0),
    };
  }

  render() {
    const animationConfig = {
      duration: 200,
    };

    const animation = Animated.timing;
    const height = (this.state.isCollapsed) ? 0 : UIPICKER_HEIGHT;

    return (
      <View>
        <View
          style={{ borderBottomWidth: 1,
            borderColor: '#2194f3' }}
        >
          <TextInput
            style={styles.input}
            onChangeText={this.props.onChangeText}
            placeholder="Assignment Name"
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              animation(this.state.height, Object.assign({
                toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0,
              }, animationConfig)).start();
              this.setState({ isCollapsed: !this.state.isCollapsed });
            }}
          >
            <Text>Due</Text>
          </TouchableOpacity>

          <Animated.View style={{ height: this.state.height, overflow: 'hidden' }}>
            <DatePickerIOS
              date={this.props.dueDate}
              onDateChange={this.props.onDateChange}
              mode="date"
              style={height}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}
Form.propTypes = {
  dueDate: React.PropTypes.date,
  onDateChange: React.PropTypes.func,
  onChangeText: React.PropTypes.func,
};

module.exports = Form;
