import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';
const AdminUserId = 'AdminUserId';
const IsAdmin = "IsAdmin";
const Role = 'role';



export function getToken() {
    return Cookies.get(TokenKey);
};

export function setToken(token) {
    return Cookies.set(TokenKey, token);
};

export function removeToken() {
    return Cookies.remove(TokenKey);
};




export function setAdminUserId(id) {
    return Cookies.set(AdminUserId, id);
};

export function getAdminUserId() {
    return Cookies.get(AdminUserId);
};

export function removeAdminUserId() {
    return Cookies.remove(AdminUserId);
};



export function setIsAdmin(isAdmin) {
    return Cookies.set(IsAdmin, isAdmin);
};

export function getIsAdmin() {
    return Cookies.get(IsAdmin);
};

export function removeIsAdmin() {
    return Cookies.remove(IsAdmin);
};



export function setRole(role) {
    return Cookies.set(Role, role);
};

export function getRole() {
    return Cookies.get(Role);
};

export function removeRole() {
    return Cookies.remove(Role);
};

