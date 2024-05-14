import { useField, observer } from '@formily/react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliList as FormilyList } from './formily';
import { AtaliListLocales } from './locales';

export const AtaliList: DnFC<any> = observer((props) => {
  const field = useField()
  return <FormilyList field={field} {...props}></FormilyList>
})

AtaliList.Behavior = createBehavior(
  {
    name: 'AtaliList',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliList',
    designerProps: {
      propsSchema: createFieldSchema({
        type: 'object',
        properties: {
          labelFieldName: {
            title: "Title字段名",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
              defaultValue: 'name',
              include: ['TEXT']
            },
          },
          tempFieldName: {
            title: "临时对象字段",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
              defaultValue: 'tempField',
              include: ['TEXT']
            },
          },
          descriptionFieldName: {
            title: "描述字段名",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
              defaultValue: 'description',
              include: ['TEXT']
            },
          },
          avatarFieldName: {
            title: "头像字段名",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
              defaultValue: 'avatar',
              include: ['TEXT']
            },
          },
          contentFieldName: {
            title: "Content字段名",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
              defaultValue: 'content',
              include: ['TEXT']
            },
          },
          defaultValue: {
            title: "新增默认值",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              defaultValue: '{"name":"test"}',
              include: ['TEXT']
            },
          },
          headerTitle: {
            title: "标题",
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              defaultValue: '标题',
              include: ['TEXT']
            },
          },
        }
      }),
    },
    designerLocales: AtaliListLocales,
  }
)

AtaliList.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          "type": "Array",
          "x-decorator": "FormItem",
          "x-component": "AtaliList",
          "name": "list",
          "title": "List",
          "x-component-props": {
            "tempFieldName": "tempField",
            "labelFieldName": "name",
            "defaultValue": '{"name":"test"}',
            "headerTitle": '标题',
            "descriptionFieldName": 'description',
            "avatarFieldName": 'avatar'
          },
        },
      },
    ],
  }
)