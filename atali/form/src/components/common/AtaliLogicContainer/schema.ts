import { ISchema } from '@formily/react'

export const AtaliLogicContainerSchema: ISchema = {
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
    styleZIndex: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    heightGap: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      description:"大于0时，组件高度=页面高度-设置的值",
      'x-component-props': {
      },
    },
    minHeight:{
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    maxHeight:{
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    minWidth:{
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    maxWidth:{
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    }
  },
}