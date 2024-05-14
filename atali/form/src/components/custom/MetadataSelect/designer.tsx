import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema, AllSchemas } from '@swiftease/designable-formily-antd'
import { MetadataSelect as FormilyMetadataSelect } from './formily'
import { MetadataSelectLocales } from './locales'

export const MetadataSelect: DnFC<React.ComponentProps<typeof FormilyMetadataSelect>> =
    FormilyMetadataSelect

MetadataSelect.Behavior = createBehavior({
    name: 'MetadataSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'MetadataSelect',
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.TreeSelect),
    },
    designerLocales: MetadataSelectLocales,
})

MetadataSelect.Resource = createResource({
    icon: 'TreeSelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '元数据',
                'x-decorator': 'FormItem',
                'x-component': 'MetadataSelect',
                "x-component-props": {
                    "labelInValue": false,
                    "showArrow": true,
                    "showSearch": true,
                    "treeNodeLabelProp": "name",
                    "treeNodeFilterProp": "name"
                },
                "name": "metadataID",
                "x-reactions": {
                    "dependencies": [
                        {
                            "property": "value",
                            "type": "any"
                        }
                    ],
                    "fulfill": {
                        "run": "$effect(() => {\n  convertTreeData($self, \"/api/curd/metadata/tree\")\n}, [])\n"
                    }
                },
            },
        },
    ],
})

export default MetadataSelect