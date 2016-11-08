import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
  Image
} from 'react-native';

import styles from './styles';
import NavigationBar from 'react-native-navbar';

var ClassForm = require('./ClassForm');
var ClassView = require('./ClassView');
var moment = require('moment'),
    CONFIG = require('../../config.js');

class Classes extends Component{
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
          levels: 0,
          dataSource: ds
        };
      }

      componentDidMount(){
        this.setState({levels: (this.props.navigator.getCurrentRoutes(0).length)})
        this.fetchClasss();
      }
      componentWillReceiveProps(){
        this.fetchClasss();
      }

      fetchClasss(){
        return fetch(CONFIG.server.host + '/class/')
              .then((response) => response.json())
              .then((responseJson) => {

                var classList = responseJson;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(classList)
                })
              })
              .catch((error) => {
                console.error(error);
              });
      }

      onAddPressed(){
        this.props.navigator.push({
            type: 'Pop',
            id: 'ClassForm'
        });
      }
      onBackPressed(){
        this.props.navigator.pop();
      }

      onPressRow(rowData){

        this.props.navigator.push({
            id: 'ClassView',
            passProps: {
                classUrl: rowData.url,
                className: rowData.className
            }
        });
      }


      renderRow(rowData){

        return(
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

    render(){
      // console.log('current routes', this.props.navigator.getCurrentRoutes(0));
        return(
          <Image source={require('../../assets/img/blurback.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
            <NavigationBar
              title={{title: 'Classes'}}
              leftButton={(this.state.levels <2)? {title: ''} :{
                title: 'Back',
                handler: () => this.onBackPressed()
              }}
              rightButton={{
                title: 'Add',
                handler: () => this.onAddPressed()
              }}
              tintColor='#4EC0B2'
               />
                {/* <Text style={styles.label}>Class Dashboard</Text> */}
                  <ListView
                    style={{flex: 1, alignSelf: 'stretch'}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    enableEmptySections= {true}
                  />
                {/* <TouchableHighlight style={styles.button}
                    onPress={this.onAddPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Add Class
                    </Text>
                </TouchableHighlight> */}

                {/* {(this.state.levels < 2) ? null : (<TouchableHighlight style={styles.button}
                    onPress={this.onBackPressed.bind(this)}
                    >
                    <Text style={styles.buttonText}>
                            Back
                    </Text>
                </TouchableHighlight>)} */}
            </View>
          </Image>
        );
    }
}


module.exports = Classes;
