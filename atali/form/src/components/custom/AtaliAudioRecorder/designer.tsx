
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AudioRecorderSchema } from './schema'
import { AudioRecorderLocales } from './locales'
import { observer, useField } from '@formily/react'
import AtaliAudioRecorderComponent from './formily'

export const AudioRecorder: DnFC<any> = observer((props) => {
    const field = useField()
    return <AtaliAudioRecorderComponent field={field} {...props}> </AtaliAudioRecorderComponent>
})

AudioRecorder.Behavior = createBehavior({
    name: 'AudioRecorder',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AudioRecorder',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AudioRecorderSchema),
    },
    designerLocales: AudioRecorderLocales,
})

AudioRecorder.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '',
                type: 'string',
                "x-decorator": "FormItem",
                'x-component': 'AudioRecorder',
                'x-component-props': {
                    title: '录音',
                },
                "name":"audio"
            }
        }
    ]
})

