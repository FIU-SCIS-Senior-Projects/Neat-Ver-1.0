import React, { Component } from 'react';
import { Animated, View, TouchableOpacity, Text, Picker } from 'react-native';

const UIPICKER_HEIGHT = 216;
const PickerItem = Picker.Item;

class GenericPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0),
    };
  }

// classList
// className
// pickerValue
// onValueChange

  render() {
    const animation = Animated.timing;
    const animationConfig = {
      duration: 200,
    };

    const pickItems = this.props.list.map((listItem, i) => {
      return <PickerItem key={i} value={JSON.stringify(listItem)} label={listItem.name} />;
    });
    return (
      <View>
        <TouchableOpacity
          style={{ borderBottomWidth: 1, borderColor: '#39BD98' }}
          onPress={() => {
            animation(this.state.height, Object.assign({
              toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0,
            }, animationConfig)).start();
            this.setState({ isCollapsed: !this.state.isCollapsed });
          }}
        >
          <Text style={{ fontSize: 23, padding: 5 }}>{this.props.name}</Text>
        </TouchableOpacity>
        <Animated.View style={{ height: this.state.height, overflow: 'hidden' }}>
          <Picker
            selectedValue={this.props.pickerValue}
            onValueChange={this.props.onValueChange}
          >
            {pickItems}

          </Picker>
        </Animated.View>
      </View>
    );
  }
}

GenericPicker.propTypes = {
  onValueChange: React.PropTypes.func,
  pickerValue: React.PropTypes.string,
  name: React.PropTypes.string,
  list: React.PropTypes.array,
};

module.exports = GenericPicker;
