import { ISchema } from '@formily/react'

export const AtaliBigScreenContainerSchema: ISchema & { Addition?: ISchema } = {
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
    stylePosition: {
      type: 'string',
      enum: ["absolute", "fixed", "inherit", "initial", "relative", "revert"],
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
      description: "大于0时，组件高度=页面高度-设置的值",
      'x-component-props': {
      },
    },
    minHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    maxHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    minWidth: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    },
    maxWidth: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
      },
    }
  },
}