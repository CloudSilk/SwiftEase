import { ISchema } from '@formily/react'

export const AtaliBigScreenTitleSchema: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '标题',
      }
    },
    titleColor: {
      type: 'string',
      title: '标题颜色',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput'
    },
    titleBeforeColor: {
      type: 'string',
      title: '标题前颜色',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput'
    },
    titleIcon: {
      type: 'string',
      title: '标题Icon',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliImageInput'
    },
  },
}