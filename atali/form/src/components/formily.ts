
import { GlobalRegistry } from '@swiftease/designable-core'
import { createSchemaField } from '@formily/react'

import {
    FormLayout, FormItem, FormGrid, FormButtonGroup, Space,
    Submit, Reset, Input, Password, Select, TreeSelect, DatePicker,
    TimePicker, NumberPicker, Transfer, Cascader, Radio, Checkbox,
    Upload, Switch, ArrayCards, ArrayItems, ArrayTable, ArrayTabs,
    FormCollapse, FormStep, FormTab, Editable, PreviewText, Form
} from '@swiftease/formily-antd-v5'


import { Field,ObjectContainer } from '@swiftease/designable-formily-antd'

import { Card, Slider, Rate } from 'antd'
import React from 'react'
import { customerObject } from './custom'
import { commonObject } from './common'
import { chartObject } from './charts'
import { bigScreenObject }from './bigscreen'

const Text: React.FC<{
    content?: string
    mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ mode, content, ...props }) => {
    const tagName = mode === 'normal' || !mode ? 'div' : mode
    return React.createElement(tagName, props, content)
}


export const AllComponents:any = {
    Form, Field, ArrayItems, ArrayTabs, Editable, 
    FormButtonGroup, FormItem, FormStep, PreviewText, Reset, Submit,
    Input,Password,NumberPicker,Rate,Slider,Select,TreeSelect,Cascader,
    Transfer,Checkbox,Radio,DatePicker,TimePicker,Upload,Switch,
    ObjectContainer,Card,FormGrid,FormTab,FormLayout,FormCollapse,Space, 
    ArrayCards, ArrayTable,Text,
    ...customerObject,
    ...commonObject,
    ...chartObject,
    ...bigScreenObject
}

export function newSchemaField(components: any) {
    return createSchemaField({
        components: {
            ...AllComponents,
            ...components
        },
    })
}


GlobalRegistry.registerDesignerLocales({
    'zh-CN': {
      sources: {
        Common:'常用组件',
        Charts:'图表组件',
        Inputs: '输入控件',
        Layouts: '布局组件',
        Arrays: '自增组件',
        Customer: '自定义组件',
        Purchasing: '采购',
        Displays: '展示组件',
        BigScreens: '大屏组件',
      },
      Components: {
        LocationSelect: '空间位置',
        MonacoInput: '代码控件',
        MetadataSelect: '元数据',
        UserSelect: '用户选择框',
        RoleSelect: '角色选择框',
        NameInput: '名称',
        DisplayNameInput: '显示名称',
        CategorySelect: '品类',
        TagSelect: '标签',
        DescriptionTextArea: {
          title: '描述',
          TextArea: '描述'
        },
        IconPicker: '图标',
        MenuTree: '菜单选择',
        IDInput: 'ID',
        CustomerArrayTable: '自增表格',
        VendorSelect: '供应商',
        ProductSelect: '产品',
        AtaliList: 'List',
        AtaliButton: '按钮',
      }
    },
    'en-US': {
      sources: {
        Inputs: 'Inputs',
        Layouts: 'Layouts',
        Arrays: 'Arrays',
        Customer: 'Customer',
        Purchasing: 'Purchasing'
      },
      Components: {
        LocationSelect: 'Select Location',
        MonacoInput: 'Code',
        MetadataSelect: 'Select Metadata',
        UserSelect: 'Select User',
        RoleSelect: 'Select Role',
        NameInput: 'Name',
        DisplayNameInput: 'Display Name',
        CategorySelect: 'Select Category',
        TagSelect: 'Select Tag',
        DescriptionTextArea: {
          title: 'Description',
          TextArea: 'Description'
        },
        IconPicker: 'Picker Icon',
        MenuTree: 'Select Menu',
        IDInput: 'ID',
        CustomerArrayTable: 'Customer Table',
        VendorSelect: 'Select Vendor',
        ProductSelect: 'Select Product',
        AtaliList: 'List'
      }
    },
  })