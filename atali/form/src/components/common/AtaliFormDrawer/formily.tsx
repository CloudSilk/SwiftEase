import { Button, ButtonProps, Modal } from 'antd'
import React from 'react'
import { ArrayField, Field } from '@formily/core'
import { Code, CommonResponse, CommonService, GetDetailResponse } from '@swiftease/atali-pkg'
import { FormButtonGroup, FormDrawer, FormDialog, FormLayout, Reset, Submit } from '@swiftease/formily-antd-v5'
import { funcs, newService } from '../../../utils'
import { CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, HighlightOutlined, PlaySquareOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {defaultCache}from '../../../utils/index'

interface AtaliFormDrawerProps extends ButtonProps {
  field: Field
  formID?: string
  click: (self: AtaliFormDrawer, index: number) => void
  submit: (self: AtaliFormDrawer, index: number, values: any) => Promise<boolean>
  submitSuccessed: (self: AtaliFormDrawer, field: Field, values: any) => void
  submitFailed: (self: AtaliFormDrawer, field: Field, values: any) => void
  onClose?: (self: AtaliFormDrawer, values: any) => boolean | void
  initFn?: (self: AtaliFormDrawer, values: any) => any
  formWidth?: number
  formHeight?: number
  action: number
  parentPath?: string
  indexPosition: number
  placement: any
  parentFieldName: string
  submitUrl: string
  httpMethod: string
  detailUrl: string
  isArrayTable: boolean
  showIcon: boolean
  showTitle: boolean
  isFormDrawer?: boolean
  formTitle: string
  record: any
}

interface AtaliFormDrawerState {
  formSchema: any
  index: number
  parentField: Field
  serice: CommonService<any>
}

export class AtaliFormDrawer extends React.Component<AtaliFormDrawerProps, AtaliFormDrawerState> {
  constructor(props: AtaliFormDrawerProps) {
    super(props)
  }

  async componentDidMount() {
    const resp = await defaultCache.getFormConfig(this.props.formID ?? '')
    const indexes = this.props.field.indexes as number[]
    let parent: any = undefined
    if (this.props.parentPath && this.props.parentPath !== '')
      parent = this.props.field.form.query(this.props.parentPath).take() as Field
    if (resp.code === Code.Success) {
      const schema = JSON.parse(resp.data.schema);
      this.setState({
        formSchema: schema.schema,
        index: indexes[this.props.indexPosition],
        parentField: parent,
        serice: newService<any>()
      })
    } else {
      this.setState({ index: indexes[this.props.indexPosition], parentField: parent, serice: newService<any>() })
    }
  }

  showForm(self: AtaliFormDrawer, values: any) {
    const options = {
      title: self.props.formTitle,
      width: self.props.formWidth,
      height: self.props.formHeight,
      maskClosable: false,
      placement: self.props.placement,
      onClose: (values: any) => {
        if (!self.props.onClose) return
        return self.props.onClose(self, values)
      },
      footer: <></>
    }
    let dialog: any
    const render = () => {
      const buttons = <FormButtonGroup align="right">
        <Submit
          onSubmit={async (values) => {
            let resp: any = undefined
            if (self.props.submit)
              resp = await self.props.submit(self, self.state.index, values)
            else if (self.props.action === 1)
              resp = await self.addRecord(self, self.state.parentField, values)
            else if (self.props.action === 2)
              resp = await self.updateRecord(self, self.props.field, self.state.index, values)
            if ((resp === true || resp === undefined) && self.props.submitSuccessed) {
              self.props.submitSuccessed(self, self.state.parentField, values)
            } else if (resp === false && self.props.submitFailed) {
              self.props.submitFailed(self, self.state.parentField, values)
            }
            (resp === true || resp === undefined) && !self.props.isFormDrawer && dialog && dialog.close()
          }}
        >
          保存
        </Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
      return (
        <FormLayout labelCol={6} wrapperCol={16}>
          {window['createSchemaField'] && window['createSchemaField'](self.state?.formSchema, funcs, false)}
          {!self.props.isFormDrawer && <FormDialog.Footer>
            {buttons}
          </FormDialog.Footer>}
          {self.props.isFormDrawer && <FormDrawer.Footer>
            {buttons}
          </FormDrawer.Footer>}
        </FormLayout>
      )
    }
    if (self.props.isFormDrawer) {
      FormDrawer(options, render).open({
        initialValues: values,
      })
    } else {
      dialog = FormDialog(options, render)
      dialog.open({
        initialValues: values,
      })
    }

  }

  async updateRecord(self: AtaliFormDrawer, field: Field, index: number, values: any): Promise<boolean> {
    field.value = values
    if (self.props.submitUrl && self.props.submitUrl !== '') {
      var parentID = self.props.field.form?.values?.id
      const data = {
        ...values
      }
      data[self.props.parentFieldName] = parentID
      const resp = await self.submit(self, data)
      if (!resp || resp.code !== Code.Success) return false
    }
    if (this.props.isArrayTable) {
      const parent = field.parent as ArrayField
      parent.value[index] = values
    }

    return true
  }

  async addRecord(self: AtaliFormDrawer, parent: Field, values: any): Promise<boolean> {
    if (self.props.submitUrl && self.props.submitUrl !== '') {
      const resp = await self.submit(self, values)
      if (!resp || resp.code !== Code.Success) return false
      values.id = resp.message
    }
    if (!parent) return true
    if (!parent.value) parent.setValue([])
    parent.value.push(values)
    return true
  }

  async submit(self: AtaliFormDrawer, data: any): Promise<CommonResponse | null> {
    switch (self.props.httpMethod) {
      case "POST":
        return await self.state.serice.post<CommonResponse>(self.props.submitUrl, data)
      case "PUT":
        return self.state.serice.put(self.props.submitUrl, data)
      case "DELETE":
        return self.state.serice.deleteWithUrl(self.props.submitUrl, data)
      case "GET":
        return self.state.serice.get(self.props.submitUrl, data)
    }
    return null
  }

  async deleteRecord(self: AtaliFormDrawer) {
    let id = ''
    if (self.props.isArrayTable) {
      if (!self.state.parentField) return
      let parentValue = self.state.parentField.value

      if (parentValue && parentValue.forEach) {
        id = parentValue[self.state.index].id
      }
    } else {
      id = this.props.field.form?.values?.id
    }

    if (this.props.submitUrl && this.props.submitUrl !== '' && id !== '') {
      const resp = await this.state.serice.deleteWithUrl<CommonResponse>(this.props.submitUrl, { id: id })
      if (resp?.code != Code.Success) {
        return
      }
    }

    if (self.props.isArrayTable) {
      let parentValue = self.state.parentField.value
      if (parentValue && parentValue.forEach) {
        parentValue = parentValue.filter(
          (obj: any) => id !== obj.id
        )
        self.state.parentField.setValue(parentValue)
      }
    } else {
      window.location.reload()
    }
  }

  async copyRecord(self: AtaliFormDrawer) {
    let id = ''
    if (self.props.isArrayTable) {
      if (!self.state.parentField) return
      let parentValue = self.state.parentField.value

      if (parentValue && parentValue.forEach) {
        id = parentValue[self.state.index].id
      }
    } else {
      id = this.props.field.form?.values?.id
    }

    if (this.props.submitUrl && this.props.submitUrl !== '' && id !== '') {
      const resp = await this.state.serice.post<CommonResponse>(this.props.submitUrl, { id: id })
      if (resp?.code != Code.Success) {
        return
      }
    }

    window.location.reload()
  }

  gotoDesigne(self: AtaliFormDrawer) {
    if (!self.state?.parentField) return
    let parentValue = self.state.parentField.value
    let id = ''
    if (parentValue && parentValue.forEach) {
      id = parentValue[self.state.index].id
    }else if(parentValue){
      id=parentValue.id
    }
    if (this.props.submitUrl && this.props.submitUrl !== '' && id !== '') {
      window.open(window.location.origin + this.props.submitUrl + id)
    }
  }

  async getData() {
    if (!this.props.isArrayTable) {
      let data = (this.props.parentPath && this.props.parentPath !== '' ? this.props.field.form.values[this.props.parentPath] : this.props.field.form.values) || {}

      data[this.props.parentFieldName] = this.props.field.form?.values?.id
      return data
    }
    if (this.props.action === 1) {
      var parentID = this.props.field.form?.values?.id
      const data = {}
      data[this.props.parentFieldName] = parentID
      return data
    }

    if (!this.props.parentPath || this.props.parentPath === '') return this.props.field.form.values

    let parentValue = this.state.parentField.value
    if (parentValue && parentValue.forEach)
      parentValue = parentValue[this.state.index]
    if (this.props.detailUrl && this.props.detailUrl !== '') {
      const resp = await this.state.serice.get<GetDetailResponse<any>>(this.props.detailUrl, { id: parentValue.id })
      if (resp?.code == Code.Success) {
        parentValue = resp.data
      }
    }
    return parentValue
  }

  confirmAction(title: string, ok: () => void) {
    Modal.confirm({
      title: title,
      onOk: ok
    })
  }

  async showForm2(self: AtaliFormDrawer, fields: string[]) {
    let data = await this.getData()
    if (this.props.initFn) {
      data = this.props.initFn(this, data)
    }
    var values = this.props.field.form?.values
    if (values) {
      fields.forEach(field => {
        data[field] = values[field]
      })
    }

    this.showForm(this, data)
  }

  render() {
    let icon: any
    if (this.props.showIcon) {
      switch (this.props.action) {
        case 1:
          icon = <PlusOutlined />
          break;
        case 2:
          icon = <EditOutlined />
          break;
        case 3:
          icon = <DeleteOutlined />
          break;
        case 4:
          icon = <SearchOutlined />
        case 5:
          icon = <PlaySquareOutlined />
          break
          break;
        case 6:
          icon = <HighlightOutlined />
          break
        case 7:
          icon = <DownloadOutlined />
          break
        case 8:
          icon = <CopyOutlined />
          break
      }
    }
    return <Button {...this.props}
      icon={icon}
      onClick={async (e) => {
        if (this.props.field.designable) return
        if (this.props.click)
          this.props.click?.(this, this.state.index)
        else {
          if (this.props.action == 1) {
            let data = {}
            if (this.props.initFn) {
              data = this.props.initFn(this, data)
            }
            this.showForm(this, data)
          }
          else if (this.props.action == 2) {
            let data = await this.getData()
            if (this.props.initFn) {
              data = this.props.initFn(this, data)
            }
            this.showForm(this, data)
          }

          else if (this.props.action === 3) {
            this.confirmAction('确认删除', () => {
              this.deleteRecord(this)
            })
          } else if (this.props.action === 6 || this.props.action === 5) {
            this.gotoDesigne(this)
          } else if (this.props.action === 8) {
            this.confirmAction('确定复制?', () => {
              this.copyRecord(this)
            })
          }
        }
      }}>
      {(this.props.showTitle) && <span>{this.props.title}</span>}
    </Button>
  }

}