import { ArrowRightOutlined } from '@ant-design/icons';
import { CommonService, Page } from '@swiftease/atali-pkg';
import { Button } from 'antd';
import React from 'react';
import './index.less'
import { FormDialog, FormLayout } from '@swiftease/formily-antd-v5'
import { funcs, defaultCache, newService } from '@swiftease/atali-form'

interface ShortcutsProps {
    selectedFactoryID: any
    selectedProductionLineID: any
    selectedStationID: any
    execOrderByMes: boolean
    productionLineService: CommonService<any>
    stationService: CommonService<any>
    factoryService: CommonService<any>
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    addFactorySuccess?: () => void
    addProductionLineSuccess?: () => void
    addStationSuccess?: () => void
    addWorkmanshipSuccess?: () => void
    addStationAPPSuccess?: () => void
    addStationDeviceSuccess?: () => void
    addStationFunctionSuccess?: () => void
}
interface ShortcutsState {
    factoryPageConfig: Page
    productionLinePC: Page
    stationPC: Page
    workmanshipPC: Page
    stationAPPPC: Page
    stationDevicePC: Page
    workmanshipService: CommonService<any>
    stationAPPService: CommonService<any>
    stationDeviceService: CommonService<any>
    factoryFormSchema: any
    plFormSchema: any
    stationFormSchema: any
    workmanshipFormSchema: any
    appFormSchema: any
    deviceFormSchema: any

    stationFunctionService: CommonService<any>
    stationFunctionPC: Page
    stationFunctionFormSchema: any
}
export default class Shortcuts extends React.Component<ShortcutsProps, ShortcutsState> {
    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        const factoryPageConfig = await defaultCache.getPageConfig('Factory');
        const productionLinePC = await defaultCache.getPageConfig('ProductionLine');
        const stationLinePC = await defaultCache.getPageConfig('Station');
        const workmanshipPC = await defaultCache.getPageConfig('Workmanship');
        const stationAPPPC = await defaultCache.getPageConfig('StationAPP');
        const stationDevicePC = await defaultCache.getPageConfig('StationDevice');
        const stationFunctionPC = await defaultCache.getPageConfig('StationFunction');

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

        let stationFormSchema = {
            type: 'object',
            properties: {},
        };
        if (stationLinePC && stationLinePC.data &&
            stationLinePC.data.addFormID && stationLinePC.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(stationLinePC.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                stationFormSchema = schema.schema
            }
        }

        let workmanshipFormSchema = {
            type: 'object',
            properties: {},
        };
        if (workmanshipPC && workmanshipPC.data &&
            workmanshipPC.data.addFormID && workmanshipPC.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(workmanshipPC.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                workmanshipFormSchema = schema.schema
            }
        }


        let appFormSchema = {
            type: 'object',
            properties: {},
        };
        if (stationAPPPC && stationAPPPC.data &&
            stationAPPPC.data.addFormID && stationAPPPC.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(stationAPPPC.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                appFormSchema = schema.schema
            }
        }

        let deviceFormSchema = {
            type: 'object',
            properties: {},
        };
        if (stationDevicePC && stationDevicePC.data &&
            stationDevicePC.data.addFormID && stationDevicePC.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(stationDevicePC.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                deviceFormSchema = schema.schema
            }
        }

        let stationFunctionFormSchema = {
            type: 'object',
            properties: {},
        };
        if (stationFunctionPC && stationFunctionPC.data &&
            stationFunctionPC.data.addFormID && stationFunctionPC.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(stationFunctionPC.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                stationFunctionFormSchema = schema.schema
            }
        }


        this.setState({
            factoryFormSchema, plFormSchema, deviceFormSchema,
            stationFormSchema, workmanshipFormSchema, appFormSchema,
            factoryPageConfig: factoryPageConfig.data,
            productionLinePC: productionLinePC.data,
            stationPC: stationLinePC.data,
            workmanshipPC: workmanshipPC.data,
            stationAPPPC: stationAPPPC.data,
            stationDevicePC: stationDevicePC.data,
            workmanshipService: newService('aiot/station/workmanship'),
            stationAPPService: newService('aiot/station/app'),
            stationDeviceService: newService('aiot/station/device'),
            stationFunctionFormSchema: stationFunctionFormSchema,
            stationFunctionPC: stationFunctionPC.data,
            stationFunctionService: newService('aiot/station/function'),
        })
    }

    showAddDialog(title: string, initialValue: any, formSchema: any, pageConfig: any, service: CommonService<any>, success?: () => void) {
        FormDialog({ title: title, width: 1200, maskClosable: false }, () => {
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
                    service?.add({ pageName: pageConfig?.name, ...values }).then((resp) => {
                        eval(pageConfig?.submitAfter ?? '')
                        success && success()
                    })
                } else {
                    service?.add({ pageName: pageConfig?.name, data: values }).then((resp) => {
                        eval(pageConfig?.submitAfter ?? '')
                        success && success()
                    })
                }
            })
    }

    render(): React.ReactNode {
        return (
            <div className='shotcuts'>
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增工厂", {}, this.state.factoryFormSchema,
                        this.state.factoryPageConfig,
                        this.props.factoryService,
                        this.props.addFactorySuccess)
                }}>
                    添加工厂
                </Button>
                <ArrowRightOutlined />
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增产线", {
                        factoryID: this.props.selectedFactoryID
                    }, this.state.plFormSchema,
                        this.state.productionLinePC,
                        this.props.productionLineService,
                        this.props.addProductionLineSuccess)
                }}>
                    添加产线
                </Button>
                <ArrowRightOutlined />
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增工站", {
                        factoryID: this.props.selectedFactoryID,
                        productionLineID: this.props.selectedProductionLineID
                    }, this.state.stationFormSchema,
                        this.state.stationPC,
                        this.props.stationService,
                        this.props.addStationSuccess)
                }}>
                    添加工站
                </Button>
                <ArrowRightOutlined />
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增设备", {
                        stationID: this.props.selectedStationID
                    }, this.state.deviceFormSchema,
                        this.state.stationDevicePC,
                        this.state.stationDeviceService,
                        this.props.addStationDeviceSuccess)
                }}>
                    添加设备
                </Button>
                <ArrowRightOutlined />
                {<Button type="link" onClick={() => {
                    this.showAddDialog("新增工序", {
                        factoryID: this.props.selectedFactoryID,
                        productionLineID: this.props.selectedProductionLineID,
                        stationID: this.props.selectedStationID
                    }, this.state.workmanshipFormSchema,
                        this.state.workmanshipPC,
                        this.state.workmanshipService,
                        this.props.addWorkmanshipSuccess)
                }}>
                    添加工序
                </Button>}
                {/* {this.props.execOrderByMes && <Button type="link" onClick={() => {
                    this.showAddDialog("新增工步", {
                        factoryID: this.props.selectedFactoryID,
                        productionLineID: this.props.selectedProductionLineID,
                        stationID: this.props.selectedStationID
                    }, this.state.stationFunctionFormSchema,
                        this.state.stationFunctionPC,
                        this.state.stationFunctionService,
                        this.props.addStationFunctionSuccess)
                }}>
                    添加工步
                </Button>} */}
                <ArrowRightOutlined />
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增应用", {
                        factoryID: this.props.selectedFactoryID,
                        productionLineID: this.props.selectedProductionLineID,
                        stationID: this.props.selectedStationID
                    }, this.state.appFormSchema,
                        this.state.stationAPPPC,
                        this.state.stationAPPService,
                        this.props.addStationAPPSuccess)
                }}>
                    添加应用
                </Button>
                <ArrowRightOutlined />
                <Button type="link" onClick={() => {
                    this.showAddDialog("新增表单", {
                        factoryID: this.props.selectedFactoryID,
                        productionLineID: this.props.selectedProductionLineID,
                        stationID: this.props.selectedStationID,
                        isForm: true
                    }, this.state.appFormSchema,
                        this.state.stationAPPPC,
                        this.state.stationAPPService,
                        this.props.addStationAPPSuccess)
                }}>
                    添加表单
                </Button>
            </div>
        );
    }
}