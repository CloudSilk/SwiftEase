import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliTreeSelectLocales } from './locales'
import { AtaliTreeSelect as FormilyAtaliTreeSelect } from './formily'
import { AtaliTreeSelectSchema } from './schema'
import { observer, useField } from '@formily/react'

export const AtaliTreeSelect: DnFC<any> = observer((props) => {
    const field = useField()
    return <FormilyAtaliTreeSelect field={field} {...props}> </FormilyAtaliTreeSelect>
})

AtaliTreeSelect.Behavior = createBehavior({
    name: 'AtaliTreeSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliTreeSelect',
    designerProps: {
        propsSchema: createFieldSchema(AtaliTreeSelectSchema),
    },
    designerLocales: AtaliTreeSelectLocales,
})

AtaliTreeSelect.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "树选择",
                "x-decorator": "FormItem",
                "x-component": "AtaliTreeSelect",
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
                "name": "parentID",
            },
        },
    ],
})