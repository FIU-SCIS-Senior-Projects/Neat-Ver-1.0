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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import ClassForm from './ClassForm';
import ClassView from './ClassView';
import CONFIG from '../../config';
import AuthService from '../../utilities/AuthService';

class Classes extends Component{
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      levels: 0,
      dataSource: ds,
      authInfo: null,
    };
  }

  componentDidMount(){
    this.setState({ levels: (this.props.navigator.getCurrentRoutes(0).length)});
    AuthService.getLoginToken((err, authInfo) => {
      this.setState({
        authInfo,
      });
      this.fetchClasss();
    });
  }
  componentWillReceiveProps() {
    this.fetchClasss();
  }

  fetchClasss(){
    return fetch(CONFIG.server.host + '/class/', {
      method: 'GET',
      headers: this.state.authInfo.header,
    })
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
        console.log('class rowData', rowData);

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
        return(
          <Image source={require('../../assets/img/blurback.jpg')} style={styles.backgroundImage}>
            <View style={styles.container}>
              <NavigationBar
              title={{
                title: 'Classes',
                tintColor: '#F5FCFF',
              }}
                leftButton={(this.state.levels <2)? {title: ''} :{
                  title: <FontAwesome name='chevron-left' size={20} />,
                  handler: () => this.onBackPressed(),
                  tintColor: '#F5FCFF',
              }}
              rightButton={{
                title: <FontAwesome name='plus' size={25} />,
                handler: () => this.onAddPressed(),
                tintColor: '#F5FCFF',
              }}
              tintColor='#2194f3'
            />
              <ListView
                style={{flex: 1, alignSelf: 'stretch'}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                enableEmptySections
              />
            </View>
          </Image>
        );
    }
}


module.exports = Classes;
