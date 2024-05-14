export interface BaseModel {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  tenantID?: string;
}

export interface BaseTreeModel<T> extends BaseModel {
  parentID?: string;
  idStr?: string;
  children: T[];
  level?: number;
  name: string;
  fullName?: string;
  title?:string;
}

export function SetidStr<T extends BaseTreeModel<T>>(m: T) {
  m.idStr = m.id;
  if (m.children) {
    m.children.forEach((child) => {
      SetidStr(child);
    });
  }
}

export function Recursive<T extends BaseTreeModel<T>>(
  m: T,
  id: string,
): T | undefined {
  if (m.id === id) return m;
  if (!m.children || m.children.length == 0) return undefined;
  for (let i = 0; i < m.children.length; i++) {
    let found = Recursive(m.children[i], id);
    if (found) return found;
  }
  return undefined;
}

export function Recursive2<T extends BaseTreeModel<T>>(
  m: T,
  fn: (t: T) => void,
) {
  if (!m) return;
  fn(m);
  if (!m.children || m.children.length == 0) return;
  m.children.forEach((child) => {
    Recursive2(child, fn);
  });
}

export function RecursiveCall<T extends BaseTreeModel<T>>(
  list: T[],
  fn: (t: T) => void,
) {
  list?.forEach((m) => {
    Recursive2(m, fn);
  });
}

export function RecursiveSetLevel<T extends BaseTreeModel<T>>(
  parentid: string,
  list: T[],
  editData: T,
) {
  for (let i = 0; i < list.length; i++) {
    let found = Recursive(list[i], parentid);
    if (found) {
      editData.level = (found.level ?? 0) + 1;
      break;
    }
  }
}

export interface PageInfo {
  pageIndex: number;
  pageSize: number;
  pages: number;
  records: number;
  total: number;
  current: number;
}

export interface TableInfo<T> {
  pageInfo: PageInfo;
  data: T[];
}

export interface CommonResponse {
  code: number;
  message: string;
}

export interface QueryResponse<T> extends CommonResponse, PageInfo {
  data: T[];
}

export interface GetDetailResponse<T> extends CommonResponse {
  data: T;
}

export interface SearchData {
  name: string;
}
