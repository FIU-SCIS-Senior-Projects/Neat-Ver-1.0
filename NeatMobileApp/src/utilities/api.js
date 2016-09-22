var api ={
  getUsers(){
    var url = 'http://127.0.0.1:8000/restapi/users';
    return fetch(url).then((res)=> res.json());
  }
};

module.exports = api;
