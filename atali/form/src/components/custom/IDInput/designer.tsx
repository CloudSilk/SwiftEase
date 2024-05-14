import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { IDInput as FormilyIDInput } from './formily'
import { IDInputLocales } from './locales'
import { IDInputInputSchema } from './schema'

export const IDInput: DnFC<React.ComponentProps<typeof FormilyIDInput>> =
    FormilyIDInput

IDInput.Behavior = createBehavior(
    {
        name: 'IDInput',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'IDInput',
        designerProps: {
            propsSchema: createFieldSchema(IDInputInputSchema),
        },
        designerLocales: IDInputLocales,
    }
)

IDInput.Resource = createResource(
    {
        icon: 'InputSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "ID",
                    "type": "string",
                    "x-decorator": "FormItem",
                    "x-component": "IDInput",
                    "x-validator": [],
                    "x-component-props": {},
                    "x-decorator-props": {},
                    "name": "id",
                },
            },
        ],
    }
)

export default IDInput