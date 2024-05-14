import request from 'umi-request';
import { CommonService,AtaliCache } from '@swiftease/atali-pkg';

export function umiRequest<T>(options: any): Promise<any> {
    return request<T>(options.url, options)
}

export function newService<T>(prefix?: string, system: string = 'Atali', module: string = 'File'): CommonService<T> {
    return new CommonService<T>(umiRequest, prefix, system, module)
}

export const defaultService = newService<any>()

export const defaultCache=new AtaliCache(defaultService)