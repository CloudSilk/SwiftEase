
import React from 'react';
import { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { CommonService, GetDetailResponse, BaseModel, PageInfo, Code } from '@swiftease/atali-pkg';
import { Page, PageButton } from './model'
import { funcs, defaultCache, newService } from '@swiftease/atali-form'
import { FormDialog, FormLayout } from '@swiftease/formily-antd-v5'
import { createForm } from '@formily/core'
import { Form } from '@formily/core/esm/models';
import { Button, Modal, Tag, message,notification } from 'antd';
import { Form as FormData } from '@swiftease/atali-pkg'
// @ts-ignore
import { history, History, createSearchParams } from 'umi';
import Icon, { PlusOutlined, ExportOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import { PaginationConfig } from 'antd/lib/pagination';
import UploadComponent from './components/Upload';
export interface CurdPageProps {
    pageName: any;
    customActions?: (key: string, record: any) => void
    customMenus?: any[]
    createAction?: (c: any, columns: ProColumns<any>[]) => void
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    showTitle?: boolean
    className?: string
    actionRef?: React.MutableRefObject<ActionType | undefined>;
    downloadFileUrlPrefix?: string
    customerToolBar?: JSX.Element[]
    fromParentData?: any;
    setSearchValuesState?: (searchValues: any, pageConfig: any) => void;
    searchCaches?: any;
}

export interface CurdPageState extends PageInfo {
    pageConfig?: Page | undefined;
    searchForm: Form<any>;
    searchFormSchema: any;
    editFormSchema: any;
    addFormSchema: any;
    importFormSchema?: any;
    service?: CommonService<any>;
    pageService?: CommonService<Page>;
    formService?: CommonService<FormData>;
    pageName?: string;
    actions: Map<string, any>
    selectedIds: any
    fromParentData?: any;
    searchHeight?: any
}

export interface ActionParams {
    history: any
    btnConfig: any
    fn: any
}

export abstract class CurdPage<P extends CurdPageProps, S extends CurdPageState> extends React.Component<P, S> {
    constructor(props: any) {
        super(props);
        const actions = new Map()
        actions.set('copy', { fn: this.copyAction })
        actions.set('enable', { fn: this.enableAction })
        actions.set('disable', { fn: this.disableAction })
        actions.set('delete', { fn: this.deleteAction })
        actions.set('export', {
            fn: (curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) => {
                this.exportAction('', curdPage, record)
            }
        })
        // @ts-ignore
        this.state = {
            searchFormSchema: {
                type: 'object',
                properties: {},
            },
            editFormSchema: {
                type: 'object',
                properties: {},
            },
            addFormSchema: {
                type: 'object',
                properties: {},
            },
            searchForm: createForm(),
            formService: newService<FormData>('form'),
            pageService: newService<FormData>('curd/page'),
            actions: actions,
            selectedIds: [],
            searchHeight: 0
        }
    }
    updateSearchHeight(height: any) {
        if (this.state.searchHeight !== height)
            this.setState({ searchHeight: height }, () => {
                console.log("更新搜索区域高度：", this.state.searchHeight)
            })
    }
    defaultMenus = [
        { key: 'copy', name: '复制' },
        { key: 'enable', name: '启用' },
        { key: 'disable', name: '禁用' },
        { key: 'delete', name: '删除' },
    ];

    registerAction(key: string, fn: (curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) => Promise<GetDetailResponse<any> | null>, params?: any) {
        this.state.actions.set(key, { "fn": fn, ...(params || {}) })
    }

    copyAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) {
        const id = record.id;
        return curdPage.state.service?.copy({ pageName: curdPage.state.pageConfig?.name, id: id })
    }

    enableAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) {
        curdPage.confirmAction('确认启用?', () => {
            const id = record.id;
            return curdPage.state.service?.enable({ pageName: curdPage.state.pageConfig?.name, id: id, enable: true })
        })

    }

    disableAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) {
        curdPage.confirmAction('确认禁用?', () => {
            const id = record.id;
            return curdPage.state.service?.enable({ pageName: curdPage.state.pageConfig?.name, id: id, enable: false })
        })
    }

    gotoEditPage(isAdd: boolean, curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any, h: History<History.PoorMansUnknown>, params?: any) {
        curdPage.gotoEditPageUseURL("/curd/page/edit", isAdd, curdPage, record, h, params)
    }

    gotoEditPageUseURL(pathname: string, isAdd: boolean, curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any, h: History<History.PoorMansUnknown>, params?: any) {
        const id = record ? record.id : ""
        var searchParams = new URLSearchParams({
            id: id,
            pageName: curdPage.state.pageConfig?.name as string,
            isAdd: String(isAdd),
            ...params
        })
        h.push({
            pathname: pathname,
            search: searchParams.toString(),
            state: {
                id: id,
                pageConfig: curdPage.state.pageConfig,
                service: curdPage.state.service,
                isAdd: isAdd,
                editFormSchema: curdPage.state.editFormSchema,
                addFormSchema: curdPage.state.addFormSchema,
            },
        })
    }

    async load(self: any, isReset?: boolean) {
    }

    confirmAction(title: string, ok: () => void) {
        Modal.confirm({
            title: title,
            onOk: ok
        })
    }

    deleteAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any, title?: string) {
        const id = record.id;
        Modal.confirm({
            title: title ?? '确认删除',
            onOk: () => {
                curdPage.state.service?.delete({ pageName: curdPage.state.pageConfig?.name, id: id }).then(() => {
                    curdPage.load(curdPage);
                })
            }
        })
    }

    viewVideo(url: string, width: number, height: number) {
        Modal.info({
            width: width,
            okText: '关闭',
            okCancel: false,
            closable: true,
            icon: null,
            content: <video width={width - 100} height={height} src={url} autoPlay={true} controls={true} playsInline={true}></video>
        })
    }

    showConfirm(title: string, type: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm' | undefined, onOk: () => void) {
        Modal.confirm({
            title: title,
            type: type,
            onOk: () => {
                onOk()
            }
        })
    }

    exportAction(url: string, curdPage: CurdPage<CurdPageProps, CurdPageState>, record: any) {
        curdPage.state.service?.export(url, { id: record.id })
    }


    excuteAction(key: string, record: any) {
        let result: Promise<GetDetailResponse<any> | null>;
        const action = this.state.actions.get(key)
        if (action) {
            result = action.fn?.(this, record, history, action.btnConfig)
            result?.then((resp) => {
                if(resp.code===Code.Success){
                    notification.success({message:"操作成功"})
                }
                this.load(this);
            })
        } else {
            if (this.props.customActions)
                this.props.customActions(key, record)
        }
    }
    hiddenBtn(curdPage: CurdPage<CurdPageProps, CurdPageState>, pageConfig: Page, btn: PageButton, record: any): Boolean {
        if (btn.hiddenScript && btn.hiddenScript !== '') {
            let func = new Function('curdPage', 'record', 'btnConfig', btn.hiddenScript)
            return func(curdPage, record, btn)
        }
        return false
    }

    createCustomAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, pageConfig: Page, record: any) {
        if (curdPage.state.pageConfig?.buttons?.length == 0) {
            return
        }
        const listA: any[] = []
        const menus: any[] = []
        pageConfig?.buttons?.forEach(btn => {
            if (btn.showPosition == 2 || !btn.enable) return
            if (curdPage.hiddenBtn(curdPage, pageConfig, btn, record)) return
            let func: Function | null = null
            if (btn.script && btn.script !== '') {
                func = new Function('curdPage', 'record', 'history', 'btnConfig', btn.script)
            }
            if (!btn.expanded) {
                const aProps: any = {
                    key: btn.key,
                    onClick: () => {
                        if (func)
                            func(curdPage, record, history, btn)
                    },
                    title: btn.label
                }
                if (btn.href && btn.href !== '') {
                    aProps.href = btn.href + '/' + record.id
                } else if (btn.hrefFunc && btn.hrefFunc !== '') {
                    let func = new Function('curdPage', 'record', 'props', 'btnConfig', btn.hrefFunc)
                    func(curdPage, record, aProps, btn)
                }
                if (btn.showType === 'Blank') {
                    aProps.target = '_blank'
                }
                const a = React.createElement('a', aProps, btn.label)
                listA.push(a)
            } else {
                menus.push({ key: btn.key, name: btn.label })
                if (func) {
                    // @ts-ignore
                    curdPage.registerAction(btn.key, func, { btnConfig: btn })
                }
            }
        })
        if (menus.length > 0) {
            listA.push(<TableDropdown
                key="actionGroup"
                onSelect={(key: string) => { curdPage.excuteAction(key, record) }}
                menus={menus}
            />)
        }
        return listA
    }
    // @ts-ignore
    createActions(record: any) {
        const pageConfig = this.state.pageConfig
        if (!pageConfig) return []
        if (pageConfig.buttons && pageConfig.buttons?.length > 0) {
            return this.createCustomAction(this, pageConfig, record)
        } else {
            return this.createAction(this, pageConfig, record);
        }
    }

    createAction(curdPage: CurdPage<CurdPageProps, CurdPageState>, pageConfig: Page | undefined, record: any) {
        let menus: any[] = []
        if (curdPage.props.customMenus) {
            menus = this.defaultMenus.concat(...curdPage.props.customMenus)
        } else {
            menus = this.defaultMenus
        }

        return [
            <a key="editable"
                onClick={() => { this.showEditDialog(record) }}>编辑</a>,
            <a target="_blank" rel="noopener noreferrer" key="view">查看</a>,
            <TableDropdown
                key="actionGroup"
                onSelect={(key: string) => { this.excuteAction(key, record) }}
                menus={menus}
            />
        ]
    }
    showTotal(total: number, range: [number, number]) {
        return `第 ${range[0] ?? 0}-${range[1] ?? 0} 条/总共 ${total} 条`
    }
    getPagination(self: any): PaginationConfig | false {
        return {
            onChange: page => {
                self.setState({ pageIndex: page, current: page }, () => {
                    self.load(self)
                })
            },
            pageSize: self.state.pageConfig?.pageSize as number,
            current: self.state.current as number,
            total: self.state.records as number,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: self.showTotal
        }
    }

    async rebuild() {
        // const pageConfig = await defaultCache.getPageConfig(this.props.pageName);
        let pageConfig = await defaultCache.getPageConfig(this.props.pageName);
        if (pageConfig?.code !== 20000 || !pageConfig.data) return;
        let searchFormSchema = {
            type: 'object',
            properties: {},
            labelCol: 8,
            wrapperCol: 14
        };

        let editFormSchema = {
            type: 'object',
            properties: {},
        };

        let addFormSchema = {
            type: 'object',
            properties: {},
        };
        if (pageConfig.data.addFormID && pageConfig.data.addFormID !== "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.addFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                addFormSchema = schema.schema
            }
        }

        if (pageConfig.data.editFormID && pageConfig.data.editFormID !== "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.editFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                editFormSchema = schema.schema
            }
        }
        let importFormSchema = undefined
        if (pageConfig.data.toolBar.importFormID && pageConfig.data.toolBar.importFormID !== "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.toolBar.importFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                importFormSchema = schema.schema
            }
        }
        let initialValues = pageConfig.data.searchDefaultValue == undefined || pageConfig.data.searchDefaultValue == "" ? {} : JSON.parse(pageConfig.data.searchDefaultValue);
        if(this.props.searchCaches && this.props.searchCaches[this.props.pageName]) {
            initialValues = this.props.searchCaches[this.props.pageName];
        }
        const searchForm = createForm({ initialValues: initialValues })
        if (pageConfig.data.searchFormID && pageConfig.data.searchFormID !== "") {
            const resp = await defaultCache.getFormConfig(pageConfig.data.searchFormID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                searchFormSchema = schema.schema
                searchFormSchema.labelCol = schema.form?.labelCol
                searchFormSchema.wrapperCol = schema.form?.wrapperCol
            }
        }

        this.setState({
            pageConfig: pageConfig?.data,
            searchFormSchema: searchFormSchema,
            searchForm: searchForm,
            editFormSchema: editFormSchema,
            addFormSchema: addFormSchema,
            importFormSchema: importFormSchema,
            service: newService<any>(pageConfig.data.path != "" ? pageConfig.data.path : "curd/common/" + pageConfig.data.name),
            pageName: this.props.pageName,
            fromParentData: this.props.fromParentData,
        }, () => {
            this.rebuildAfter()
            this.load(this);
        });
    }

    rebuildAfter() {

    }

    getFormConfig(id: string) {
        return defaultCache.getFormConfig(id)
    }

    async componentDidMount() {
        await this.rebuild()
    }

    async componentDidUpdate(prevProps: any, props: any) {
        if (this.state.pageName === this.props.pageName && this.props.pageName !== "" && (!this.state.pageConfig?.isChild || (this.state.pageConfig?.isChild && this.props['fromParentData']?.id === this.state['fromParentData']?.id))) return
        await this.rebuild()
    }

    componentWillUnmount(): void {
        this.setState({ pageName: '' })
    }

    showEditDialog(record: BaseModel) {
        const params: any = {}
        eval(this.state.pageConfig?.loadDetailBefore ?? '')
        this.state.service?.detail2({ pageName: this.state.pageConfig?.name, id: record.id, ...params }).then(resp => {
            if (resp?.code !== 20000) return
            eval(this.state.pageConfig?.loadDetailAfter ?? '')
            const formDialog = FormDialog({
                title: '编辑', width: 1200, maskClosable: false
            }, () => {
                return (
                    <FormLayout labelCol={6} wrapperCol={16}>
                        {this.props.createSchemaField && this.props.createSchemaField(this.state?.editFormSchema, funcs, false)}
                    </FormLayout>
                )
            })
            formDialog.open({
                values: resp.data,
            }, async (env, values) => {
                console.log(env)
                eval(this.state.pageConfig?.submitBefore ?? '')
                let data = { ...values }
                if (this.state.pageConfig?.path === "") {
                    data = { pageName: this.state.pageConfig?.name, data: values }
                }
                const resp = await this.state.service?.update(data)
                if (resp.code === Code.Success) {
                    this.load(this)
                    eval(this.state.pageConfig?.submitAfter ?? '')
                    notification.success({message:"更新成功"})
                    return true
                }
                return false
            }, true).then((values: any) => { })
        })
    }

    showAdd(self: any) {
        if (self.state.pageConfig?.toolBar.addScript && self.state.pageConfig?.toolBar.addScript !== '') {
            const fn = new Function('curdPage', 'history', self.state.pageConfig?.toolBar.addScript)
            fn(self, history)
        } else {
            self.showAddDialog()
        }
    }

    exportTable(params: any) {
        this.state.service?.export(this.state.pageConfig?.toolBar.exportUri ?? '', params);
    }

    batchDelAction(ids: any[]) {
        if (!ids || ids.length == 0) {
            message.warning('请至少选择一个要删除的数据!!!');
            return
        }
        this.state.service?.delete({ ids: ids });
    }
    async showFormDialogByFormID(formID: string, title: string, width: string | number,
        submit: (values: any, curdPage: CurdPage<P, S>, history: any) => boolean, hideFooter?: boolean, initialValues?: any) {
        const resp = await defaultCache.getFormConfig(formID)
        if (resp?.code == 20000) {
            const schema = JSON.parse(resp.data.schema);
            this.showFormDialog(title, width, schema.schema, submit, hideFooter, initialValues)
        }
    }
    showFormDialog(title: string, width: string | number, formSchema: any,
        submit: (values: any, curdPage: CurdPage<P, S>, history: any) => boolean, hideFooter?: boolean, initialValues?: any) {
        const curdPage = this;
        const formDialog = FormDialog({ title: title, width: width, maskClosable: false, footer: hideFooter ? <></> : undefined }, () => {
            return (
                <FormLayout labelCol={6} wrapperCol={16}>
                    {this.props.createSchemaField && this.props.createSchemaField(formSchema, funcs, false)}
                </FormLayout>
            )
        })
        formDialog.open({
            initialValues: initialValues
        }, async (env, values) => {
            if (submit) {
                return submit(values, curdPage, history)
            }
            return false
        }, false)
            .then((values: any) => {

            })
    }

    toolBarRender(self: any, action: ActionType | undefined, rows: {
        selectedRowKeys?: (string | number)[] | undefined;
        selectedRows?: any[] | undefined
    }) {
        const btns = [
            // <Button key="button" onClick={() => {
            //     self.props.actionRef?.current?.reset()
            //     self.load(self)
            // }} type="primary">
            //     查询
            // </Button>,
            // <Button key="button" onClick={() => {
            //     self.state.searchForm?.reset().then(() => {
            //         self.setState({
            //             current: 0,
            //             total: 0,
            //             pageIndex: 0,
            //             pages: 0
            //         })
            //         self.props.actionRef?.current?.reset()
            //         self.load(self, true)
            //     })
            // }} type="primary">
            //     重置
            // </Button>
        ]
        if (self.state.pageConfig?.toolBar.showAdd) {
            btns.push(<Button key="button" size='small' icon={<PlusOutlined />} onClick={() => self.showAdd(self)} type="primary">
                新建
            </Button>)
        }

        if (self.state.pageConfig?.toolBar.showExport) {
            btns.push(<Button key="button" size='small' icon={<ExportOutlined />} onClick={() => {
                self.exportTable({ ids: self.state.selectedIds, ...self.state.searchForm.values });
            }} type="primary">
                导出
            </Button>)
        }
        if (self.state.pageConfig?.toolBar.showImport) {
            btns.push(<Button key="button" size='small' icon={<ImportOutlined />} onClick={() => {
                self.showImportDialog(self);
            }} type="primary">
                导入
            </Button>)
        }
        if (self.state.pageConfig?.toolBar['showBatchDel']) {
            btns.push(<Button key="button" size='small' icon={<DeleteOutlined />} onClick={() => {
                if (self.batchDelAction) {
                    self.batchDelAction(self.state.selectedIds)
                }
            }} type="primary">
                批量删除
            </Button>)
        }
        if (self.props.customerToolBar && self.props.customerToolBar.length > 0) {
            btns.push(...self.props.customerToolBar)
        }
        // @ts-ignore
        self.state.pageConfig?.buttons?.forEach(btn => {
            if (btn.showPosition != 2 || !btn.enable) return
            let func: Function | null = null
            if (btn.script && btn.script !== '') {
                func = new Function('curdPage', 'history', 'btnConfig', btn.script)
            }
            btns.push(<Button key="button" size='small' onClick={() => {
                if (func) func(self, history, btn)
            }} type="primary">
                {btn.label}
            </Button>)
        })
        return btns
    }

    showAddDialog() {
        let initialValue = {}
        const addDefaultValue = this.state.pageConfig?.["addDefaultValue"]
        if (addDefaultValue && addDefaultValue !== "") {
            initialValue = JSON.parse(addDefaultValue)
        }
        const formDialog = FormDialog({ title: '新增', width: 1200, maskClosable: false }, () => {
            return (
                <FormLayout labelCol={6} wrapperCol={16}>
                    {this.props.createSchemaField && this.props.createSchemaField(this.state?.addFormSchema, funcs, false)}
                </FormLayout>
            )
        })

        formDialog.open({
            values: initialValue,
        }, async (env, values) => {
            console.log(env)
            eval(this.state.pageConfig?.submitBefore ?? '')
            let data = { ...values }
            if (this.state.pageConfig?.path === "") {
                data = { pageName: this.state.pageConfig?.name, data: values }
            }
            const resp = await this.state.service?.update(data)
            if (resp.code === Code.Success) {
                this.load(this)
                eval(this.state.pageConfig?.submitAfter ?? '')
                notification.success({message:"新增成功"})
                return true
            }
            return false
        }, true).then((values: any) => { })
    }

    showImportDialog(self: any) {
        if (!self.state.importFormSchema)
            Modal.confirm({
                width: 800,
                title: "导入",
                okText: "关闭",
                okCancel: false,
                content: <UploadComponent service={self.state.service} multi={self.state.pageConfig?.toolBar.importMulti} maxCount={self.state.pageConfig?.toolBar.importMaxCount} uploadUrl={self.state.pageConfig?.toolBar.importUri}></UploadComponent>
            })
        else
            FormDialog({ title: '导入', width: 1200, maskClosable: false, footer: <></> }, () => {
                return (
                    <FormLayout labelCol={6} wrapperCol={16}>
                        {self.props.createSchemaField && self.props.createSchemaField(self.state?.importFormSchema, funcs, false)}
                    </FormLayout>
                )
            }).open().then(console.log)
    }

    createTag(color: string, title: string) {
        return <Tag color={color}>{title}</Tag>
    }
    IconText({ icon, text }: { icon: any; text: string }) {
        return <span>
            <Icon type={icon}></Icon>
            {text}
        </span>
    }

    render() {
        return (<></>)
    }

    rebuildEditForm() { }

    getName() {
        return "CurdPage"
    }
}