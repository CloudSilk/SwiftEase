
import { DnFC } from '@swiftease/designable-react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { MonacoInputLocales } from './locales'
import { AtaliMonacoInput as FormilyAtaliMonacoInput } from './formily'
import './styles.less'
import { observer, useField } from '@formily/react'


export const AtaliMonacoInput: DnFC<any> = observer((props) => {
  const field = useField()
  return <FormilyAtaliMonacoInput field={field} {...props}> </FormilyAtaliMonacoInput>
})

AtaliMonacoInput.Behavior = createBehavior(
  {
    name: 'MonacoInput',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'MonacoInput',
    designerProps: {
      propsSchema: createFieldSchema({
        type: 'object',
        properties: {
          checkSyntax: {
            type: 'boolean',
            title: '校验语法',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
              "defaultValue": false,
            }
          },
          language: {
            "type": 'string',
            "title": 'Language',
            "enum": ["javascript", "typescript", "json", "go","markdown","dockerfile","plaintext"],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              "defaultValue": "typescript"
            }
          },
          height: {
            "type": 'number',
            "title": '高度',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
              "defaultValue": 400
            }
          },
          checker: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
              include: ['EXPRESSION'],
              noCheck: true
            },
          },
        }
      }),
    },
    designerLocales: MonacoInputLocales,
  }
)

AtaliMonacoInput.Resource = createResource(
  {
    icon: 'InputSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          title: '代码',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'MonacoInput',
          'x-component-props': {
            'language': 'typescript',
            'height': 400,
            'className': 'dn-monaco-input',
            'checkSyntax': false,
            'checker': undefined,
          }
        },
      },
    ],
  }
)