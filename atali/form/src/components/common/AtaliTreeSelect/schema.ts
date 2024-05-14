// @ts-nocheck
import { ISchema } from '@formily/react'

export const AtaliTreeSelectSchema: ISchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: "/api/form/all"
      },
    },
    labelField:{
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: "name"
      },
      description:"多个字段以逗号分隔"
    },
    idField:{
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: "id"
      },
    },
    allowClear: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    autoClearSearchValue: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    autoFocus: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    bordered: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    labelInValue: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showArrow: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showSearch: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    virtual: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    treeCheckable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    treeDefaultExpandAll: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    dropdownMatchSelectWidth: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    showCheckedStrategy: {
      type: 'string',
      enum: ['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'SHOW_CHILD',
      },
    },
    treeDefaultExpandedKeys: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
    },
    treeNodeFilterProp: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    treeNodeLabelProp: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    filterTreeNode: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['BOOLEAN', 'EXPRESSION'],
        noCheck: true
      },
    },
    treeDataSimpleMode: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['BOOLEAN', 'EXPRESSION'],
        noCheck: true
      },
    },
    listHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 256,
      },
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'middle',
      },
    },
  },
}
