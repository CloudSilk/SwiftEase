import { ISchema } from '@formily/react'

export const AtaliImageSchema: ISchema = {
  type: 'object',
  properties: {
    width: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultValue: 40,
      },
    },
    height: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultValue: 40
      },
    },
    objectFit: {
      type: 'string',
      'title': 'Object Fit',
      enum: ["fill", "contain", "cover", "inherit", "initial", "none", "revert", "scale-down", "unset"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'fill',
      },
    },
    src: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'title': '地址',
      'x-component-props': {
        defaultValue: '',
      },
      description: ""
    },
    preview: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    isDirect: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    }
  },
}