import React from 'react'
import { transformToSchema, transformToTreeNode } from '@swiftease/designable-formily-transformer'
import { TreeNode, ITreeNode } from '@swiftease/designable-core'
import { MonacoInput } from '@swiftease/designable-react-settings-form'

export interface ISchemaEditorWidgetProps {
  tree: TreeNode
  onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props:any
) => {
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(transformToSchema(props.tree), null, 2)}
      onChange={(value) => {
        props.onChange?.(transformToTreeNode(JSON.parse(value)))
      }}
      language="json"
    />
  )
}
