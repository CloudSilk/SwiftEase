import { ISchema } from '@formily/react'

export const AtaliCarouselSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '走马灯',
      },
    },
    content: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        defaultValue: '提示内容',
      },
    },
    color: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'ColorInput',
      'x-component-props': {
      },
    },
    placement: {
      type: 'string',
      enum: ['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'right',
      },
    },
    trigger: {
      type: 'string',
      enum: ["hover", "focus", "click", "contextMenu"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'hover',
      },
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
    styleHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'SizeInput',
      'x-component-props': {
        defaultValue: 40
      },
    },
  },
}