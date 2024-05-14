import React from 'react'
import { Graph } from '@antv/x6'
import { createForm, onFieldValueChange } from '@formily/core'
import { Form as FormilyForm } from '@formily/core/esm/models';
import {
    Form
} from '@swiftease/formily-antd-v5'
import { funcs, defaultCache, newService } from '@swiftease/atali-form';
import { CommonService } from '@swiftease/atali-pkg';
import { Form as FormData, merge } from "@swiftease/atali-pkg";
import { FormProvider, FormConsumer } from '@formily/react'
import { nextID } from '../../../utils/id';
import { CellCache } from '../../../service/service';
interface ICellProps {
    id: string
    graph: Graph
    formID: string
    data: any
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
    cellCache?: CellCache
    preview?: boolean
    setFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
}

interface CellState {
    formData?: FormData
    form: FormilyForm<any>
    schema?: any
    formService: CommonService<FormData>
    id: string
}

export class CellPropertiesPage extends React.Component<ICellProps, CellState> {
    constructor(props: any) {
        super(props);
        const form = createForm()
        this.initForm(form, props)
        this.state = {
            formService: newService<FormData>('form'),
            form: form,
            id: props.id,
        }
    }

    initForm(form: FormilyForm<any> | undefined, props: ICellProps) {
        this.addEffects(form, props)
    }

    addEffects(form: FormilyForm<any> | undefined, props: ICellProps) {
        form?.removeEffects(props.formID)
        props.setFormValues ? props.setFormValues(form, props.id, props.graph) : this.setFormValues(form, props)
        form?.addEffects(props.formID, (form) => {
            onFieldValueChange('name', (field) => {
                if (field.form.values.id != props.id) {
                    return
                }
                const cell = props.graph.getCellById(props.id)
                if (cell.isEdge()) {
                    cell?.setLabelAt(0, field.value)
                } else {
                    cell.attr('text/text', field.value)
                }

            })
            onFieldValueChange('id', (field) => {
                if (field.form.values.id != props.id) {
                    return
                }
                const activityRef = field.form.query('activityRef').take()
                if (activityRef) {
                    activityRef['dataSource'] = this.getActivityRefs()
                }

            })
            onFieldValueChange('zIndex', (field) => {
                if (field.form.values.id != props.id) {
                    return
                }
                const cell = props.graph.getCellById(props.id)
                cell.setZIndex(field.value)
            })

            onFieldValueChange('shape', (field) => {
                if (field.form.values.id != props.id) {
                    field.dataSource = this.props.cellCache?.getShapeDataSource(this.props.formID) ?? []
                    return
                }
                const cell = props.graph.getCellById(props.id)
                if (cell.shape == field.value) {
                    return
                }
                const newCellConf = cell.toJSON()
                newCellConf.shape = field.value
                const defaultConf = this.props.cellCache?.cloneDefaultConf(field.value)
                newCellConf.markup = defaultConf?.markup
                newCellConf.attrs = defaultConf?.attrs
                if (newCellConf.attrs) {
                    if (cell.isEdge()) {
                        cell?.setLabelAt(0, field.form.values.name)
                    } else {
                        newCellConf.attrs['text']['text'] = field.form.values.name
                    }

                }

                //
                //连线关系继承下来
                const edges = props.graph.getConnectedEdges(cell)
                props.graph.removeCell(cell.id)
                props.graph.addNode(newCellConf)
                props.graph.addEdges(edges)
            })
        })
    }

    setFormValues(form: FormilyForm<any> | undefined, props: ICellProps) {
        const cell = props.graph.getCellById(props.id)
        const data: any = {}
        data.name = cell.attr('text/text') as string
        if (!data.name) data.name = cell['label']
        data.id = cell.id
        data.zIndex = cell.zIndex
        data.shape = cell.shape
        merge(cell.data, data)
        // form?.reset()
        form?.setValues(data, 'overwrite')
    }

    async getFormConfig(formID: string) {
        //缓存表单配置
        const resp = await defaultCache.getFormConfig(formID)
        if (resp?.code == 20000) {
            const schema = JSON.parse(resp.data.schema);
            this.setState({ formData: resp.data, schema: schema })
        }
    }

    async componentDidMount() {
        await this.getFormConfig(this.props.formID)
    }

    async componentDidUpdate(prevProps: ICellProps) {
        if (prevProps.id == this.props.id) {
            return
        }
        this.setState({ id: this.props.id })
        if (prevProps.formID != this.props.formID) {
            await this.getFormConfig(this.props.formID)
            this.setState({ form: createForm() })
        }
        this.initForm(this.state.form, this.props)
    }

    getGlobalMessage() {
        let messages: any[] = []
        this.props.data.messages?.forEach((m: any) => {
            messages.push({
                value: m.id,
                label: m.name
            })
        })
        return messages
    }

    getGlobalSignals() {
        let messages: any[] = []
        this.props.data.signals?.forEach((m: any) => {
            messages.push({
                value: m.id,
                label: m.name
            })
        })
        return messages
    }

    getGlobalErrors() {
        let errors: any[] = []
        this.props.data.errors?.forEach((m: any) => {
            errors.push({
                value: m.id,
                label: m.name + '(' + 'code=' + m.code + ')'
            })
        })
        return errors
    }

    getGlobalEscalations() {
        let errors: any[] = []
        this.props.data.escalations?.forEach((m: any) => {
            errors.push({
                value: m.id,
                label: m.name
            })
        })
        return errors
    }

    getActivityRefs() {
        const cells = this.props.graph.getCells()
        const activityRefs: any[] = []
        cells.forEach(cell => {
            if (cell.shape == 'BPMCallActiviti') {
                activityRefs.push({
                    value: cell.id,
                    label: cell.attr('text/text') as string
                })
            }
        })
        return activityRefs
    }

    render() {
        if (!this.state || !this.state.schema) return (<></>)
        return (
            <FormProvider form={this.state.form}>
                <Form {...this.state.schema.form} form={this.state.form}>
                    {this.props.createSchemaField?.(this.state.schema.schema, {
                        ...funcs, nextID: nextID, getGlobalMessage: () => {
                            return this.getGlobalMessage()
                        }, getGlobalSignals: () => {
                            return this.getGlobalSignals()
                        }, getGlobalErrors: () => {
                            return this.getGlobalErrors()
                        }, getGlobalEscalations: () => {
                            return this.getGlobalEscalations()
                        }, getActivityRefs: () => {
                            return this.getActivityRefs()
                        }, getCells: () => {
                            return this.props.graph.getCells()
                        }
                    }, false)}
                </Form>
                <div style={{ display: 'none' }}>
                    <FormConsumer>{
                        (form) => {
                            if (this.props.id == this.state.id && this.props.id == form?.values?.id) {
                                const cell = this.props.graph.getCellById(this.state.id)
                                if (cell) {
                                    cell.setData(form?.values, { overwrite: true, deep: true })
                                }
                            }
                            return JSON.stringify(form?.values)
                        }
                    }</FormConsumer>
                </div>
            </FormProvider>
        )
    }
}
