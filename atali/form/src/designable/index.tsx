// @ts-nocheck
import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from '@swiftease/designable-react'
import { SettingsForm } from '@swiftease/designable-react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@swiftease/designable-core'
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from './widgets'
import { saveSchema } from './service'
import { Inputs, Arrays, Displays, Layouts, CustomerComponents } from '../components'
import { CustomerUpload, DescriptionTextArea, DisplayNameInput, IconPicker, IDInput, AtaliList, MenuTree, MetadataSelect, MonacoInput, NameInput, RoleSelect, TagSelect, UserSelect } from '../components/designer'

import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from '@swiftease/designable-formily-antd'

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Customer: '自定义组件',
      Purchasing: '采购'
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
      AtaliList: 'List'
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

const SaveShortCut = new Shortcut({
  codes: [
    [KeyCode.Meta, KeyCode.S],
    [KeyCode.Control, KeyCode.S],
  ],
  handler(ctx) {
    const list = window.location.href.split("/")
    saveSchema(ctx.engine, list.pop() || "", () => { })
  },
})

const engine = createDesigner({
  shortcuts: [
    SaveShortCut
  ],
  rootComponentName: 'Form',
})

export default (props: any) => {
  return (
    <Designer engine={engine}>
      <StudioPanel actions={<ActionsWidget formID={props?.match?.params?.formID} />}>
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget title="sources.Customer" sources={CustomerComponents} />
            <ResourceWidget title="sources.Inputs" sources={Inputs} />
            <ResourceWidget title="sources.Layouts" sources={Layouts} />
            <ResourceWidget title="sources.Arrays" sources={Arrays} />
            <ResourceWidget title="sources.Displays" sources={Displays} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget
                use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
              />
            </ToolbarPanel>
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
                      Form,
                      Field,
                      Input,
                      Select,
                      TreeSelect,
                      Cascader,
                      Radio,
                      Checkbox,
                      Slider,
                      Rate,
                      NumberPicker,
                      Transfer,
                      Password,
                      DatePicker,
                      TimePicker,
                      Upload,
                      Switch,
                      Text,
                      Card,
                      ArrayCards,
                      ObjectContainer,
                      ArrayTable,
                      Space,
                      FormTab,
                      FormCollapse,
                      FormLayout,
                      FormGrid,
                      CustomerUpload, DescriptionTextArea, DisplayNameInput, 
                      IconPicker, IDInput, AtaliList, MenuTree, MetadataSelect, 
                      MonacoInput, NameInput, RoleSelect, TagSelect, UserSelect
                    }}
                  />
                )}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree) => <MarkupSchemaWidget tree={tree} />}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  )
}
