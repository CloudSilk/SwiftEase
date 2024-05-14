
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliEditorSchema } from './schema'
import { AtaliEditorLocales } from './locales'
import { observer, useField } from '@formily/react'
import AtaliEditorComponent from './editor/index'

export const AtaliEditor: DnFC<any> = observer((props) => {
    const field = useField()
    return <AtaliEditorComponent field={field} {...props}> </AtaliEditorComponent>
})

AtaliEditor.Behavior = createBehavior({
    name: 'AtaliEditor',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliEditor',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliEditorSchema),
    },
    designerLocales: AtaliEditorLocales,
})

AtaliEditor.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '',
                type: 'string',
                "x-decorator": "FormItem",
                'x-component': 'AtaliEditor',
                'x-component-props': {
                    title: '块编辑器',
                },
                "name":"editor"
            }
        }
    ]
})

