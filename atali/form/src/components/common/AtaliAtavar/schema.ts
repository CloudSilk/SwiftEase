import { ISchema } from '@formily/react'

export const AtaliAvatarSchema: ISchema = {
  type: 'object',
  properties: {
    size: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 40
      },
    },
    shape: {
      type: 'string',
      'title': 'shape',
      enum: ["square", "circle"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'circle',
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
      description:""
    },
    crossOrigin: {
      type: 'string',
      'title': '夸域设置',
      enum: ["anonymous", "use-credentials",""],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: '',
      },
    },
  },
}