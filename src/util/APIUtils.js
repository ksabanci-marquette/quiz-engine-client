import { API_BASE_URL, ACCESS_TOKEN } from '../constants';
import axios from "axios";

export function request(options, headers) {
    let defaultHeaders = {'Content-Type': 'application/json;charset=UTF-8',};
    defaultHeaders = Object.assign(defaultHeaders, headers);

    if (localStorage.getItem(ACCESS_TOKEN)) {
        defaultHeaders['Authorization'] = 'Bearer ' + localStorage.getItem(ACCESS_TOKEN);
    }

    const defaults = {headers: defaultHeaders};
    options = Object.assign({}, defaults, options);
    return axios(options);
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        data: loginRequest
    });
}


export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        data: signupRequest
    });
}

export function resetPassword(passwordResetRequest) {
    return request({
        url: API_BASE_URL + "/auth/reset-password/init",
        method: 'POST',
        data: passwordResetRequest
    });
}

export function changePassword(changePasswordRequest) {
    if (changePasswordRequest.key===undefined)
    {
        return request({
            url: API_BASE_URL + "/auth/change-password-for-me",
            method: 'POST',
            data: changePasswordRequest
        });
    }
    else {
        return request({
            url: API_BASE_URL + "/auth/change-password",
            method: 'POST',
            data: changePasswordRequest
        });
    }
}




export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

/*export function checkHasMembership(username) {
    return request({
        url: API_BASE_URL + "/user/checkMembershipAvailability?username=" + username,
        method: 'GET'
    });
}*/

export function checkHasMembership_(userId) {
    return request({
        url: API_BASE_URL + "/uye/checkMembership?userId=" + userId,
        method: 'GET'
    });
}

export function getApproval(userId) {
    return request({
        url: API_BASE_URL + "/uye/getApprovalStatus?userId=" + userId,
        method: 'GET'
    });
}



export async function checkEmailAvailability(email) {
    let result;
    result=await request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
    return result;
}

export async function checkEmailAvailabilityNotIn(email,recordId) {
    let result;
     result=await request({
        url: API_BASE_URL + "/user/checkEmailAvailabilityNotIn?email=" + email +"&recordId=" +recordId,
        method: 'GET'
    });
     return result;
}

export async function getMemberImage(filePath) {
    let result;
    result=await request({
        url: API_BASE_URL+"/uye/member-image?filePath=" +filePath,
        method: 'get',
    });
    return result;
}

//

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/user/" + username,
        method: 'GET'
    });
}




