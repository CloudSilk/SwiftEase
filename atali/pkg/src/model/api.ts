import { BaseModel } from './common';

export interface API extends BaseModel {
  uri: string;
  group: string;
  method: string;
  description: string;
  enable: boolean;
  //如果不开启权限校验，那么在每个角色都加上casbin rule
  checkAuth: boolean;
}