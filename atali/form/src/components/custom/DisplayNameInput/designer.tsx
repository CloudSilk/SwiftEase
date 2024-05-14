import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { DisplayNameInput as FormilyDisplayNameInput } from './formily'
import { DisplayNameInputLocales } from './locales'
import { DisplayNameInputSchema } from './schema'

export const DisplayNameInput: DnFC<React.ComponentProps<typeof FormilyDisplayNameInput>> =
    FormilyDisplayNameInput

DisplayNameInput.Behavior = createBehavior(
    {
        name: 'DisplayNameInput',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'DisplayNameInput',
        designerProps: {
            propsSchema: createFieldSchema(DisplayNameInputSchema),
        },
        designerLocales: DisplayNameInputLocales,
    }
)

DisplayNameInput.Resource = createResource(
    {
        icon: 'InputSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "显示名称",
                    "type": "string",
                    "x-decorator": "FormItem",
                    "x-component": "DisplayNameInput",
                    "x-validator": [],
                    "x-component-props": {},
                    "x-decorator-props": {},
                    "name": "displayName",
                },
            },
        ],
    }
)

export default DisplayNameInput