import { ISchema } from '@formily/react'

export const AtaliAlertSchema: ISchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        defaultValue: '提示内容',
      },
    },
    description: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        defaultValue: '警告提示',
      },
      description: '警告提示的辅助性文字介绍'
    },
    closable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    closeText: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
      },
    },
    showIcon: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    banner: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
      description: "是否用作顶部公告"
    },
    type: {
      type: 'string',
      enum: ['success', 'info', 'warning', 'error'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'success',
      },
    },
    onClose: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
    },
    afterClose: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "关闭动画结束后触发的回调函数"
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
  },
}