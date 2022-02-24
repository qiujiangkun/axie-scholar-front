import { authHeader } from '../helpers';
import {API_BASE_URL} from "../configs/AppConfig";

const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};
export default userService;

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${API_BASE_URL}/api/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('axie_user', JSON.stringify(user));
            return user;
        }).catch(err=> { throw err; });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('axie_user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${API_BASE_URL}/api/users`, requestOptions).then(handleResponse).catch(err=> { throw err; });
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${API_BASE_URL}/api/users/${id}`, requestOptions).then(handleResponse).catch(err=> { throw err; });
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${API_BASE_URL}/api/users/register`, requestOptions).then(handleResponse).then(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('axie_user', JSON.stringify(user));
        return user;
    }).catch(err=> { throw err; });
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${API_BASE_URL}/api/users/${user.id}`, requestOptions).then(handleResponse).catch(err=> { throw err; });
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${API_BASE_URL}/api/users/${id}`, requestOptions).then(handleResponse).catch(err=> { throw err; });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}