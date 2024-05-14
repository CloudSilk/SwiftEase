import { BaseModel, BaseTreeModel } from './common';

export interface Role extends BaseTreeModel<Role> {
  roleMenus: RoleMenu[];
  defaultRouter: string;
  description?: string;
}

export interface RoleMenu extends BaseModel {
  menuID: string;
  roleID: string;
  funcs: string;
}