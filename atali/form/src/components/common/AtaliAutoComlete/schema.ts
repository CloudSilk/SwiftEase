import { ISchema } from '@formily/react'

export const AtaliAutoCompleteSchema: ISchema = {
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
    allowClear: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultValue: false,
      },
      description: '支持清除'
    },
    backfill: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultValue: false,
      },
      description: '使用键盘选择的时候把选中项回填到输入框中'
    },
    defaultActiveFirstOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: true,
      },
      description: '是否默认高亮第一个选项	'
    },
    defaultOpen: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
      },
      description: '是否默认展开下拉菜单'
    },
    defaultValue: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        defaultChecked: true,
      },
      description: '指定默认选中的条目'
    },
    disabled: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
      description: "是否禁用"
    },
    dropdownMatchSelectWidth: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultValue: true,
      },
      description: '下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动'
    },
    filterOption: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['BOOLEAN', 'EXPRESSION'],
        noCheck: true
      },
      description: '是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false; function(inputValue, option)'
    },
    getPopupContainer: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位; function(triggerNode)"
    },
    notFoundContent: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: 'Not Found'
      },
      description: "当下拉列表为空时显示的内容"
    },
    open: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
      description: "是否展开下拉菜单"
    },
    // options: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['OBJECT'],
    //     nocheck: true,
    //     defaultValue: []
    //   },
    //   description: '数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能, {label, value}[]'
    // },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
      },
      description: '输入框提示'
    },
    status: {
      type: 'string',
      enum: ['error', 'warning', ''],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: null
      },
    },
    value: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
      },
      description: '指定当前选中的条目'
    },
    onBlur: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "失去焦点时的回调"
    },
    onChange: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "选中 option，或 input 的 value 变化时，调用此函数; function(value)"
    },
    onDropdownVisibleChange: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "展开下拉菜单的回调	; function(open)"
    },
    onFocus: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "获得焦点时的回调; function()"
    },
    onSearch: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "搜索补全项的时候调用; function(value)"
    },
    onSelect: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "被选中时调用，参数为选中项的 value 值; function(value, option)"
    },
    onClear: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
      description: "清除内容时的回调	; function()"
    }
  },
}