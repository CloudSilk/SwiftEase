import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { DescriptionTextArea as FormlitDescriptionTextArea } from './formily'
import { DescriptionTextAreaLocales } from './locales'
import { DescriptionTextAreaSchema } from './schema'

export const DescriptionTextArea: DnFC<React.ComponentProps<typeof FormlitDescriptionTextArea>> =
    FormlitDescriptionTextArea

DescriptionTextArea.Behavior = createBehavior(
    {
        name: 'DescriptionTextArea',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'DescriptionTextArea.TextArea',
        designerProps: {
            propsSchema: createFieldSchema(DescriptionTextAreaSchema.TextArea),
        },
        designerLocales: DescriptionTextAreaLocales,
    }
)

DescriptionTextArea.Resource = createResource(
    {
        icon: 'TextAreaSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "描述",
                    "type": "string",
                    "x-decorator": "FormItem",
                    "x-component": "DescriptionTextArea.TextArea",
                    "x-validator": [],
                    "x-component-props": {},
                    "x-decorator-props": {},
                    "name": "description",
                },
            },
        ],
    }
)

export default DescriptionTextArea