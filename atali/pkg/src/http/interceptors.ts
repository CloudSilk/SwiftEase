import { getToken, removeToken } from '../utils/cookies';

export enum Code {
  Success = 20000,
  InternalServerError = 50000,
  BadRequest = 40000,
  Unauthorized = 40001,
  UserNameOrPasswordIsWrong = 41001,
  UserIsNotExist = 41002,
  NoPermission = 41003,
  TokenInvalid = 41004,
  TokenExpired = 41005,
}

export function handleSuccessStatus(redirectToLogin: () => void, code?: number, message?: String, notification?: (description: string, message: string) => void) {
  let result = '';
  let flag = false;
  switch (code) {
    case Code.Success:
      flag = true;
      break;
    case Code.InternalServerError:
      result = '服务端报错:' + message;
      break;
    case Code.BadRequest:
      result = '错误的请求:' + message;
      break;
    case Code.Unauthorized:
      result = '没有权限，请请联系管理员!';
      break;
    case Code.UserNameOrPasswordIsWrong:
      result = '用户名或者密码错误!';
      break;
    case Code.UserIsNotExist:
      result = '用户不存在';
      break;
    case Code.NoPermission:
      result = '没有权限，请请联系管理员!';
      break;
    case Code.TokenExpired:
    case Code.TokenInvalid:
      if (notification)
        notification('登录过期，请重新登录！', '登录过期');
      removeToken();
      if (redirectToLogin)
        redirectToLogin()
      break;
    default:
      result = message !== "" ? (message + '') : '未知错误';
      break;
  }

  if (!flag) {
    if (notification)
      notification(result, '错误提示');
  }
  return flag;
}

export function newResponseInterceptor(redirectToLogin: () => void, notification?: (description: string, message: string) => void) {
  return async (response: Response, options: any) => {
    // 获取Content-Disposition
    const disposition = response.headers.get("Content-Disposition");
    if (disposition) {
      return {
        // 将二进制的数据转为blob对象，这一步是异步的因此使用async/await
        blob: await response.blob(),
        // 处理Content-Disposition，获取header中的文件名
        fileName: decodeURI(disposition.split(";")[1].split("filename=")[1]),
      }
    }
    if (response.status != 200) {
      if (notification) {
        notification(response.statusText, "")
      }
      return
    }
    const resp = await response.json()
    handleSuccessStatus(redirectToLogin, resp.code, resp.message, notification)
    return resp
  }
}

export function initRequestInterceptor(url: string,
  options: any) {
  return {
    url: url,
    options: {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + getToken(),
      },
      ...options
    }
  }
}