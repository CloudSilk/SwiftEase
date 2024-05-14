import { ISchema } from '@formily/react'

export const AtaliStatisticSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '数值标题',
      },
    },
    precision: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    test: {
      type: 'void',
      title: '测试',
      'x-decorator': 'FormItem',
      'x-component': 'DrawerSetter',
      'x-component-props': {
        text: '打开抽屉',
      },
      properties: {
        test: {
          type: 'string',
          title: '测试输入',
          'x-component': 'Input'
        },
      },
    },
  },
}