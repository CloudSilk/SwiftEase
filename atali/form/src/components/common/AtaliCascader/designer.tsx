import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliCascaderLocales } from './locales'
import { AtaliCascader as FormilyAtaliCascader } from './formily'
import { AtaliCascaderSchema } from './schema'

export const AtaliCascader: DnFC<React.ComponentProps<typeof FormilyAtaliCascader>> = FormilyAtaliCascader

AtaliCascader.Behavior = createBehavior({
    name: 'AtaliCascader',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliCascader',
    designerProps: {
        propsSchema: createFieldSchema(AtaliCascaderSchema),
    },
    designerLocales: AtaliCascaderLocales,
})

AtaliCascader.Resource = createResource({
    icon: 'CascaderSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "级联",
                "x-decorator": "FormItem",
                "x-component": "AtaliCascader",
                "x-validator": [],
                "x-component-props": {
                    "optionFilterProp": "label",
                    "labelField": "name",
                    "idField": "id",
                    "url": "/api/aiot/region/tree",
                    "allowClear": true,
                    "showSearch": true,
                    "showArrow": true
                },
                "x-decorator-props": {},
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n  const url = $self.componentProps.url\n  if (!url || url === \"\") return\n  const labelField = $self.componentProps.labelField\n  if (!labelField || labelField === \"\") labelField = \"name\"\n  const labelFields = labelField.split(\",\")\n  const idField = $self.componentProps.idField\n  if (!idField || idField === \"\") idField = \"id\"\n  convertTreeDataLableAndValue(\n    $self,\n    url,\n    (item) => {\n      return item[idField]\n    },\n    (item) => {\n      const result = []\n      labelFields.forEach((name) => {\n        const value = item[name]\n        if (!value) result.push(\"\")\n        else result.push(value)\n      })\n      return result.join(\"-\")\n    }\n  )\n}, [])\n"
                    }
                },
                "name": "parentIDs",
            },
        },
    ],
})