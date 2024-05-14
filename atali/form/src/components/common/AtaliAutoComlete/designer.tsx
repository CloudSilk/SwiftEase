
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliAutoCompleteSchema } from './schema'
import { AtaliAutoCompleteLocales } from './locales'
import FormilyAutoComplete from './formily'
import { observer, useField } from '@formily/react'

export const AtaliAutoComplete: DnFC<any> = observer((props) => {
    const field = useField()
    return <FormilyAutoComplete field={field} {...props}> </FormilyAutoComplete>
})

AtaliAutoComplete.Behavior = createBehavior({
    name: 'AtaliAutoComplete',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliAutoComplete',
    designerProps: {
        propsSchema: createFieldSchema(AtaliAutoCompleteSchema),
    },
    designerLocales: AtaliAutoCompleteLocales,
})

AtaliAutoComplete.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "自动完成",
                "x-decorator": "FormItem",
                'x-component': 'AtaliAutoComplete',
                "x-validator": [],
                'x-component-props': {
                    "url": "/api/form/all",
                    "labelField": "name",
                    "idField": "id",
                    "allowClear": true,
                    "placeholder": "输入后自动搜索"
                },
                "x-decorator-props": {},
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n const url = $self.componentProps.url\n  if (!url || url === \"\") return\n  let labelField = $self.componentProps.labelField\n  if (!labelField || labelField === \"\") labelField = \"name\"\n  let labelFields = labelField.split(\",\")\n  let idField = $self.componentProps.idField\n  if (!idField || idField === \"\") idField = \"id\"\n  transformSelectDataLabelAndValue(\n    $self,\n    url,\n    (item) => {\n      return item[idField]\n    },\n    (item) => {\n      const result = []\n      labelFields.forEach((name) => {\n        const value = item[name]\n        if (!value) result.push(\"\")\n        else result.push(value)\n      })\n      return result.join(\"-\")\n    }\n  )\n}, [])\n"
                    }
                }
            }
        }
    ]
})

