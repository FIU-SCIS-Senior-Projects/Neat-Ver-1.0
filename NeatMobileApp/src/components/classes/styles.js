'use strict'
/*This are the styles for the Assignment view screen*/
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 3,
    marginTop: 20,
    marginLeft: 70,
    marginRight: 70,
    marginBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#FFF',
    borderColor: '#599D95'
  },
  buttonText: {
    fontSize: 18,
    color: 'grey',
    fontWeight: '100'
  },
  List: {
    borderColor: '#599D95',
    borderBottomWidth: 1,
    height: 70,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1
  },
  progress: {
    margin: 10
  },
  circles: {},
  input: {
    height: 50,
    padding: 4,
    borderWidth: 1,
    borderColor: '#48bbec',
    borderRadius: 0
  },
  label: {
    padding: 20,
    fontSize: 25,
    fontWeight: '300',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch'
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: null,
    height: null
  },
  // rowLabel: {   fontSize: 14,   fontWeight: '200',   alignSelf: 'center',
  // justifyContent: 'center',   flexDirection: 'row', },
});

module.exports = styles;
