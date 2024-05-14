// @ts-nocheck
import { ISchema } from '@formily/react'

export const AtaliSelectSchema: ISchema = {
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
    defaultValue: {
      type: 'string',
      'x-decorator': 'FormItem',
      // 'x-component': 'AtaliValueInput',
      // 'x-component-props': {
      //   include: ['BOOLEAN', 'EXPRESSION'],
      //   noCheck: true
      // },
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: null
      },
      'x-reactions': [{
        dependencies: [".url", ".labelField", ".idField"],
        when: '{{$deps[0] != ""}}',
        fulfill: {
          run: "$effect(() => {\n  const url = $deps[0]\n  if (!url || url === \"\") return\n  const labelField = $deps[1]\n  if (!labelField || labelField === \"\") labelField = \"name\"\n  const labelFields = labelField.split(\",\")\n  const idField = $deps[2]\n  if (!idField || idField === \"\") idField = \"id\"\n  transformSelectDataLabelAndValue(\n    $self,\n    url,\n    (item) => {\n      return item[idField]\n    },\n    (item) => {\n      const result = []\n      labelFields.forEach((name) => {\n        const value = item[name]\n        if (!value) result.push(\"\")\n        else result.push(value)\n      })\n      return result.join(\"-\")\n    }\n  )\n }, [])\n"
        }
      }]
    },
    mode: {
      type: 'string',
      enum: ['multiple', 'tags', null],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: null,
        optionType: 'button',
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
    dropdownMatchSelectWidth: {
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
    defaultActiveFirstOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
    },
    defaultOpen: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
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
        defaultValue: true,
      },
    },
    filterOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['BOOLEAN', 'EXPRESSION'],
        noCheck: true
      },
    },
    filterSort: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
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
    maxTagCount: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    maxTagPlaceholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    maxTagTextLength: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    notFoundContent: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: 'Not Found',
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