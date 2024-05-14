import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { TagSelectLocales } from './locales'
import { TagSelect as FormilyTagSelect } from './formily'
import { TagSelectSchema } from './schema'

export const TagSelect: DnFC<React.ComponentProps<typeof FormilyTagSelect>> =
    FormilyTagSelect

TagSelect.Behavior = createBehavior({
    name: 'TagSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'TagSelect',
    designerProps: {
        propsSchema: createFieldSchema(TagSelectSchema),
    },
    designerLocales: TagSelectLocales,
})

TagSelect.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "标签",
                "x-decorator": "FormItem",
                "x-component": "TagSelect",
                "x-validator": [],
                "x-component-props": {
                    "mode": "multiple",
                    "showSearch": true,
                    "optionFilterProp": "label",
                    "showArrow": true
                },
                "x-decorator-props": {},
                "name": "newTags",
                "enum": [
                    {
                        "children": [],
                        "label": "集团",
                        "value": "Group"
                    },
                    {
                        "children": [],
                        "label": "工厂",
                        "value": "Factory"
                    },
                    {
                        "children": [],
                        "label": "车间",
                        "value": "Workshop"
                    },
                    {
                        "children": [],
                        "label": "国家",
                        "value": "Country"
                    },
                    {
                        "children": [],
                        "label": "省份",
                        "value": "Province"
                    },
                    {
                        "children": [],
                        "label": "城市",
                        "value": "City"
                    },
                    {
                        "children": [],
                        "label": "区县",
                        "value": "County"
                    },
                    {
                        "children": [],
                        "label": "园区",
                        "value": "Park"
                    },
                    {
                        "children": [],
                        "label": "楼栋",
                        "value": "Building"
                    },
                    {
                        "children": [],
                        "label": "楼层",
                        "value": "Floor"
                    },
                    {
                        "children": [],
                        "label": "区域",
                        "value": "Area"
                    }
                ],
                "x-index": 3,
                "x-reactions": {
                    "dependencies": [
                        {
                            "property": "value",
                            "type": "any",
                            "source": "id",
                            "name": "id"
                        }
                    ],
                    "fulfill": {
                        "run": "$effect(() => {\n  convertTags($deps,$self, \"categoryTags\", \"tag\")\n}, [$deps.id])\n"
                    }
                }
            },
        },
    ],
})

export default TagSelect