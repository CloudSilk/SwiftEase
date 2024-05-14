import React, { useMemo } from 'react'
import { createForm } from '@formily/core'
import {
  Form,
} from '@swiftease/formily-antd-v5'
import { TreeNode } from '@swiftease/designable-core'
import { transformToSchema } from '@swiftease/designable-formily-transformer'

import { funcs } from '../../utils';
import { newSchemaField } from '../../components'
export interface IPreviewWidgetProps {
  tree: TreeNode
}

const SchemaField=newSchemaField({})

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props:any) => {
  const form = useMemo(() => createForm(), [])
  const { form: formProps, schema } = transformToSchema(props.tree)
  return (
    <Form {...formProps} form={form}>
      <SchemaField schema={schema} scope={funcs} />
    </Form>
  )
}
