// @ts-nocheck
import { BaseModel, BaseTreeModel } from './common';
import { API } from './api';

export interface Menu extends BaseTreeModel<Menu> {
  title: string;
  sort: number;
  hidden: boolean;
  icon: string;
  level: number;
  path: string;
  component: string;
  cache: boolean;
  defaultMenu: boolean;
  closeTab: boolean;
  parameters: MenuParameter[];
  menuFuncs: MenuFunc[];
}

export interface MenuParameter extends BaseModel {
  menuID: string;
  type: string;
  key: string;
  value: string;
}

export interface MenuFunc extends BaseModel {
  menuID: string;
  name: string;
  title: string;
  hidden: boolean;
  menuFuncApis: MenuFuncApi[];
  selected?: boolean;
}

export interface MenuFuncApi extends BaseModel {
  menuFuncID: string;
  apiID: string;
  apiInfo: API;
}
