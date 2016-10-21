var api ={
  getAssignmentProgress(assNum){
    var url = 'http://52.87.176.128//api/collab/assig/' + assNum + '/';
    return fetch(url).then((res)=> res.json());
    }

  getUsers(){
    var url = 'http://127.0.0.1:8000/rest/users';
    return fetch(url).then((res)=> res.json());
  }
};

module.exports = api;
