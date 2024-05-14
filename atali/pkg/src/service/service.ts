import { getToken } from '../utils/cookies';
import { CommonResponse, GetDetailResponse, QueryResponse } from '../model/common';
import { Code } from '../http';
import { User } from '../model';
export class CommonService<T>{
    uriPrefix?: string
    system: string
    module: string
    request: <T>(options: any) => Promise<T | null>
    constructor(req: <T>(options: any) => Promise<T | null>, prefix?: string, system: string = 'Atali', module: string = 'File') {
        this.uriPrefix = prefix;
        this.system = system;
        this.module = module;
        this.request = req
    }

    queryCurrentUser( options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<User.UserProfile> | null> {
        return this.get<GetDetailResponse<User.UserProfile>>('/api/core/auth/user/profile', undefined, options, headers)
    }

    query(params: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<QueryResponse<T> | null> {
        return this.get<QueryResponse<T>>('/api/' + this.uriPrefix + '/query', params, options, headers)
    }

    add(data: T, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.post<CommonResponse>('/api/' + this.uriPrefix + '/add', data, options, headers)
    }

    update(data: T, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.put<CommonResponse>('/api/' + this.uriPrefix + '/update', data, options, headers)
    }

    delete(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.deleteWithUrl<CommonResponse>('/api/' + this.uriPrefix + '/delete', data, options, headers)
    }

    enable(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.post<CommonResponse>('/api/' + this.uriPrefix + '/enable', data, options, headers)
    }

    all(params?: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<QueryResponse<T> | null> {
        return this.get<QueryResponse<T>>('/api/' + this.uriPrefix + '/all', params, options, headers)
    }
    detail(id: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<T> | null> {
        return this.get<GetDetailResponse<T>>('/api/' + this.uriPrefix + '/detail', { id: id }, options, headers)
    }

    detail2(params: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<T> | null> {
        return this.get<GetDetailResponse<T>>('/api/' + this.uriPrefix + '/detail', params, options, headers)
    }

    tree(params?: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<QueryResponse<T> | null> {
        return this.get<QueryResponse<T>>('/api/' + this.uriPrefix + '/tree', params, options, headers)
    }

    resetPwd(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.post<CommonResponse>('/api/' + this.uriPrefix + '/resetpwd', data, options, headers)
    }

    changePwd(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.post<CommonResponse>('/api/' + this.uriPrefix + '/changepwd', data, options, headers)
    }

    login(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<User.LoginResult | null> {
        return this.post<User.LoginResult>('/api/core/auth/user/login', data, options, headers)
    }

    logout(options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<CommonResponse | null> {
        return this.post<CommonResponse>('/api/core/auth/user/logout', undefined, options, headers)
    }

    getProfile<B>(options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<B> | null> {
        return this.get<GetDetailResponse<B>>('/api/' + this.uriPrefix + '/profile', undefined, options, headers)
    }

    genCode<B>(params: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<B> | null> {
        return this.get<GetDetailResponse<B>>('/api/' + this.uriPrefix + '/code', params, options, headers)
    }

    copy<B>(data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<GetDetailResponse<B> | null> {
        return this.post<GetDetailResponse<B>>('/api/' + this.uriPrefix + '/copy', data, options, headers)
    }

    export(url: string, params: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }) {
        if (!url || url == "") {
            url = '/api/' + this.uriPrefix + '/export'
        }
        this.get<any>(url, params, options, headers).then((res) => {
            if (res.code && res.code != Code.Success) return
            const blob = new Blob([res.blob]);
            const objectURL = URL.createObjectURL(blob);
            let btn = document.createElement('a');
            btn.download = res.fileName;
            btn.href = objectURL;
            btn.click();
            URL.revokeObjectURL(objectURL);
        })
    }

    get<B>(url: string, params?: object | URLSearchParams, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<B | null> {
        return this.do<B>('GET', url, params, undefined, options, headers)
    }

    post<B>(url: string, data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<B | null> {
        return this.do<B>('POST', url, undefined, data, options, headers)
    }

    put<B>(url: string, data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<B | null> {
        return this.do<B>('PUT', url, undefined, data, options, headers)
    }

    deleteWithUrl<B>(url: string, data: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<B | null> {
        return this.do<B>('DELETE', url, undefined, data, options, headers)
    }

    do<B>(method: string, url: string, params?: object | URLSearchParams, data?: any, options?: { [key: string]: any }, headers?: { [key: string]: any }): Promise<B | null> {
        return this.request<B>({
            url: url,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + getToken(),
                'system': this.system,
                'module': this.module,
                ...(headers || {})
            },
            params: params,
            data: data,
            ...(options || {}),
        })
    }
}

