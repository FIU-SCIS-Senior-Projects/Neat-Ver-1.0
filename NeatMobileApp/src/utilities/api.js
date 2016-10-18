var api ={
  getUsers(){
    var url = 'http://localhost:8000/api/user';
    return fetch(url).then((res)=> res.json());
  }
};

module.exports = api;
