import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { RoleSelectLocales } from './locales'
import { RoleSelect as FormilyRoleSelect } from './formily'
import { RoleSelectSchema } from './schema'

export const RoleSelect: DnFC<React.ComponentProps<typeof FormilyRoleSelect>> =
    FormilyRoleSelect

RoleSelect.Behavior = createBehavior({
    name: 'RoleSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'RoleSelect',
    designerProps: {
        propsSchema: createFieldSchema(RoleSelectSchema),
    },
    designerLocales: RoleSelectLocales,
})

RoleSelect.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "角色",
                "x-decorator": "FormItem",
                "x-component": "RoleSelect",
                "x-validator": [],
                "x-component-props": {
                    "optionFilterProp": "label"
                },
                "x-decorator-props": {},
                "x-reactions": {
                    "dependencies": [
                        {
                            "property": "value",
                            "type": "any"
                        }
                    ],
                    "fulfill": {
                        "run": "$effect(() => {\n  convertSelectData($self, \"/api/core/auth/role/all\", \"name\")\n}, [])\n"
                    }
                },
                "name": "roleID",
            },
        },
    ],
})

export default RoleSelect