import React from 'react'
import { Edge, Graph } from '@antv/x6'
import { createForm, onFieldValueChange } from '@formily/core'
import { Form as FormilyForm } from '@formily/core/esm/models';
import {
    Form
} from '@swiftease/formily-antd-v5'
import { funcs, newService,defaultCache } from '@swiftease/atali-form';
import { merge, CommonService } from '@swiftease/atali-pkg';
import { Form as FormData } from "@swiftease/atali-pkg";
import { FormProvider, FormConsumer } from '@formily/react'

interface ICellProps {
    id: string
    graph: Graph
    formID: string
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
}

interface CellState {
    formData?: FormData
    form: FormilyForm<any>
    schema?: any
    formService: CommonService<FormData>
    id: string
}

export class EdgePropertiesPage extends React.Component<ICellProps, CellState> {
    constructor(props: any) {
        super(props);
        const form = createForm()
        this.initForm(form, props)
        this.state = {
            formService: newService<FormData>('form'),
            form: form,
            id: props.id
        }
    }

    initForm(form: FormilyForm<any> | undefined, props: ICellProps) {
        this.addEffects(form, props)
        this.setFormValues(form, props)
    }

    addEffects(form: FormilyForm<any> | undefined, props: ICellProps) {
        form?.removeEffects(props.formID)
        form?.addEffects(props.formID, (form) => {
            onFieldValueChange('name', (field) => {
                const cell = props.graph.getCellById(props.id) as Edge
                cell?.setLabelAt(0, field.value)
            })
        })
    }

    setFormValues(form: FormilyForm<any> | undefined, props: ICellProps) {
        const cell = props.graph.getCellById(props.id) as Edge
        const data: any = {}
        data.name = cell?.getLabelAt(0)?.attrs?.label?.text
        data.ID = cell?.id
        merge(cell?.data, data)
        form?.setValues(data, 'overwrite')
    }

    async getFormConfig(formID:string){
        const resp=await defaultCache.getFormConfig(formID)
        if (resp?.code == 20000) {
            const schema = JSON.parse(resp.data.schema);
            this.setState({ formData: resp.data, schema: schema })
        }
    }

    async componentDidMount() {
        await this.getFormConfig(this.props.formID)
    }

    componentDidUpdate(prevProps: ICellProps) {
        if (prevProps.id == this.props.id) {
            return
        }
        this.setState({ id: this.props.id })
        this.initForm(this.state.form, this.props)
    }

    render() {
        if (!this.state || !this.state.schema) return (<></>)
        return (
            <FormProvider form={this.state.form}>
                <Form {...this.state.schema.form} form={this.state.form}>
                {this.props.createSchemaField?.(this.state.schema.schema, {...funcs,getCells:()=>{
                            return this.props.graph.getCells()
                        }}, false)}
                </Form>
                <div style={{ display: 'none' }}>
                    <FormConsumer>{
                        (form) => {
                            const cell = this.props.graph.getCellById(this.state.id)
                            cell.setData(form?.values, { overwrite: true, deep: true })
                            return JSON.stringify(form?.values)
                        }
                    }</FormConsumer>
                </div>
            </FormProvider>
        )
    }
}
