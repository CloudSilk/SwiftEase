import React from 'react'
import { NameInput as FormilyNameInput } from './formily'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { NameInputLocales } from './locales'
import { NameInputSchema } from './schema'
export const NameInput: DnFC<React.ComponentProps<typeof FormilyNameInput>> =
FormilyNameInput

NameInput.Behavior = createBehavior(
    {
        name: 'NameInput',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'NameInput',
        designerProps: {
            propsSchema: createFieldSchema(NameInputSchema),
        },
        designerLocales: NameInputLocales,
    }
)

NameInput.Resource = createResource(
    {
        icon: 'InputSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "名称",
                    "type": "string",
                    "x-decorator": "FormItem",
                    "x-component": "NameInput",
                    "x-validator": [],
                    "x-component-props": {},
                    "x-decorator-props": {},
                    "name": "name"
                }
            }
        ]
    }
)

export default NameInput