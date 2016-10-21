var api ={
  getAssignmentProgress(assNum){
    var url = 'http://52.87.176.128//api/collab/assig/' + assNum + '/';
    return fetch(url).then((res)=> res.json());
  }
};

module.exports = api;
