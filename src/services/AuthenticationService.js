import Api from './Api'

export default{
    insertTask(credentials){
        return Api().post('/insertTask',credentials);
    },
    getTask(credentials){
        return Api().post('/getTask',credentials);
    },
    doneTask(credentials){
        return Api().post('/doneTask',credentials);
    },
    removeTask(credentials){
        return Api().post('/removeTask',credentials);
    },
    getProfile(){
        return Api().get('/getProfile');
    },
    getInfo(){
        return Api().get('/getInfo');
    },
    updateInfo(credentials){
        return Api().post('/updateInfo',credentials);
    },
    updateProfile(credentials){
        return Api().post('/updateProfile',credentials);
    },
    changePassword(credentials){
        return Api().post('/changePass',credentials)
    }

}