import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import CONFIG from '../config';


const authKey = 'auth';
const USERKEY = 'user';

const AuthService = {

  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, USERKEY], (err, val) => {
      if (err) {
        return cb(err);
      }
      if (!val) {
        return cb();
      }
      const zippedObj = _.fromPairs(val);
      // console.log(`zippedObj ${JSON.stringify(zippedObj)}`);
      if (!zippedObj[authKey]) {
        return cb();
      }
      const authInfo = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // Authorization: 'Basic ' + zippedObj[authKey]
        },
        token: JSON.parse(zippedObj[USERKEY]),
      };
      return cb(null, authInfo);
    });
  },

  getLoginToken() {
    const prom = AsyncStorage.getItem(USERKEY);
    return new Promise((resolve, reject) => {
      prom.then((token) => {
        // console.log('===============>', token);
        const authInfo = {
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          token,
        };
        resolve(authInfo);
      })
      .catch((err) => reject(err));
    });
  },

  logout(cb) {
    AsyncStorage.removeItem(USERKEY, (err) => {
      if (err) {
        return cb(err);
      }
      return null;
    });
  },

  handleResponse(response) {
    // console.log('status: ', response);
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw {
        badCredentials: response.status === 400,
        unknownError: response.status !== 400,
        success: false,
      };
    }
  },

  doPost(url, params, type = 'POST') {
    return new Promise((res, rej) => {
      return this.getLoginToken()
        .then((authInfo) => res(authInfo))
        .catch((err) => rej(err));
    }).then((authInfo) => {
      return fetch(url, {
        method: type,
        headers: authInfo.header,
        body: JSON.stringify(params),
      });
    });
  },

  doGet(url) {
    return new Promise((res, rej) => {
      return this.getLoginToken()
        .then((authInfo) => res(authInfo))
        .catch((err) => rej(err));
    }).then((authInfo) => {
      return fetch(url, {
        method: 'GET',
        headers: authInfo.header,
      });
    });
  },

  register(creds, cb) {
      //console.log('creds from register AuthService', creds);

      this.doPost(CONFIG.server.host + '/user/', {
        email     : creds.email,
        first_name: creds.firstname,
        last_name : creds.lastname,
        password  : creds.password,
        groups  : []
      })
      .then(this.handleResponse)
      .then(response =>response.json())
      .then((results)=> {
          console.log('User Registration success');
          cb({success: true});
      })
      .catch(err     => cb(err));
  }//end of register

  getAssignmentProgress(assignmentID){
    var url = CONFIG.server.host + '/collab/assig/' + assignmentID + '/';
    return fetch(url).then((res)=> res.json());
  }

  requestCode(creds, cb) {
      this.doPost(CONFIG.server.host + '/send/passwordCode/' + creds.email +'/', {
        email     : creds.email,
      })
      .then(this.handleResponse)
      .then(response =>response.json())
      .then((results)=> {
        console.log("Request success");
        cb({success: true});
      })
      .catch(err     => cb(err));
}//end of requestCode

changePassword(creds, cb) {
    this.doPost(CONFIG.server.host + '/changePassword/' + creds.code + '/', {
      email     : creds.email,
      password  : creds.newPassword,
    })
    .then(this.handleResponse)
    .then(response =>response.json())
    .then((results)=> {
      console.log("Password update success");
      cb({success: true});
    })
    .catch(err     => cb(err));
}//end of requestCode


  login(creds, cb){
    //var b           = new buffer.Buffer(creds.username + ':' + creds.password);
    //var encodedAuth = b.toString('base64');
    console.log('creds from login AuthService', creds);
    fetch(`${CONFIG.server.host}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: creds.username,
        password: creds.password,
      }),
    })
    .then(this.handleResponse)
    .then((response) => response.json())
    .then((results) => {
      console.log('after handleResponse');
      AsyncStorage.setItem(USERKEY, results.token, (err) => {
        if (err) {
          throw err;
        }
        console.log('i got in');
        return cb({ success: true });
      });
    })
    .catch((err) => cb(err));
  },
  getAssignments(cb) {
    this.doGet(`${CONFIG.server.host}/dashboard/`)
    .then((response) => response.json())
    .then((responseJson) => cb(responseJson))
    .catch((err) => cb(err));
  },
  getTasks(cb) {
    this.doGet(`${CONFIG.server.host}/dashboard/`)
      .then((response) => response.json())
      .then((responseJson) => {
        cb(responseJson);
      })
      .catch((err) => cb(err));
  },
  getClasses(cb) {
    this.doGet(`${CONFIG.server.host}/myClasses/`)
      .then((response) => response.json())
      .then((responseJson) => cb(responseJson))
      .catch((err) => cb(err));
  },
  getAssignmentsForClass(cb) {
    this.doGet(`${CONFIG.server.host}/assignment/`)
    .then((response) => response.json())
    .then((responseJson) => {
      cb(responseJson);
    })
    .catch((err) => cb(err));
  },
  updateTasks(url, params, cb) {
    this.doPost(url, params, 'PUT')
    .then((response) => response.json())
    .then((responseData) => cb(responseData))
    .catch((err) => cb(err));
  },
  addAssignment(params, cb) {
    this.doPost(`${CONFIG.server.host}/assignment/`, params)
    .then(this.handleResponse)
    .then((response) => response.json())
    .then((responseData) => cb({ success: true }))
    .catch((err) => cb(err));
  },
  addTask(params, cb) {
    this.doPost(`${CONFIG.server.host}/task/`, params)
    .then(this.handleResponse)
    .then((response) => response.json())
    .then((responseData) => cb({ success: true }))
    .catch((err) => cb(err));
  },
  addClass(params, cb) {
    this.doPost(`${CONFIG.server.host}/class/`, params)
    .then(this.handleResponse)
    .then((response) => response.json())
    .then((responseData) => cb({ success: true }))
    .catch((err) => cb(err));
  },
  joinAssignment(params, cb) {
    this.doPost(`${CONFIG.server.host}/assignmentRoster/`, params)
    .then(this.handleResponse)
    .then((response) => response.json())
    .then((responseData) => {
      // console.log('==========>', responseData);
      return cb({ success: true })
    })
    .catch((err) => cb(err));
  },
};

export default AuthService;
