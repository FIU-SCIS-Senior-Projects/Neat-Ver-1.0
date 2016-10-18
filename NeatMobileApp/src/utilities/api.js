var api ={
  getUsers(){
    var url = 'http://52.87.176.128/api/user';
    return fetch(url).then((res)=> res.json());
  }
};

module.exports = api;
