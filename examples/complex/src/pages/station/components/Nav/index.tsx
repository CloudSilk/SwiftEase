import React from 'react';
import { Button, Col, Divider, List, Menu, Modal, notification, Row, Select } from 'antd';
import './index.less'
import { Code, CommonService, Page } from '@swiftease/atali-pkg';
import { CaretDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormDialog, FormLayout } from '@swiftease/formily-antd-v5'
import { funcs, defaultCache } from '@swiftease/atali-form'
import { getHeight } from '../../utils'

interface StationNavProps {
  productionLineService: CommonService<any>
  stationService: CommonService<any>
  factoryService: CommonService<any>
  onChangeFactory: (id: string) => void
  onChangeProductionLine: (id: string) => void
  onChangeStation: (id: string) => void
  createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
}
interface StationNavState {
  factoryPageConfig: Page
  productionLinePC: Page
  factoryFormSchema: any
  plFormSchema: any
  productionLines: any[]
  stations: any[]
  factories: any[]
  selectedFactoryID: any
  selectedProductionLineID: any
  selectedStationID: any
  height: number
}

export default class StationNav extends React.Component<StationNavProps, StationNavState> {
  constructor(props: any) {
    super(props);
    this.state = {
      productionLines: [],
      stations: [],
      factories: [],
      selectedFactoryID: '',
      selectedStationID: '',
      selectedProductionLineID: '',
      height: getHeight()
    }
  }
  async getFactory() {
    let res = await this.props.factoryService.query({ size: 100 })
    let selectedFactoryID = this.state.selectedFactoryID
    if (!selectedFactoryID && selectedFactoryID == "" && res?.data && res?.data.length > 0) {
      selectedFactoryID = res.data[0].id
    }
    this.props.onChangeFactory(selectedFactoryID)
    this.setState({ factories: res?.data ?? [], selectedFactoryID: selectedFactoryID })
    return selectedFactoryID
  }

  async getProductionLines(factoryID: string) {
    if (!factoryID || factoryID == '') {
      this.setState({ productionLines: [], selectedProductionLineID: '' })
      return
    }
    let res = await this.props.productionLineService.query({ factoryID: factoryID, size: 100 })
    let selectedProductionLineID = ''
    let data: { label: any; key: any; }[] = []
    if (res?.data && res?.data.length > 0) {
      selectedProductionLineID = res.data[0].id
      res.data.forEach((value) => {
        data.push({
          label: value.name,
          key: value.id
        })
      })
    }
    this.props.onChangeProductionLine(selectedProductionLineID)
    this.setState({ productionLines: data, selectedProductionLineID: selectedProductionLineID })
    return selectedProductionLineID
  }

  async getStations(productionLineID: string) {
    if (!productionLineID || productionLineID == '') {
      this.setState({ stations: [], selectedStationID: '' })
      this.props.onChangeStation('Empty')
      return
    }
    let res = await this.props.stationService.query({ productionLineID: productionLineID, size: 100 })
    let selectedStationID = ''
    let data: { label: any; key: any; }[] = []
    if (res?.data && res?.data.length > 0) {
      selectedStationID = res.data[0].id
      res.data.forEach((value) => {
        data.push({
          label: value.name,
          key: value.id
        })
      })
    }

    this.props.onChangeStation(selectedStationID)
    this.setState({ stations: data, selectedStationID: selectedStationID })
    return selectedStationID
  }

  resizeFn(self: StationNav) {
    return () => {
      self.setState({ height: getHeight() })
    }
  }

  async componentDidMount() {
    window.addEventListener('resize', this.resizeFn(this))
    const factoryPageConfig = await defaultCache.getPageConfig('Factory');
    const productionLinePC = await defaultCache.getPageConfig('ProductionLine');
    let factoryFormSchema = {
      type: 'object',
      properties: {},
    };
    if (factoryPageConfig && factoryPageConfig.data &&
      factoryPageConfig.data.addFormID && factoryPageConfig.data.addFormID !== "") {
      const resp = await defaultCache.getFormConfig(factoryPageConfig.data.addFormID)
      if (resp?.code == 20000) {
        const schema = JSON.parse(resp.data.schema);
        factoryFormSchema = schema.schema
      }
    }

    let plFormSchema = {
      type: 'object',
      properties: {},
    };
    if (productionLinePC && productionLinePC.data &&
      productionLinePC.data.addFormID && productionLinePC.data.addFormID !== "") {
      const resp = await defaultCache.getFormConfig(productionLinePC.data.addFormID)
      if (resp?.code == 20000) {
        const schema = JSON.parse(resp.data.schema);
        plFormSchema = schema.schema
      }
    }

    let selectedFactoryID = await this.getFactory()
    let selectedProductionLineID = await this.getProductionLines(selectedFactoryID)
    await this.getStations(selectedProductionLineID ?? "")
    this.setState({
      factoryFormSchema, plFormSchema,
      factoryPageConfig: factoryPageConfig.data,
      productionLinePC: productionLinePC.data,
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
      .open({ initialValues: initialValue })
      .then((values: any) => {
        eval(pageConfig?.submitBefore ?? '')
        if (pageConfig?.path != "") {
          service?.update({ pageName: pageConfig?.name, ...values }).then((resp) => {
            eval(pageConfig?.submitAfter ?? '')
            success && success()
          })
        } else {
          service?.update({ pageName: pageConfig?.name, data: values }).then((resp) => {
            eval(pageConfig?.submitAfter ?? '')
            success && success()
          })
        }
      })
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
          defaultValue={this.state.selectedFactoryID}

          suffixIcon={
            <CaretDownOutlined style={{ fontSize: 18, marginTop: 5 }} />
          }
          size='large'
          value={this.state.selectedFactoryID}
          bordered={false}
          style={{ width: '80%', marginTop: '10px', color: '#3D3D3D', fontSize: 18 }}
          onChange={(value) => {
            if (this.state.selectedFactoryID !== value) {
              this.setState({ selectedFactoryID: value }, async () => {
                let selectedProductionLineID = await this.getProductionLines(this.state.selectedFactoryID)
                await this.getStations(selectedProductionLineID ?? "")
                this.props.onChangeFactory(value)
              })
            }
          }}
        >
          {this.state.factories.map(item => (
            <Select.Option key={item.id} value={item.id}><img style={{ objectFit: 'fill', width: 40, height: 40 }} src={'/api/core/file/download?id=' + item.logo} /> {item.name}</Select.Option>
          ))}
        </Select>
        <Button type='link' size='small' onClick={
          () => {
            console.log(this.state.selectedFactoryID)
            const self = this
            self.props.factoryService.detail(this.state.selectedFactoryID).then(res => {
              if (res?.code === Code.Success) {
                self.showAddDialog(res.data, self.state.factoryFormSchema, self.state.factoryPageConfig, self.props.factoryService, () => {
                  self.getFactory()
                })
              }
            })
          }
        } icon={<EditOutlined />}></Button>
        <Button type='link' size='small' onClick={
          () => {
            console.log(this.state.selectedFactoryID)
            const self = this
            this.confirmAction('确认删除工厂', () => {
              this.props.factoryService.delete({ id: this.state.selectedFactoryID }).then(res => {
                if (res?.code === Code.Success) {
                  notification.success({ message: "删除工厂", description: "删除成功" })
                  self.setState({ selectedFactoryID: "" }, async () => {
                    // self.getFactory().then(() => {
                    //   self.getProductionLines(self.state.selectedFactoryID).then(() => {
                    //     self.getStations(self.state.selectedProductionLineID)
                    //   })
                    // })
                    let selectedFactoryID = await self.getFactory()
                    let selectedProductionLineID = await self.getProductionLines(selectedFactoryID)
                    await self.getStations(selectedProductionLineID ?? "")
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
          <List className='production-line'
            style={{ flex: "auto", minWidth: 0, height: this.state.height - 52 }}
            dataSource={this.state.productionLines}
            renderItem={item => (
              <List.Item className={item.key === this.state.selectedProductionLineID ? 'ant-menu-item ant-menu-item-selected' : 'ant-menu-item'} onClick={
                () => {
                  if (this.state.selectedProductionLineID !== item.key) {
                    this.setState({ selectedProductionLineID: item.key }, () => {
                      this.getStations(item.key)
                      this.props.onChangeProductionLine(item.key)
                    })
                  }
                }
              }>
                <a title={item.label} style={{ textOverflow: 'ellipsis', overflow: 'hidden', marginLeft: 5 }}>{item.label}</a>
                <div>
                  <Button size='small' type='link' onClick={
                    () => {
                      const self = this
                      self.props.productionLineService.detail(item.key).then(res => {
                        if (res?.code === Code.Success) {
                          self.showAddDialog(res.data, self.state.plFormSchema, self.state.productionLinePC, self.props.productionLineService, () => {
                            self.getProductionLines(self.state.selectedFactoryID)
                          })
                        }
                      })
                    }
                  } icon={<EditOutlined />}></Button>
                  <Button size='small' type='link' onClick={
                    () => {
                      const self = this
                      this.confirmAction('确认删除产线', () => {
                        this.props.productionLineService.delete({ id: item.key }).then(res => {
                          if (res?.code === Code.Success) {
                            notification.success({ message: "删除产线", description: "删除成功" })
                            self.setState({ selectedProductionLineID: "" }, () => {
                              self.getProductionLines(self.state.selectedFactoryID)
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
          <Menu className='station'
            style={{ flex: "auto", minWidth: 0, height: this.state.height - 52 }}
            mode="vertical"
            selectedKeys={[this.state.selectedStationID]}
            onClick={(info) => {
              if (this.state.selectedStationID !== info.key) {
                this.setState({ selectedStationID: info.key }, () => {
                  this.props.onChangeStation(info.key)
                })
              }
            }}
            items={this.state.stations}
          />
        </Col>
      </Row>

    </div>
  }
}