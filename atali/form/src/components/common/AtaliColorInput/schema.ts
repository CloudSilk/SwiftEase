import { ISchema } from '@formily/react'

export const AtaliColorInputSchema: ISchema & { Addition?: ISchema } = {
  type: 'object',
  properties: {
    stylePosition: {
      type: 'string',
      enum: ["absolute", "fixed","inherit","initial","relative","revert"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        "allowClear": true
      },
    },
    styleFloat: {
      type: 'string',
      enum: ["left", "right"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        "allowClear": true
      },
    },
    styleTop: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    styleLeft: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    styleRight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    styleBottom: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
  },
}