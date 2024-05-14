import { Code } from ".."
import { GetDetailResponse, QueryResponse, Cell } from "../model"
import { CommonService } from "./service"

const enableCacheKey = "AtaliEnableCache"

export class AtaliCache {
    service: CommonService<any>

    constructor(service: CommonService<any>) {
        this.service = service
    }
    enableCache() {
        localStorage.setItem(enableCacheKey, "true")
    }
    disableCache() {
        localStorage.setItem(enableCacheKey, "false")
    }

    isEnableCache() {
        const enableCache = localStorage.getItem(enableCacheKey)
        return enableCache && enableCache === "true"
    }

    async getPageConfig(name: string) {
        if (name === '') {
            return { code: Code.BadRequest }
        }
        let key = "page-" + name
        let value = !this.isEnableCache() ? false : localStorage.getItem(key)
        if (!value) {
            let resp = await this.service.get<GetDetailResponse<any>>("/api/curd/page/detail/name", { name: name })
            this.isEnableCache() && localStorage.setItem(key, JSON.stringify(resp))
            return resp
        }
        return JSON.parse(value)
    }

    async getFormConfig(id: string) {
        if (id === '') {
            return { code: Code.BadRequest }
        }
        let key = "form-" + id
        let value = !this.isEnableCache() ? false : localStorage.getItem(key)
        if (!value) {
            let resp = await this.service.get("/api/form/detail", { id: id })
            this.isEnableCache() && localStorage.setItem(key, JSON.stringify(resp))
            return resp
        }
        return JSON.parse(value)
    }

    clearLocalStorage() {
        let count = localStorage.length
        const keys = []
        for (let i = 0; i < count; i++) {
            const key = localStorage.key(i)
            if (key && (key.startsWith("page-") || key.startsWith("form-") || key.startsWith("cell-") || key.startsWith("cell-system-"))) {
                keys.push(key)
            }
        }
        keys.forEach((key) => {
            localStorage.removeItem(key)
        })
    }

    async getCellById(id: string) {
        if (id === '') {
            return { code: Code.BadRequest }
        }
        let key = "cell-" + id
        let value = !this.isEnableCache() ? false : localStorage.getItem(key)
        if (!value) {
            let resp = await this.service.get<GetDetailResponse<Cell>>("/api/curd/cell/detail", { id: id })
            this.isEnableCache() && localStorage.setItem(key, JSON.stringify(resp))
            return resp
        }
        return JSON.parse(value)
    }

    async getCellBySystem(system: string) {
        if (system === '') {
            return { code: Code.BadRequest }
        }
        let key = "cell-system-" + system
        let value = !this.isEnableCache() ? false : localStorage.getItem(key)
        if (!value) {
            let resp = await this.service.get<QueryResponse<Cell>>("/api/curd/cell/all", { system: system, pageSize: 100 })
            this.isEnableCache() && localStorage.setItem(key, JSON.stringify(resp))
            return resp
        }
        return JSON.parse(value)
    }
}