
import React from 'react'
import { createForm } from '@formily/core'
import { Form as FormilyForm } from '@formily/core/esm/models';
import {
    Form
} from '@swiftease/formily-antd-v5'
import { funcs } from '../utils';
import { CommonService } from '@swiftease/atali-pkg';
import { Form as FormData } from "@swiftease/atali-pkg";
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
// @ts-ignore
import { history } from 'umi';
import { newService } from '../utils/http';
interface FormPreviewProps {
    formID: string
    createSchemaField: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    showButton: boolean
    title: string
    showPageContainer: boolean
    formService?: CommonService<FormData>
}

interface FormPreviewState {
    formData?: FormData
    form?: FormilyForm<any>
    schema?: any
    formService: CommonService<FormData>
    title: string
}

export class FormPreviewPage extends React.Component<FormPreviewProps, FormPreviewState> {
    constructor(props: any) {
        super(props);
        this.state = {
            formService: this.props.formService ?? newService<FormData>('form'),
            title: '预览'
        }
    }

    async componentDidMount() {
        if (!this.props.formID) return
        const resp = await this.state.formService.detail(this.props.formID)
        if (resp?.code == 20000) {
            const schema = JSON.parse(resp.data.schema);
            const form = createForm()
            this.setState({ formData: resp.data, schema: schema, form: form, title: resp.data.pageName + '-' + resp.data.name + '(预览)' })
        }
    }
    onBack() {
        if(history['back']){
            history['back']()
        }else{
            history['goBack']()
        }
    }
    render() {
        if (!this.state || !this.state.schema) return (<></>)
        if (this.props.showPageContainer === true) {
            return <PageContainer className={'pageEdit'}
                header={{
                    title: this.props.title ?? this.state.title,
                    extra: [<Button type="text" onClick={this.onBack}><ArrowLeftOutlined /></Button>]
                }}
                footer={this.props.showButton ? [
                    <Button onClick={this.onBack}>取消</Button>,
                    <Button onClick={
                        () => {
                            // console.log(eval('console.log(values)'))
                            console.log(this.state.form?.values)
                        }
                    } type="primary">
                        提交
                    </Button>,
                ] : undefined}
            >
                <div style={{ "backgroundColor": "white", "padding": "10px" }}>
                    <Form {...this.state.schema.form} form={this.state.form}>
                        {this.props.createSchemaField && this.props.createSchemaField(this.state.schema?.schema, funcs, false)}
                    </Form></div>
            </PageContainer>
        }
        return <Form {...this.state.schema.form} form={this.state.form}>
            {this.props.createSchemaField && this.props.createSchemaField(this.state.schema?.schema, funcs, false)}
        </Form>

    }
}
