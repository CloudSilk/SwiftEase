import { Engine } from '@swiftease/designable-core'
import { transformToSchema, transformToTreeNode } from '@swiftease/designable-formily-transformer'
import { message } from 'antd'
import {  CommonResponse, getToken, BaseModel } from '@swiftease/atali-pkg';
import request from 'umi-request';
import { newService } from '@swiftease/atali-form';

export interface StationAPP extends BaseModel {
  code: string
  enable: boolean
  stationID: string
  name: string
  schema: string
  versions:any[]
  }

const stationAppService = newService<StationAPP>('aiot/station/app')

export const saveSchema = (designer: Engine, appID: string, success: () => void) => {
  request<CommonResponse>('/api/aiot/station/app/schema', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken(),
    },
    data: {
      id: appID,
      schema: JSON.stringify(
        transformToSchema(designer.getCurrentTree())
      )
    }
  }).then(resp => {
    if (resp.code == 20000) {
      message.success('保存成功')
      localStorage.removeItem("stationapp-" + appID)
      success()
    } else {
      message.error(resp.message)
    }
  })
}

export const publishSchema = (success: () => void, designer: Engine, appID: string, version: string, description?: string) => {
  request<CommonResponse>('/api/aiot/station/app/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken(),
    },
    data: {
      appID: appID,
      version: version,
      description: description,
      schema: JSON.stringify(
        transformToSchema(designer.getCurrentTree())
      )
    }
  }).then(resp => {
    if (resp.code == 20000) {
      message.success('发布成功')
      success()
    } else {
      message.error(resp.message)
    }
  })
}

export const loadInitialSchema = (designer: Engine, appID: string, setFormSchame: (data: StationAPP) => void) => {
  try {
    stationAppService.detail(appID).then(resp => {
      if (resp?.code != 20000) {
        message.error(resp?.message)
        return
      }
      setFormSchame(resp.data)
      if (resp.data.schema && resp.data.schema !== "") {
        designer.setCurrentTree(
          transformToTreeNode(JSON.parse(resp.data.schema))
        )
      }
    })

  } catch { }
}
