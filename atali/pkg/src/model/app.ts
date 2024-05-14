import { BaseModel } from './common';

export interface APP extends BaseModel {
  props: APPProp[];
  name: string;
  entry: string;
  devEntry: string;
  testEntry: string;
  preEntry: string;
  displayName: string;
  credentials: boolean;
  description?: string;
  activeRule?: string;
  container?: string;
}

export interface APPProp extends BaseModel {
  appID: string;
  key: string;
  value: string;
}
