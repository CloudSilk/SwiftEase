import Cookies from 'js-cookie';

let tokenKey = 'access-token';
export const setTokenKey = (key: string) => {
    tokenKey = key
}
export const getTokenKey=()=>{
    return tokenKey
}
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);

export function base64Decode(str: string) {
    const text = atob(str);
    const length = text.length;
    const uintArray = new Uint8Array(length);
    
    for (let i = 0; i < length; i++) {
      uintArray[i] = text.charCodeAt(i);
    }
  
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(uintArray);
  }

export function parseJwt(token: string) {
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('Token is not a valid JWT');
    }

    const header = JSON.parse(base64Decode(parts[0]));
    const payload = JSON.parse(base64Decode(parts[1]));

    return { header, payload };
}



export function getUserInfo(token: string) {
    const { payload } = parseJwt(token);
    return payload;
}

export function getTenantID(token: string) {
    const { payload } = parseJwt(token);
    return payload.tenantID;
}

export function getUserID(token: string) {
    const { payload } = parseJwt(token);
    return payload.id;
}

export function getUserName(token: string) {
    const { payload } = parseJwt(token);
    return payload.userName;
}
export function getUserGroup(token: string) {
    const { payload } = parseJwt(token);
    return payload.group;
}
export function getNickname(token: string) {
    const { payload } = parseJwt(token);
    return payload.nickname;
}