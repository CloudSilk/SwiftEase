import { Engine } from '@swiftease/designable-core'
import { transformToSchema, transformToTreeNode } from '@swiftease/designable-formily-transformer'
import { message } from 'antd'
import { CommonResponse } from '@swiftease/atali-pkg';
import { Form } from "@swiftease/atali-pkg";
import { newService } from '../../utils'

const formService = newService<Form>('form')

export const saveSchema = (designer: Engine, formID: string, success: () => void) => {
  formService.put<CommonResponse>('/api/form/schema', {
    id: formID,
    schema: JSON.stringify(
      transformToSchema(designer.getCurrentTree())
    )
  }).then((resp: any) => {
    if (resp.code == 20000) {
      message.success('保存成功')
      localStorage.removeItem("form-" + formID)
      success()
    } else {
      message.error(resp.message)
    }
  })
}

export const publishSchema = (success: () => void, designer: Engine, formID: string, version: string, description?: string) => {
  formService.post<CommonResponse>('/api/form/publish', {
    formID: formID,
    version: version,
    description: description,
    schema: JSON.stringify(
      transformToSchema(designer.getCurrentTree())
    )
  }).then((resp: any) => {
    if (resp.code == 20000) {
      message.success('发布成功')
      success()
    } else {
      message.error(resp.message)
    }
  })
}

export const loadInitialSchema = (designer: Engine, formID: string, setFormSchame: (data: Form) => void) => {
  try {
    formService.detail2({ id: formID, containerVersions: true }).then(resp => {
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
