import React from 'react'
import { Graph } from '@antv/x6'
import { createForm } from '@formily/core'
import { Form as FormilyForm } from '@formily/core/esm/models';
import {
  Form
} from '@swiftease/formily-antd-v5'
import { funcs, defaultCache, newService } from '@swiftease/atali-form';
import { CommonService } from '@swiftease/atali-pkg';
import { Form as FormData, merge } from "@swiftease/atali-pkg";
import { FormProvider, FormConsumer } from '@formily/react'

interface GraphProps {
  graph: Graph
  data: any
  createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
  formID: string
  setFormValues?: (form: FormilyForm<any> | undefined, cellID: string, graph: Graph) => void
}

interface GraphState {
  formData?: FormData
  form: FormilyForm<any>
  schema?: any
  formService: CommonService<FormData>
}

export class GraphPropertiesPage extends React.Component<GraphProps, GraphState> {
  constructor(props: any) {
    super(props);
    this.state = {
      form: createForm(),
      formService: newService<FormData>('form')
    }
  }

  async componentDidMount() {
    const resp = await defaultCache.getFormConfig(this.props.formID)
    if (resp?.code == 20000) {
      const form = createForm()
      const schema = JSON.parse(resp.data.schema);
      this.setState({ formData: resp.data, schema: schema, form: form })
    }
  }

  render() {
    if (!this.state || !this.state.schema) return (<></>)
    this.props.setFormValues ? this.props.setFormValues(this.state.form, "", this.props.graph) : this.state.form?.setValues(this.props.data)
    return (
      <FormProvider form={this.state.form}>
        <Form {...this.state.schema.form} form={this.state.form}>
          {this.props.createSchemaField?.(this.state.schema.schema, {
            ...funcs, getCells: () => {
              return this.props.graph.getCells()
            }
          }, false)}
        </Form>
        <div style={{ display: 'none' }}>
          <FormConsumer>{
            (form) => {
              merge(form?.values, this.props.data)
              return JSON.stringify(form?.values)
            }
          }</FormConsumer>
        </div>
      </FormProvider>
    )
  }
}
