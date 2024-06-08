import React from 'react';
import { Button, Col, Divider, List, Menu, Modal, notification, Row, Select } from 'antd';
import './index.less'
import { Code, CommonService, Page, getBodyHeight } from '@swiftease/atali-pkg';
import { CaretDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormDialog, FormLayout } from '@swiftease/formily-antd-v5'
import { funcs, defaultCache } from '@swiftease/atali-form'

interface LeftNavProps {
  fatherService: CommonService<any>
  sonService: CommonService<any>
  grandpaService: CommonService<any>
  onChangeGrandpa: (id: string) => void
  onChangeFather: (id: string) => void
  onChangeSon: (id: string) => void
  createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
  grandpaPageName: string
  grandpaFieldName: string
  grandpaTitle: string
  fatherPageName: string
  fatherFieldName: string
  fatherTitle: string
  sonPageName: string
}
interface LeftNavState {
  grandpaPageConfig: Page
  fatherPageConfig: Page
  grandpaFormSchema: any
  fatherFormSchema: any
  fatherList: any[]
  sonList: any[]
  grandpaList: any[]
  selectedGrandpaID: any
  selectedFatherID: any
  selectedSonID: any
  height: number
}

export class LeftNav extends React.Component<LeftNavProps, LeftNavState> {
  constructor(props: any) {
    super(props);
    //@ts-ignore
    this.state = {
      fatherList: [],
      sonList: [],
      grandpaList: [],
      selectedGrandpaID: '',
      selectedSonID: '',
      selectedFatherID: '',
      height: getBodyHeight() - 60
    }
  }
  async getGrandpaList() {
    let res = await this.props.grandpaService.query({ size: 100 })
    let selectedGrandpaID = this.state.selectedGrandpaID
    if (!selectedGrandpaID && selectedGrandpaID == "" && res?.data && res?.data.length > 0) {
      selectedGrandpaID = res.data[0].id
    }
    this.props.onChangeGrandpa(selectedGrandpaID)
    this.setState({ grandpaList: res?.data ?? [], selectedGrandpaID: selectedGrandpaID })
    return selectedGrandpaID
  }

  async getFatherList(grandpaID: string) {
    if (!grandpaID || grandpaID == '') {
      this.setState({ fatherList: [], selectedFatherID: '' })
      return
    }
    let queryData: any = { size: 100 }
    queryData[this.props.grandpaFieldName] = grandpaID
    let res = await this.props.fatherService.query(queryData)
    let selectedFatherID = ''
    let data: { label: any; key: any; }[] = []
    if (res?.data && res?.data.length > 0) {
      selectedFatherID = res.data[0].id
      res.data.forEach((value) => {
        data.push({
          label: value.name,
          key: value.id
        })
      })
    }
    this.props.onChangeFather(selectedFatherID)
    this.setState({ fatherList: data, selectedFatherID: selectedFatherID })
    return selectedFatherID
  }

  async getSonList(fatherID: string) {
    if (!fatherID || fatherID == '') {
      this.setState({ sonList: [], selectedSonID: '' })
      this.props.onChangeSon('Empty')
      return
    }
    let queryData: any = { size: 100 }
    queryData[this.props.fatherFieldName] = fatherID
    let res = await this.props.sonService.query(queryData)
    let selectedSonID = ''
    let data: { label: any; key: any; }[] = []
    if (res?.data && res?.data.length > 0) {
      selectedSonID = res.data[0].id
      res.data.forEach((value) => {
        data.push({
          label: value.name,
          key: value.id
        })
      })
    }

    this.props.onChangeSon(selectedSonID)
    this.setState({ sonList: data, selectedSonID: selectedSonID })
    return selectedSonID
  }

  resizeFn(self: LeftNav) {
    return () => {
      self.setState({ height: getBodyHeight() - 60 })
    }
  }

  async componentDidMount() {
    window.addEventListener('resize', this.resizeFn(this))
    const grandpaPageConfig = await defaultCache.getPageConfig(this.props.grandpaPageName);
    const fatherPageConfig = await defaultCache.getPageConfig(this.props.fatherPageName);
    let grandpaFormSchema = {
      type: 'object',
      properties: {},
    };
    if (grandpaPageConfig && grandpaPageConfig.data &&
      grandpaPageConfig.data.addFormID && grandpaPageConfig.data.addFormID !== "") {
      const resp = await defaultCache.getFormConfig(grandpaPageConfig.data.addFormID)
      if (resp?.code == 20000) {
        const schema = JSON.parse(resp.data.schema);
        grandpaFormSchema = schema.schema
      }
    }

    let fatherFormSchema = {
      type: 'object',
      properties: {},
    };
    if (fatherPageConfig && fatherPageConfig.data &&
      fatherPageConfig.data.addFormID && fatherPageConfig.data.addFormID !== "") {
      const resp = await defaultCache.getFormConfig(fatherPageConfig.data.addFormID)
      if (resp?.code == 20000) {
        const schema = JSON.parse(resp.data.schema);
        fatherFormSchema = schema.schema
      }
    }

    let selectedGrandpaID = await this.getGrandpaList()
    let selectedFatherID = await this.getFatherList(selectedGrandpaID)
    await this.getSonList(selectedFatherID ?? "")
    this.setState({
      grandpaFormSchema: grandpaFormSchema, fatherFormSchema: fatherFormSchema,
      grandpaPageConfig: grandpaPageConfig.data,
      fatherPageConfig: fatherPageConfig.data,
    })
  }

  showAddDialog(initialValue: any, formSchema: any, pageConfig: any, service: CommonService<any>, success?: () => void) {
    FormDialog({ title: '编辑', width: 1200, maskClosable: false }, () => {
      return (
        <FormLayout labelCol={6} wrapperCol={16}>
          {this.props.createSchemaField && this.props.createSchemaField(formSchema, funcs, false)}
        </FormLayout>
      )
    })
      .open({ initialValues: initialValue }, async (env, values) => {
        console.log(env)
        eval(pageConfig?.submitBefore ?? '')
        let data = { ...values }
        if (pageConfig?.path === "") {
          data = { pageName: pageConfig?.name, data: values }
        }
        const resp = await service?.update(data)
        if (resp.code === Code.Success) {
          eval(pageConfig?.submitAfter ?? '')
          notification.success({ message: "更新成功" })
          success && success()
          return true
        }
        return false
      },true)
      .then((values: any) => {})
  }
  confirmAction(title: string, ok: () => void) {
    Modal.confirm({
      title: title,
      onOk: ok
    })
  }

  render(): React.ReactNode {
    return <div style={{ backgroundColor: 'white', height: this.state.height }}>
      <div style={{ marginBottom: '5px', marginLeft: 10, marginRight: 10 }}>
        <Select
          defaultValue={this.state.selectedGrandpaID}

          suffixIcon={
            <CaretDownOutlined style={{ fontSize: 18, marginTop: 5 }} />
          }
          size='large'
          value={this.state.selectedGrandpaID}
          bordered={false}
          style={{ width: '80%', marginTop: '10px', color: '#3D3D3D', fontSize: 18 }}
          onChange={(value) => {
            if (this.state.selectedGrandpaID !== value) {
              this.setState({ selectedGrandpaID: value }, async () => {
                let selectedFatherID = await this.getFatherList(this.state.selectedGrandpaID)
                await this.getSonList(selectedFatherID ?? "")
                this.props.onChangeGrandpa(value)
              })
            }
          }}
        >
          {this.state.grandpaList.map(item => (
            <Select.Option key={item.id} value={item.id}><img style={{ objectFit: 'fill', width: 40, height: 40 }} src={'/api/core/file/download?id=' + item.logo} /> {item.name}</Select.Option>
          ))}
        </Select>
        <Button type='link' size='small' onClick={
          () => {
            console.log(this.state.selectedGrandpaID)
            const self = this
            self.props.grandpaService.detail(this.state.selectedGrandpaID).then(res => {
              if (res?.code === Code.Success) {
                self.showAddDialog(res.data, self.state.grandpaFormSchema, self.state.grandpaPageConfig, self.props.grandpaService, () => {
                  self.getGrandpaList()
                })
              }
            })
          }
        } icon={<EditOutlined />}></Button>
        <Button type='link' size='small' onClick={
          () => {
            console.log(this.state.selectedGrandpaID)
            const self = this
            this.confirmAction('确认删除' + this.props.grandpaTitle, () => {
              this.props.grandpaService.delete({ id: this.state.selectedGrandpaID }).then(res => {
                if (res?.code === Code.Success) {
                  notification.success({ message: "删除" + this.props.grandpaTitle, description: "删除成功" })
                  self.setState({ selectedGrandpaID: "" }, async () => {
                    let selectedGrandpaID = await self.getGrandpaList()
                    let selectedFatherID = await self.getFatherList(selectedGrandpaID)
                    await self.getSonList(selectedFatherID ?? "")
                  })
                }
              })
            })
          }
        } icon={<DeleteOutlined />}></Button>
      </div>
      <Divider style={{ margin: "0" }} />
      <Row style={{}}>
        <Col span={12}>
          <List className='father-list'
            style={{ flex: "auto", minWidth: 0, height: this.state.height - 52 }}
            dataSource={this.state.fatherList}
            renderItem={item => (
              <List.Item className={item.key === this.state.selectedFatherID ? 'ant-menu-item ant-menu-item-selected' : 'ant-menu-item'} onClick={
                () => {
                  if (this.state.selectedFatherID !== item.key) {
                    this.setState({ selectedFatherID: item.key }, () => {
                      this.getSonList(item.key)
                      this.props.onChangeFather(item.key)
                    })
                  }
                }
              }>
                <a title={item.label} style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginLeft: 5 }}>{item.label}</a>
                <div>
                  <Button size='small' type='link' onClick={
                    () => {
                      const self = this
                      self.props.fatherService.detail(item.key).then(res => {
                        if (res?.code === Code.Success) {
                          self.showAddDialog(res.data, self.state.fatherFormSchema, self.state.fatherPageConfig, self.props.fatherService, () => {
                            self.getFatherList(self.state.selectedGrandpaID)
                          })
                        }
                      })
                    }
                  } icon={<EditOutlined />}></Button>
                  <Button size='small' type='link' onClick={
                    () => {
                      const self = this
                      this.confirmAction('确认删除' + this.props.fatherTitle, () => {
                        this.props.fatherService.delete({ id: item.key }).then(res => {
                          if (res?.code === Code.Success) {
                            notification.success({ message: "删除" + this.props.fatherTitle, description: "删除成功" })
                            self.setState({ selectedFatherID: "" }, () => {
                              self.getFatherList(self.state.selectedGrandpaID)
                            })
                          }
                        })
                      })
                    }
                  } icon={<DeleteOutlined />}></Button>
                </div>
              </List.Item>
            )}
          />

        </Col>
        <Col span={12}>
          <Menu className='son-list'
            style={{ flex: "auto", minWidth: 0, height: this.state.height - 52 }}
            mode="vertical"
            selectedKeys={[this.state.selectedSonID]}
            onClick={(info) => {
              if (this.state.selectedSonID !== info.key) {
                this.setState({ selectedSonID: info.key }, () => {
                  this.props.onChangeSon(info.key)
                })
              }
            }}
            items={this.state.sonList}
          />
        </Col>
      </Row>

    </div>
  }
}