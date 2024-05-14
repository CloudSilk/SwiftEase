
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliAvatarSchema } from './schema'
import { AtaliAvatarLocales } from './locales'
import { Avatar } from 'antd'
import { useField } from '@formily/react'

export const AtaliAvatar: DnFC<any> = (props) => {
    const field = useField()
    let src = field['value']
    if (src && src != "") {
        src = "/api/core/file/download?id=" + src
    } else {
        src = props.src
    }
    return (
        <Avatar {...props} src={src} />
    )
}

AtaliAvatar.Behavior = createBehavior({
    name: 'AtaliAvatar',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliAvatar',
    designerProps: {
        propsSchema: createVoidFieldSchema(AtaliAvatarSchema),
    },
    designerLocales: AtaliAvatarLocales,
})

AtaliAvatar.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title:'头像',
                "x-decorator": "FormItem",
                'x-component': 'AtaliAvatar',
                'x-component-props': {
                }
            }
        }
    ]
})

