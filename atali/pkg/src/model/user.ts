import { BaseModel, CommonResponse } from './common';
import { Role } from './role';
import { Menu } from './menu';

export declare namespace User {
  export interface User extends BaseModel {
    userName: string;
    nickname: string;
    avatar: string;
    userRoles: UserRole[];
    idCard: string;
    mobile: string;
    wechatID: string;
    title: string;
    enable: boolean;
    description: string;
    roleIDs: string[];
  }

  export interface UserRole extends BaseModel {
    userID: string;
    roleID: string;
    role?: Role;
  }

  type LoginParams = {
    userName?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  export interface LoginResult extends CommonResponse {
    data: string;
    type?: string;
  }

  export interface UserProfile extends User {
    menus: Menu[];
  }
}
