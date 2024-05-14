import {  ButtonProps, Modal, Input,  message } from 'antd'
import React from 'react'
import { ArrayField, Field } from '@formily/core'
import { Code, CommonResponse, CommonService } from '@swiftease/atali-pkg'
import { FormButtonGroup, FormDrawer, FormDialog, FormLayout, Reset, Submit } from '@swiftease/formily-antd-v5'
import { funcs, newService } from '../../../utils'
import {defaultCache}from '../../../utils/index'
import { isEmpty } from '@formily/shared'

interface AtaliSearchProps extends ButtonProps {
  field: Field
  formID?: string
  click: (self: AtaliSearch, index: number) => void
  submit: (self: AtaliSearch, index: number, values: any) => Promise<boolean>
  submitSuccessed: (self: AtaliSearch, field: Field, values: any) => void
  submitFailed: (self: AtaliSearch, field: Field, values: any) => void
  onClose?: (self: AtaliSearch, values: any) => boolean | void
  initFn?: (self: AtaliSearch, values: any) => any
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
  value: any
  multipleChoice: boolean
  idField: string
  labelField1: string
  labelField2: string
}

interface AtaliSearchState {
  formSchema: any
  index: number
  parentField: Field
  serice: CommonService<any>
  selectedRowKeys: React.Key[]
  enums: any[]
  tableData: any
  searchValue: string
}

export class AtaliSearch extends React.Component<AtaliSearchProps, AtaliSearchState> {
  constructor(props: AtaliSearchProps) {
    super(props)
  }

  async componentDidMount() {
    const resp = await defaultCache.getFormConfig(this.props.formID ?? '')
    const indexes = this.props.field.indexes as number[]
    const service1 = newService()
    let value1 =''
    if(this.props.value){
      if(this.props.multipleChoice == false || this.props.multipleChoice == undefined){
        if(typeof (this.props.value) == 'object'){
          let resq1 = await service1.get<any>(this.props.detailUrl,{id:this.props.value[0][this.props.idField]})
          if(!this.props.labelField2){
            value1 = resq1.data[this.props.labelField1]
          }
          else{
            value1 = resq1.data[this.props.labelField1] + resq1.data[this.props.labelField2]
          }
        }
        else if(typeof (this.props.value) == 'number' || typeof (this.props.value) == 'string' ){
          let resq1 = await service1.get<any>(this.props.detailUrl,{id:this.props.value})
          if(!this.props.labelField2){
            value1 = resq1.data[this.props.labelField1]
          }
          else{
            value1 = resq1.data[this.props.labelField1] + resq1.data[this.props.labelField2]
          }
        }
      }
      else if(this.props.multipleChoice == true){
        for(let i =0 ; i<this.props.value.length;i++){
          let resq1 = await service1.get<any>(this.props.detailUrl,{id:this.props.value[i][this.props.idField]})
          if(!this.props.labelField2){
            value1 += resq1.data[this.props.labelField1]+ ' , '
          }
          else {
            value1 += resq1.data[this.props.labelField1] + resq1.data[this.props.labelField2] + ' , '
          }
        }
        value1= value1.substring(0, value1.lastIndexOf(','))
      }
        // fetch(this.props.detailUrl+ this.props.value[0][this.props.idField]).then(resp => resp.json()).then((resq1)=>{
        //   console.log(resq1)
        // })
    }

    let parent: any = undefined
    if (this.props.parentPath && this.props.parentPath !== '')
      parent = this.props.field.form.query(this.props.parentPath).take() as Field
    if (resp.code === Code.Success) {
      const schema = JSON.parse(resp.data.schema);
      this.setState({
        formSchema: schema.schema,
        index: indexes[this.props.indexPosition],
        parentField: parent,
        serice: newService<any>(),
        searchValue: value1 ? value1.toString() : ''
      })
    } else {
      this.setState({ index: indexes[this.props.indexPosition], parentField: parent, serice: newService<any>(), searchValue: this.props.value ? this.props.value.toString() : '' })
    }
  }

  showForm(self: AtaliSearch, values: any) {
    const options = {
      title: self.props.formTitle,
      width: self.props.formWidth,
      height: self.props.formHeight,
      maskClosable: false,
      placement: self.props.placement,
      onClose: (values: any) => {
        if (!self.props.onClose) return
        return self.props.onClose(self, values[0])
      },
      footer: <></>
    }
    let dialog: any

    const render = () => {

      const buttons = 
      <FormButtonGroup align="right">
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
          {/* {querys} */}
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
        values: {...this.props.field.form.props.values, selected: values}
      })
    } else {
      dialog = FormDialog(options, render)
      dialog.open({
        values: {...this.props.field.form.props.values, selected: values}
      })
    }
  }

  async updateRecord(self: AtaliSearch, field: Field, index: number, values: any): Promise<boolean> {
    let arr1 = values.test.filter((item: any)=>{
      return item?.checked == true
    })
    if(this.props.multipleChoice == false){
      if(arr1.length > 1){
        message.error("只可选择一项！！！")
        return false
      }
      else if(arr1.length == 1){
        field.value = arr1[0].id
        if(!this.props.labelField2){
          this.setState({searchValue: arr1[0][this.props.labelField1]})
        }else{
          this.setState({ searchValue: arr1[0][this.props.labelField1]+ arr1[0][this.props.labelField2] })
        }
      }
      else if(arr1.length == 0){
        message.error("请选择一项！！！")
        return false
      }
    }
    else if(this.props.multipleChoice == true){
      let fieldValue = []
      let value1 = ''
      for(let i =0 ; i<arr1.length;i++){
        if(!this.props.labelField2){
          value1 += arr1[i][this.props.labelField1]+ ' , '
        }
        else{
          value1 += arr1[i][this.props.labelField1]+ arr1[i][this.props.labelField2] + ' , '
        }
        // value1 += resq1.data[this.props.labelField1] + resq1.data[this.props.labelField2] + ' , '
        fieldValue.push({ id: arr1[i].id })
      }
      value1= value1.substring(0, value1.lastIndexOf(','))
      field.value = fieldValue
      this.setState({ searchValue: value1 })
    }

    
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

  async addRecord(self: AtaliSearch, parent: Field, values: any): Promise<boolean> {
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

  async submit(self: AtaliSearch, data: any): Promise<CommonResponse | null> {
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

  async deleteRecord(self: AtaliSearch) {
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

  async copyRecord(self: AtaliSearch) {
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

  gotoDesigne(self: AtaliSearch) {
    if (!self.state.parentField) return
    let parentValue = self.state.parentField.value
    let id = ''
    if (parentValue && parentValue.forEach) {
      id = parentValue[self.state.index].id
    }
    if (this.props.submitUrl && this.props.submitUrl !== '' && id !== '') {
      window.open(window.location.origin + this.props.submitUrl + id)
    }
  }

  async getData() {
    // if (!this.props.isArrayTable) {
    //   let data = (this.props.parentPath && this.props.parentPath !== '' ? this.props.field.form.values[this.props.parentPath] : this.props.field.form.values) || {}
    //   data[this.props.parentFieldName] = this.props.field.form?.values?.id
    //   return data
    // }
    // if (this.props.action === 1) {
    //   var parentID = this.props.field.form?.values?.id
    //   const data = {}
    //   data[this.props.parentFieldName] = parentID
    //   return data
    // }

    // if (!this.props.parentPath || this.props.parentPath === '') return this.props.field.form.values

    let parentValue
    // let parentValue = this.state.parentField.value
    // if (parentValue && parentValue.forEach)
    //   parentValue = parentValue[this.state.index]
    if (this.props.detailUrl && this.props.detailUrl !== '') {
      // console.log("获取数据")
      // const resp2 = await this.state.serice.get<any>("/api/mes/mbms/productionline/all")
      // this.setState({ enums: resp2.data })
      // console.log(resp2)
      // const resp1 = await this.state.serice.get<any>(this.props.detailUrl,{code: resp2.data[0]?.code})
      // console.log(resp1)
      // const resp = await this.state.serice.get<GetDetailResponse<any>>(this.props.detailUrl, { id: parentValue.id })
      // console.log(resp)
      // if (resp1?.code == Code.Success) {
      //   parentValue = resp1.data
      //   this.setState(({ tableData: resp1.data }))
      // }
    }
    return parentValue
  }

  confirmAction(title: string, ok: () => void) {
    Modal.confirm({
      title: title,
      onOk: ok
    })
  }

  async showForm2(self: AtaliSearch, fields: string[]) {
    let data: any = await this.getData()
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
    // let icon: any
    // if (this.props.showIcon) {
    //   switch (this.props.action) {
    //     case 1:
    //       icon = <PlusOutlined />
    //       break;
    //     case 2:
    //       icon = <EditOutlined />
    //       break;
    //     case 3:
    //       icon = <DeleteOutlined />
    //       break;
    //     case 4:
    //       icon = <SearchOutlined />
    //     case 5:
    //       icon = <PlaySquareOutlined />
    //       break
    //       break;
    //     case 6:
    //       icon = <HighlightOutlined />
    //       break
    //     case 7:
    //       icon = <DownloadOutlined />
    //       break
    //     case 8:
    //       icon = <CopyOutlined />
    //       break
    //   }
    // }
    // console.log(this.props)
    return (
      <Input.Search  
        value={this.state?.searchValue}
        onSearch={async (e) => {
          if (this.props.field.designable) return
          if (this.props.click)
            this.props.click?.(this, this.state.index)
          else {
            if (this.props.action == 1) {
              let data = {}
              if (this.props.initFn) {
                data = this.props.initFn(this, data)
              }
              this.showForm(this, isEmpty(data) ? this.props.value : data )
            }
            else if (this.props.action == 2) {
              let data = await this.getData()
              // let data1 = this.state.tableData
              if (this.props.initFn) {
                data = this.props.initFn(this, data)
              }
              this.showForm(this, (isEmpty(data) && this.props.value) ? this.props.value : data)
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
        }}
      />
      
    )
  }
}