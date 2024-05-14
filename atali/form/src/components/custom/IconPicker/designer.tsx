import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { MyIconPicker } from './formily';
import { IconPickerLocales } from './locales';
import { IconPickerSchema } from './schema'


export const IconPicker: DnFC<React.ComponentProps<typeof MyIconPicker>> =
    MyIconPicker

IconPicker.Behavior = createBehavior({
    name: 'IconPicker',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'IconPicker',
    designerProps: {
        propsSchema: createFieldSchema(IconPickerSchema),
    },
    designerLocales: IconPickerLocales,
})

IconPicker.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "图标选择",
                "x-decorator": "FormItem",
                "x-component": "IconPicker",
                "x-validator": [],
                "x-component-props": {
                    "showArrow": true,
                    "showSearch": true,
                },
                "x-decorator-props": {},
                "name": "icon",
            },
        },
    ],
})


export default MyIconPicker