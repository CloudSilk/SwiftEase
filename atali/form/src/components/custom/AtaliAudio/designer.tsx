
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliAudioSchema } from './schema'
import { AtaliAudioLocales } from './locales'
import { observer, useField } from '@formily/react'
import AtaliAudioComponent from './formily'

export const AtaliAudio: DnFC<any> = observer((props) => {
    const field = useField()
    return <AtaliAudioComponent field={field} {...props}> </AtaliAudioComponent>
})

AtaliAudio.Behavior = createBehavior({
    name: 'AtaliAudio',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliAudio',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliAudioSchema),
    },
    designerLocales: AtaliAudioLocales,
})

AtaliAudio.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '',
                type: 'string',
                "x-decorator": "FormItem",
                'x-component': 'AtaliAudio',
                'x-component-props': {
                    title: '音频',
                },
                "name":"audio"
            }
        }
    ]
})

