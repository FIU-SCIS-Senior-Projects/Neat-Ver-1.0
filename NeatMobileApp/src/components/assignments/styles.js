/* This are the styles for the Assignment view screen*/
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      // paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
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
    paddingBottom: 10,
    backgroundColor: 'transparent',
    borderColor: '#599D95',
  },
  buttonText: {
    fontSize: 18,
    color: 'grey',
    fontWeight: '100',
  },
  List: {
    // borderColor: '#f5fcff',
    // borderBottomWidth: 1,
    // height: 70,
    // paddingLeft: 10,
    flex: 1,
    // flexDirection: 'row',
    // alignItems: 'stretch',
    //marginBottom: ,
  },
  progress: {
    margin: 10,
  },
  circles: {

  },
  input: {
    height: 50,
    padding: 4,
    borderWidth: 1,
    borderColor: '#48bbec',
    borderRadius: 0,

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', // or 'stretch'
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: null,
    height: null,
  },
  heading: {
    padding: 30,
    textAlign: 'center',
    fontSize: 36,
    color: '#3b3b3b',
    fontWeight: '300',
    alignSelf: 'center',
  },
  label: {
    paddingTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dueInLabel: {
    paddingLeft: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
});

module.exports = styles;
