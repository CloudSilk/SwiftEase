
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliColorInputSchema } from './schema'
import { AtaliColorInputLocales } from './locales'
import { observer, useField } from '@formily/react'
import { AtaliColorInput as FormilyAtaliColorInput } from './formily'

export const AtaliColorInput: DnFC<any> = observer((props) => {
    const field = useField()
    return <FormilyAtaliColorInput field={field} {...props}> </FormilyAtaliColorInput>
})

AtaliColorInput.Behavior = createBehavior({
    name: 'AtaliColorInput',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliColorInput',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliColorInputSchema),
    },
    designerLocales: AtaliColorInputLocales,
})

AtaliColorInput.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '颜色',
                type: 'string',
                "x-decorator": "FormItem",
                'x-component': 'AtaliColorInput',
                'x-component-props': {
                    title: '颜色选择器',
                },
                "name":"color"
            }
        }
    ]
})

