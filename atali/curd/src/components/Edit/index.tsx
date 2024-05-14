import React from 'react';
import { Button } from 'antd';
import { Code, CommonService, Page, getSearchParams } from '@swiftease/atali-pkg';
import {
    Form,
} from '@swiftease/formily-antd-v5'
import { Form as FormilyForm } from '@formily/core/esm/models'
// @ts-ignore
import { history } from 'umi';
import { createForm } from '@formily/core';
import { PageContainer } from '@ant-design/pro-layout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { funcs, defaultCache, newService } from '@swiftease/atali-form'
import './index.less'
export interface EditCompomemtProps {
    location: {
        state: {
            pageConfig: Page
            id: any
            service: CommonService<any>
            isAdd: boolean
            editFormSchema: any
        }
        query: any
    },
    createSchemaField: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
}

export interface EditComponentState {
    editForm?: FormilyForm
    pageConfig: Page
    id: any
    service: CommonService<any>
    isAdd: boolean
    editFormSchema: any,
    params: any
    title: string
}

export class EditComponent extends React.Component<EditCompomemtProps, EditComponentState> {
    constructor(props: EditCompomemtProps) {
        super(props)
    }

    async loadPageConfig() {
        const params = getSearchParams();
        let formID = params['formID']
        //@ts-ignore
        const pageConfig = await defaultCache.getPageConfig(params['pageName']);
        if (pageConfig?.code !== 20000 || !pageConfig.data) return;
        let editFormSchema = {
            type: 'object',
            properties: {},
        };

        if (!formID || formID == "") {
            if (params['isAdd'] == 'true') {
                formID = pageConfig.data.addFormID
            } else {
                formID = pageConfig.data.editFormID
            }
        }
        let title = pageConfig?.title + '-编辑'
        if (formID && formID != "") {
            //@ts-ignore
            const resp = await defaultCache.getFormConfig(formID)
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                editFormSchema = schema.schema
                title = resp.data.pageName + "-" + resp.data.name
            }
        }
        const self = this
        await this.setState({
            id: params['id'],
            isAdd: params['isAdd'] == 'true',
            pageConfig: pageConfig.data,
            editFormSchema: editFormSchema,
            title: title,
            params,
            service: newService<any>(pageConfig.data.path != "" ? pageConfig.data.path : "curd/common/" + pageConfig.data.name),
        }, async () => {
            const data = await this.getData(self)
            self.setState({
                editForm: createForm({
                    initialValues: data
                })
            })
        })
    }

    async componentDidMount() {
        await this.loadPageConfig()
    }

    async getData(self: EditComponent) {
        if (self.state && self.state.id && self.state.id !== '') {
            const params: any = {}
            eval(self.state.pageConfig?.loadDetailBefore ?? '')
            const resp = await self.state.service.detail2({ pageName: self.state.pageConfig?.name, id: self.state.id, ...params })
            if (resp?.code === 20000) {
                eval(self.state.pageConfig?.loadDetailAfter ?? '')
                return resp.data
            }
        }
        let initialValue = {}
        const addDefaultValue = self.state.pageConfig?.["addDefaultValue"]
        if (addDefaultValue && addDefaultValue !== "") {
            initialValue = JSON.parse(addDefaultValue)
        }
        return { id: self.state.id, ...initialValue }
    }

    async loadData(self: EditComponent) {
        const data = await self.getData(self)
        self.state.editForm?.setValues(data)
    }

    onSubmit(values: any) {
        const locationState = this.state
        eval(locationState.pageConfig?.submitBefore ?? '')
        let data: any = undefined
        if (locationState.pageConfig?.path != "") {
            data = values
        } else {
            data = { pageName: locationState.pageConfig?.name, data: values }
        }
        if (locationState && !locationState.isAdd) {
            locationState.service?.update(data).then((resp) => {
                if (resp.code === Code.Success) {
                    eval(locationState.pageConfig?.submitAfter ?? '')
                    this.onBack()
                }

            })
        } else if (locationState && locationState.isAdd) {
            locationState.service?.add(data).then((resp) => {
                if (resp.code === Code.Success) {
                    eval(locationState.pageConfig?.submitAfter ?? '')
                    this.onBack()
                }
            })
        }
    }

    onBack() {
        if (history['back']) {
            history['back']()
        } else {
            history['goBack']()
        }
    }

    render() {
        if (!this.state || !this.state.editForm) return <></>
        return <PageContainer className={'pageEdit'}
            header={{
                title: this.state?.title,
                extra: [<Button type="text" onClick={this.onBack}><ArrowLeftOutlined /></Button>]
            }}
            footer={this.state.params['hiddenButton'] ? undefined : [
                <Button onClick={this.onBack}>取消</Button>,
                <Button onClick={
                    () => {
                        this.onSubmit(this.state.editForm?.values)
                    }
                } type="primary">
                    提交
                </Button>,
            ]}
        >
            <div style={{ "backgroundColor": "white", "padding": "10px" }}>
                <Form labelCol={6} wrapperCol={12}
                    form={this.state.editForm}
                >
                    {this.props.createSchemaField && this.props.createSchemaField(this.state?.editFormSchema, { ...funcs, commonService: this.state.service, editComponent: this }, false)}
                </Form></div>
        </PageContainer>
    }
}
export default EditComponent