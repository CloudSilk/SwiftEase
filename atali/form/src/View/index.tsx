import React from 'react';
import {
    Form,
} from '@swiftease/formily-antd-v5'
import { Form as FormilyForm } from '@formily/core/esm/models'
// @ts-ignore
import { history } from 'umi';
import { createForm, IFormMergeStrategy } from '@formily/core';
import { defaultCache, funcs } from '../utils'
export interface ViewCompomemtProps {
    id: any
    formID: string
    getDetail: (id: any) => any
    createSchemaField: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    getFormConfig?: (id: string) => Promise<any>
    funcs?: any
    strategy?: IFormMergeStrategy | undefined
}

export interface ViewComponentState {
    viewForm?: FormilyForm
    viewFormSchema: any
    strategy?: IFormMergeStrategy | undefined
}

export class ViewComponent extends React.Component<ViewCompomemtProps, ViewComponentState>{
    constructor(props: ViewCompomemtProps) {
        super(props)
    }

    async componentDidMount() {
        let formID = this.props.formID

        let viewFormSchema = {
            type: 'object',
            properties: {},
        };


        if (formID && formID != "") {
            let resp: any = {}
            if (this.props.getFormConfig) {
                resp = await this.props.getFormConfig(formID)
            } else {
                resp = await defaultCache.getFormConfig(formID)
            }
            if (resp?.code == 20000) {
                const schema = JSON.parse(resp.data.schema);
                viewFormSchema = schema.schema
            }
        }

        const data = await this.getData(this)
        this.setState({
            viewFormSchema: viewFormSchema,
            viewForm: createForm({
                initialValues: data
            }),
            strategy: this.props.strategy ?? "overwrite"
        })
    }

    setFormData(data: any, strategy?: IFormMergeStrategy | undefined) {
        this.state.viewForm?.setValues(data, strategy)
    }

    async componentDidUpdate(prevProps: Readonly<ViewCompomemtProps>, prevState: Readonly<ViewComponentState>, snapshot?: any) {
        if (prevProps.id === this.props.id) {
            return
        }
        await this.reload()
    }

    async reload() {
        if (!this.state?.viewForm) return
        const data = await this.getData(this)
        this.state.viewForm?.setValues(data, "overwrite")
    }

    checkID(self: ViewComponent): boolean {
        return self.props && self.props.id && self.props.id !== '' && self.props.id !== 'Empty'
    }

    async getData(self: ViewComponent) {
        if (self.checkID(self)) {
            const resp = await self.props.getDetail(self.props.id)
            if (resp?.code === 20000) {
                return resp.data
            }
        }
        let initialValue = {}
        return { id: self.props.id, ...initialValue }
    }

    onBack() {
        if (history['back']) {
            history['back']()
        } else {
            history['goBack']()
        }
    }

    render() {
        if (!this.state || !this.state.viewForm) return <></>
        return <div>
            <Form labelCol={6} wrapperCol={12}
                form={this.state.viewForm}
            >
                {this.props.createSchemaField && this.props.createSchemaField(this.state?.viewFormSchema, { ...funcs, ...(this.props.funcs ?? {}), editComponent: this }, false)}
            </Form></div>

    }
}