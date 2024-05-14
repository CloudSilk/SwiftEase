import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliSelectLocales } from './locales'
import { AtaliSelect as FormilyAtaliSelect } from './formily'
import { AtaliSelectSchema } from './schema'
import { observer, useField } from '@formily/react'

export const AtaliSelect: DnFC<any> = observer((props) => {
    const field = useField()
    return <FormilyAtaliSelect field={field} {...props}> </FormilyAtaliSelect>
})

AtaliSelect.Behavior = createBehavior({
    name: 'AtaliSelect',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliSelect',
    designerProps: {
        propsSchema: createFieldSchema(AtaliSelectSchema),
    },
    designerLocales: AtaliSelectLocales,
})

AtaliSelect.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "下拉框",
                "x-decorator": "FormItem",
                "x-component": "AtaliSelect",
                "x-validator": [],
                "x-component-props": {
                    "optionFilterProp": "label",
                    "labelField": "name",
                    "idField": "id",
                    "url": "/api/form/all",
                    "allowClear": true,
                    "showSearch": true
                },
                "x-decorator-props": {},
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n const url = $self.componentProps.url\n  if (!url || url === \"\") return\n  const labelField = $self.componentProps.labelField\n  if (!labelField || labelField === \"\") labelField = \"name\"\n  const labelFields = labelField.split(\",\")\n  const idField = $self.componentProps.idField\n  if (!idField || idField === \"\") idField = \"id\"\n  transformSelectDataLabelAndValue(\n    $self,\n    url,\n    (item) => {\n      return item[idField]\n    },\n    (item) => {\n      const result = []\n      labelFields.forEach((name) => {\n        const value = item[name]\n        if (!value) result.push(\"\")\n        else result.push(value)\n      })\n      return result.join(\"-\")\n    }\n  )\n }, [])\n"
                    }
                },
                "name": "id",
            },
        },
    ],
})