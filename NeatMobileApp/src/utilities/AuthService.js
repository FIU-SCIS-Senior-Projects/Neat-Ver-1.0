import { AsyncStorage } from 'react-native';
var _ = require('lodash'),
    buffer = require('buffer'),
    CONFIG = require('../config.js');


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
      console.log('zippedObj ' + JSON.stringify(zippedObj));
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

  getLoginToken(cb) {
    AsyncStorage.getItem(userKey, (err, val) => {
      console.log('inside getLoginToken userkey', userKey, 'err:', err, 'val:', val);
      if(err) {
        return cb(err);
      }
      if(!val) {
        return cb();
      }
      var authInfo = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        token: val
      }
      return cb(null, authInfo);
    });
  }

  logout(cb){
    AsyncStorage.removeItem(userKey, (err) => {
      if(err) {
        return cb(err);
      }
      return null;
    })
  }

  handleResponse(response) {
    // console.log('status: ', response);
    if(response.status >= 200 && response.status < 300){
        return response;
    }
    else throw {
        badCredentials : response.status == 400,
        unknownError   : response.status != 400
    }
  }

  doPost(url, params) {
    console.log('url', url, 'params', params);
    return fetch(url, {
      method  : 'POST',
      headers : { 'Content-Type' : 'application/json' },
      body    : JSON.stringify(params)
    });
  }

  doGet(url) {
    return fetch(url, {method  : 'GET'})
  }

  register(creds, cb) {
      console.log('creds from register AuthService', creds);

      this.doPost(CONFIG.server.host + 'api/user/', {
        email     : creds.email,
        first_name: creds.firstname,
        last_name : creds.lastname,
        password  : creds.password,
        groups  : []
      })
      .then(this.handleResponse)
      .then(response =>response.json())
      .then((results)=> {
        return cd({success: true});
      })
      .catch(err     => cb(err));
  }//end of register


  requestCode(creds, cb) {
    //if(!creds){
      //return;
    //}
    //var b           = new buffer.Buffer(creds.username);
    //var encodedAuth = b.toString('base64');
    console.log('creds from requestCode', creds.username);

    this.doGet(CONFIG.server.host + 'api/user/?username='+ creds.username, {
      //username : creds.username,
    })
    .then(this.handleResponse)
    .then(response => response.json())
    .then(console.log(results.body.username))
    .then(results  => cb({success: true}))

    //.then((results)=> {
     // console.log('Api response' + results);
    //  return cd({success: true});
    //})
    .catch(err     => cb(err));
}//end of requestCode




  login(creds, cb){
    var b           = new buffer.Buffer(creds.username + ':' + creds.password);
    var encodedAuth = b.toString('base64');
    console.log('creds from login AuthService', creds);

    this.doPost(CONFIG.server.host + 'api/login/',{
        "username": creds.username,
        "password": creds.password,
      })
    .then(this.handleResponse)
    .then(response => response.json())
    .then((results)=> {
      console.log('after handleResponse');
      AsyncStorage.setItem(userKey, JSON.stringify(results.token), (err)=> {
          if(err){
              throw err;
          }
          console.log('i got in');
          return cb({success: true});
      })
    })
    .catch(err => cb(err));
  }
}

module.exports = new AuthService();
