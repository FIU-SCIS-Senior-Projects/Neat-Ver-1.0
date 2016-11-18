import React, { PropTypes, Component } from 'react';
import { Animated, View, TouchableOpacity, Text, Picker } from 'react-native';
// import AuthService from '../utilities/AuthService';

const UIPICKER_HEIGHT = 216;
const PickerItem = Picker.Item;

class GenericPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      height: new Animated.Value(0),
      //dataSource: [],
      //className: 'Select Class',
      //pickerValue: 'Select Class',
    };
  }
  // componentDidMount() {
  //   this.fetchClasses();
  // }
  //
  // componentWillReceiveProps() {
  //   this.fetchClasses();
  // }
  //
  // onValueChange = (value) => {
  //   const val = JSON.parse(value);
  //
  //   this.setState({
  //     pickerValue: value,
  //     className: val.className,
  //     classFK: val.url,
  //     isCollapsed: true,
  //   });
  //   // console.log('value change ', val.className);
  //   if (val.className === 'CREATE') {
  //     this.props.navigator.push({
  //       type: 'Pop',
  //       id: 'ClassForm',
  //     });
  //   }
  // }

  // fetchClasses() {
  //   AuthService.getClasses((responseJson) => {
  //     const classList = responseJson;
  //     const reduced = {};
  //     classList.map((s) => {
  //       reduced[s.classID] = s.className;
  //     });
  //     this.setState({ dataSource: classList, reducedList: reduced });
  //   });
  // }

// classList
// className
// pickerValue
// onValueChange

  render() {
    const animation = Animated.timing;
    const animationConfig = {
      duration: 200,
    };

    const pickItems = this.props.classList.map((classObj, i) => {
      return <PickerItem key={i} value={JSON.stringify(classObj)} label={classObj.className} />;
    });
    return (
      <View >
        <TouchableOpacity
          onPress={() => {
            animation(this.state.height, Object.assign({
              toValue: (this.state.isCollapsed) ? UIPICKER_HEIGHT : 0,
            }, animationConfig)).start();
            this.setState({ isCollapsed: !this.state.isCollapsed });
          }}
        >
          <Text>{this.props.className}</Text>
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
  }// <PickerItem value={'{"className": "CREATE"}'} label="Add new class" />
}

GenericPicker.propTypes = {
  onValueChange: React.PropTypes.func,
  pickerValue: React.PropTypes.string,
  className: React.PropTypes.string,
  classList: React.PropTypes.array,
};

module.exports = GenericPicker;
