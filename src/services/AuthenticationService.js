import Api from './Api'

export default {
    logout(credentials) {
        return Api().post('/logout', credentials);
    },
    login(credentials) {
        return Api().post('/login', credentials);
    },
    register(credentials) {
        return Api().post('/register', credentials);
    },
    insertTask(credentials) {
        return Api().post('/insertNewTask', credentials);
    },
    getTask(credentials) {
        return Api().post('/getTask', credentials);
    },
    doneTask(credentials) {
        return Api().post('/doneTask', credentials);
    },
    removeTask(credentials) {
        return Api().post('/removeTask', credentials);
    },
    getProfile() {
        return Api().get('/getProfile');
    },
    getInfo() {
        return Api().get('/getInfo');
    },
    updateInfo(credentials) {
        return Api().post('/updateUserInfo', credentials);
    },
    updateProfile(credentials) {
        return Api().post('/changeProfile', credentials);
    },
    changePassword(credentials) {
        return Api().post('/changePass', credentials)
    }
}
