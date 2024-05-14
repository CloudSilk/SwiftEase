import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { RelatedPageInput as FormilyRelatedPageInput } from './formily'
import { RelatedPageInputLocales } from './locales'
import { observer } from '@formily/react'

export const RelatedPageInput: DnFC<any> = observer((props) => {
    // const field = useField()
    return <FormilyRelatedPageInput {...props}></FormilyRelatedPageInput>
  })
// export const RelatedPageInput: DnFC<React.ComponentProps<typeof FormilyRelatedPageInput>> =
//     FormilyRelatedPageInput

//     RelatedPageInput.Behavior = createBehavior(
//     {
//         name: 'RelatedPageInput',
//         extends: ['Field'],
//         selector: (node) => node.props !== undefined && node.props['x-component'] === 'RelatedPageInput',
//         designerProps: {
//             propsSchema: createFieldSchema(RelatedPageInputSchema),
//         },
//         designerLocales: RelatedPageInputLocales,
//     }
// )

RelatedPageInput.Behavior = createBehavior(
    {
      name: 'RelatedPageInput',
      extends: ['Field'],
      selector: (node) => node.props !== undefined && node.props['x-component'] === 'RelatedPageInput',
      designerProps: {
        propsSchema: createFieldSchema({
          type: 'object',
          properties: {
            addonBefore: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              addonAfter: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              prefix: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              suffix: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              allowClear: {
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
              maxLength: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
              },
              placeholder: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              size: {
                type: 'string',
                enum: ['large', 'small', 'middle', ''],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  defaultValue: 'middle',
                },
              },
              relatedPage: {
                title: "弹出的页面",
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'ValueInput',
                'x-component-props': {
                  defaultValue: 'name',
                  include: ['TEXT']
                },
              },
          }
        }),
      },
      designerLocales: RelatedPageInputLocales,
    }
  )

RelatedPageInput.Resource = createResource(
    {
        icon: 'InputSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "点击查询",
                    "type": "string",
                    "x-decorator": "FormItem",
                    "x-component": "RelatedPageInput",
                    "x-validator": [],
                    "x-component-props": {},
                    "x-decorator-props": {},
                    "name": "RelatedPageInput",
                },
            },
        ],
    }
)

export default RelatedPageInput