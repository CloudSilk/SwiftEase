import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { UserSelectLocales } from './locales'
import { UserSelect as FormilyUserSelect } from './formily'
import { UserSelectSchema } from './schema'
export const UserSelect: DnFC<React.ComponentProps<typeof FormilyUserSelect>> =
    FormilyUserSelect

UserSelect.Behavior = createBehavior({
    name: 'UserSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'UserSelect',
    designerProps: {
        propsSchema: createFieldSchema(UserSelectSchema),
    },
    designerLocales: UserSelectLocales,
})

UserSelect.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "用户",
                "x-decorator": "FormItem",
                "x-component": "UserSelect",
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
                        "run": "$effect(() => {\n  convertSelectData($self,\"/api/core/auth/user/all\",\"nickname\")\n}, [])\n"
                    }
                },
                "name": "userID",
            },
        },
    ],
})