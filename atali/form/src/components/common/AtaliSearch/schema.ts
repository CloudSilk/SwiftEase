import { ISchema } from '@formily/react'

export const SearchSchema: ISchema & { Group?: ISchema } = {
  type: 'object',
  properties: {
    // isFormDrawer: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: false,
    //   },
    // },
    // isArrayTable: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
    // title: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     defaultValue: '按钮',
    //   },
    // },
    // formTitle: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     defaultValue: '编辑',
    //   },
    // },
    // showTitle: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
    // showIcon: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: true,
    //   },
    // },
    action: {
      type: 'number',
      'title': '类型',
      enum: [
        // {
      //   "label": "新增",
      //   "value": 1
      // }, 
      {
        "label": "更新",
        "value": 2
      }, 
      // {
      //   "label": "删除",
      //   "value": 3
      // }, {
      //   "label": "查询",
      //   "value": 4
      // }, {
      //   "label": "预览",
      //   "value": 5
      // }, {
      //   "label": "设计",
      //   "value": 6
      // }, {
      //   "label": "下载",
      //   "value": 7
      // }, {
      //   "label": "复制",
      //   "value": 8
      // }
    ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 2,
      },
    },
    // parentPath: {
    //   type: 'string',
    //   title: '表单数据字段',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     defaultValue: '',
    //   },
    // },
    // parentFieldName: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'title': '父字段名',
    //   'x-component-props': {
    //     defaultValue: '',
    //   },
    // },
    httpMethod: {
      type: 'string',
      'title': 'Http方法',
      enum: ["GET", "POST", "PUT", "DELETE"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'POST',
      },
    },
    // submitUrl: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'title': 'Url',
    //   'x-component-props': {
    //     defaultValue: '',
    //   },
    // },
    multipleChoice: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'title': '是否多选',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    detailUrl: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'title': '获取详情Url',
      'x-component-props': {
        defaultValue: '',
      },
    },
    idField:{
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        required: true
      },
      'x-component': 'Input',
      'title': '请求ID字段名',
      'x-component-props':{
        defaultValue: '',
        required: true,
      }
    },
    labelField1:{
      type: 'string',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        required: true
      },
      'x-component': 'Input',
      'title': '标签字段1',
      'x-component-props':{
        defaultValue: '',
        required: true,
      }
    },
    labelField2:{
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'title': '标签字段2',
      'x-component-props':{
        defaultValue: '',
        required: true,
      }
    },
    // indexPosition: {
    //   type: 'number',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'NumberPicker',
    //   'x-component-props': {
    //     defaultValue: 0,
    //   },
    //   description: "当前行在Formily.Field.indexes数组中的索引下标"
    // },
    formID: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      "x-component-props": {
        "optionFilterProp": "label",
        "showArrow": true,
        "showSearch": true
      },
      "x-reactions": {
        "dependencies": [
          {
            "property": "value",
            "type": "any"
          }
        ],
        "fulfill": {
          "run": "$effect(() => {\n  convertSelectDataLabel($self,\"/api/form/all?subform=1\",item=>item.pageName+'-'+item.name)\n}, [])\n"
        }
      },
      description: "只能选到子表单"
    },
    // placement: {
    //   type: 'string',
    //   enum: ["top", "right", "bottom", "left"],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'right',
    //   },
    // },
    click: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'AtaliValueInput',
      'x-component-props': {
        include: ['EXPRESSION'],
        noCheck: true
      },
    },
    formWidth: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 1200,
      },
    },
    formHeight: {
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 1200,
      },
    },
    // onClose: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['EXPRESSION'],
    //     noCheck: true
    //   },
    // },
    // submit: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['EXPRESSION'],
    //     noCheck: true
    //   },
    // },
    // submitSuccessed: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['EXPRESSION'],
    //     noCheck: true
    //   },
    // },
    // submitFailed: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['EXPRESSION'],
    //     noCheck: true
    //   },
    // },
    // initFn: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'AtaliValueInput',
    //   'x-component-props': {
    //     include: ['EXPRESSION'],
    //     noCheck: true
    //   },
    // },
    // htmlType: {
    //   type: 'string',
    //   enum: ['button', 'submit', 'reset'],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'button',
    //   },
    // },
    // type: {
    //   type: 'string',
    //   enum: ["default", "primary", "ghost", "dashed", "link", "text"],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'default',
    //   },
    // },
    // icon: {
    //   type: 'string',
    //   enum: ["default", "primary", "ghost", "dashed", "link", "text"],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'default',
    //   },
    // },
    // shape: {
    //   type: 'string',
    //   enum: ["default", "circle", "round"],
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Select',
    //   'x-component-props': {
    //     defaultValue: 'default',
    //   },
    // },
    size: {
      type: 'string',
      enum: ["large", "middle", "small"],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'middle',
      },
    },

    block: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        defaultChecked: false,
      },
    },
    // danger: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch',
    //   'x-component-props': {
    //     defaultChecked: false,
    //   },
    // },
    // href: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     defaultValue: '',
    //   },
    // },
    // target: {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {
    //     defaultValue: '',
    //   },
    // }
  },
}
