'use strict'
/*This are the styles for the register view screen*/
import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
      appContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 10
      },
      btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 3,
        marginTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#FFF',
        borderColor: '#599D95',
      },
      buttonText:{
        fontSize: 18,
        color: 'grey',
        fontWeight: '100',
      },
      error: {
        color: 'red',
        paddingTop: 10
      },
      loader: {
        marginTop: 20
      },
      inputContainer: {
        marginTop: 5,
          padding: 10,
          flexDirection: 'row',
      },
      logo: {
        width: 40,
        height: 40,
      },
      titleView:{
        backgroundColor: '#599D95',
        paddingTop: 30,
        paddingBottom: 10,
        flexDirection: 'row'
      },
      titleText:{
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        flex: 1,
        fontWeight: 'bold',
      },
      textInputImage:{
        flex: 4,
      },
      input:{
        flex: 4,
        height: 25,
        marginTop: 1,
        padding: 4,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#599D95',//'#48bbec',
        marginRight: 5,
      }
  });

  module.exports = styles;
