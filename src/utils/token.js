import { AsyncStorage } from 'react-native';

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const server_uri = 'http://sekoykt.ddns.net:1337';
// const server_uri = 'http://192.168.1.42:1337';

var status = function(response) {  
    if (response.status >= 200 && response.status < 300) return Promise.resolve(response)
    return response.text()
        .then((responseText) => {return Promise.reject(responseText)})
        .catch((error) => {return Promise.reject(error)})
}

var statusJSON = function(response) {  
    return response.json()
        .then((responseJSON) => {
            if (responseJSON.status < 200 || responseJSON.status > 300) {return Promise.reject(responseJSON.error_description)}
            if (responseJSON.error) {return Promise.reject(responseJSON.error_description)}
            return Promise.resolve(responseJSON)})
        .catch((error) => {return Promise.reject(error)})
}

var storeToken = function(accessToken, refreshToken) {
    console.log('storeToken: ' + accessToken + ', ' + refreshToken)
    AsyncStorage.setItem(ACCESS_TOKEN, accessToken, (err)=> {
        if (err){
            console.log("an error");
            throw err;
        }
    }).catch((err)=> {
        console.log("error is: " + err);
    });
    AsyncStorage.setItem(REFRESH_TOKEN, refreshToken, (err)=> {
        if (err){
            console.log("an error");
            throw err;
        }
    }).catch((err)=> {
        console.log("error is: " + err);
    });
}

var logout = function() {
    AsyncStorage.removeItem(ACCESS_TOKEN)
    AsyncStorage.removeItem(REFRESH_TOKEN)
}

//If token is verified we will redirect the user to the home page
var verifyRefreshToken = function(token) {
    return new Promise(
        function (resolve, reject) {
            console.log('verifyRefreshToken: ' + token);
            fetch(server_uri + '/oauth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh_token: token,
                    grant_type: 'refresh_token',
                    client_id: 'mobileV1',
                    client_secret: 'abc123456',
                })
            })
            .then(statusJSON)
            .then(function(data) {  
                console.log('Request succeeded with JSON response', data);
                storeToken(data.access_token, data.refresh_token);
                resolve(data);
            })
            .catch((error) => {
                console.log("error response: " + error);
                reject(error);
            })
        }
    )
}

//If token is verified we will redirect the user to the home page
var verifyAccessToken = function (token, action, body = undefined) {
    return new Promise(
        function (resolve, reject) {
            console.log('verifyAccessToken1: ' + token)
            fetch(server_uri + '/api', {
                method: body==undefined ? 'GET' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'action': action
                },
                body: body
            })
            .then(statusJSON)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                console.log("error response: " + error);
                alert('verifyAccessToken error: ' + error)
                reject(error);
            })
        }
    )
}

var authorizationCode = function (phone, code) {
    return new Promise(
        function (resolve, reject) {
            fetch(server_uri + '/oauth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone,
                    code: code,
                    grant_type: 'authorization_code',
                    client_id: 'mobileV1',
                    client_secret: 'abc123456',
                })
            })
            .then(statusJSON)
            .then(function(data) {  
                storeToken(data.access_token, data.refresh_token);
                console.log('authorizationCode storeToken', data.access_token, data.refresh_token);
                resolve('authorizationCode aceppted');
            })
            .catch((error) => {
                console.log("error response: " + error);
                reject(error);
            })
        }
    )
}

var getCode = function (phone) {
    return new Promise(
        function (resolve, reject) {
            fetch(server_uri, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: phone
                })
            })
            .then(status)
            .then(function(data) {  
                console.log('Request succeeded with JSON response', data);
                resolve(data);
            })
            .catch((error) => {
                console.log("error response: " + error);
                reject(error);
            })
        }
    )
}

var getToken = function(nameToken) {
    return new Promise(
        function (resolve, reject) {
            return AsyncStorage.getItem(nameToken)
            .then((token) => {
                if (!token) {
                    reject(new Error(nameToken + " not set"));
                } else {
                    resolve(token);
                }
            })
            .catch((error) => {
                reject(new Error(error));
            })
        }
    )
}

var authentication = function() {
    return getToken(REFRESH_TOKEN)
    .then(verifyRefreshToken)
    .then((result) => { return true })
    .catch((error) => {
        console.log("error refresh token: " + error);
        return false;
    })
}

var getUser = function() {
    return getToken(ACCESS_TOKEN)
    .then((token) => verifyAccessToken(token, 'getUser'))
    .then((result) => { return result })
    .catch((error) => {
        console.log("error access token: " + error);
        throw error;
    })
}

var saveUser = function(user) {
    return getToken(ACCESS_TOKEN)
    .then((token) => verifyAccessToken(token, 'saveUser', JSON.stringify({user: user})))
    .then((result) => { return result })
    .catch((error) => {
        console.log("error access token: " + error);
        throw error;
    })
}

var logout = function() {
    return getToken(ACCESS_TOKEN)
    .then((token) => verifyAccessToken(token, 'logout'))
    .then((result) => { return true; })
    .catch((error) => {
        console.log("error access token: " + error);
        return false;
    })
}

//If token is verified we will redirect the user to the home page
var wsVerifyToken = function (token, action, body = undefined) {
    return new Promise(
        function (resolve, reject) {
            console.log('verifyAccessToken1: ' + token)
            fetch(server_uri + '/api', {
                method: body==undefined ? 'GET' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'action': action
                },
                body: body
            })
            .then(statusJSON)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                console.log("error response: " + error);
                alert('verifyAccessToken error: ' + error)
                reject(error);
            })
        }
    )
}

var wsAuthentication = function() {
    return getToken(REFRESH_TOKEN)
    .then(wsVerifyToken)
    .then((result) => { return true })
    .catch((error) => {
        console.log("error refresh token: " + error);
        return false;
    })
}

exports.authentication = authentication;
exports.getCode = getCode;
exports.logout = logout;
exports.authorizationCode = authorizationCode;
exports.getUser = getUser;
exports.saveUser = saveUser;
exports.getToken = getToken;
exports.logout = logout