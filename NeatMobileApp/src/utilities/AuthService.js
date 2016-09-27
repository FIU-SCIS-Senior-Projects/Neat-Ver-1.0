import { AsyncStorage } from 'react-native';
var _ = require('lodash');
var buffer = require('buffer');


const authKey = 'auth';
const userKey = 'user';

class AuthService {

  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      if(err) {
        return cb(err);
      }
      if(!val) {
        return cb();
      }
      var zippedObj = _.fromPairs(val);
      if(!zippedObj[authKey]) {
        return cb();
      }
      var authInfo = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
          // Authorization: 'Basic ' + zippedObj[authKey]
        },
        token: JSON.parse(zippedObj[userKey])
      }
      return cb(null, authInfo);
    });
  }
  login(creds, cb){
    // var b = new buffer.Buffer(creds.username +
    //             ':' + creds.password);
    // var encodedAuth = b.toString('base64');

    fetch('http://52.87.176.128/login/',{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": creds.username,
        "password": creds.password
      })
    })
    .then((response)=> {
      console.log(response);
        if(response.status >= 200 && response.status < 300){
            return response;
        }

        throw {
            badCredentials: response.status == 400,
            unknownError: response.status != 401
        }
    })
    .then((response)=> {
        return response.json();
    })
    .then((results)=> {
      AsyncStorage.multiSet([
              // [authKey, encodedAuth],
              // [authKey, this.creds.username] //creds is null at this point
              [userKey, JSON.stringify(results)]
          ], (err)=> {
              if(err){
                  throw err;
              }

              return cb({success: true});
          })
    })
    .catch((err)=> {
        return cb(err);
    });
  }
}

module.exports = new AuthService();
