
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliImageSchema } from './schema'
import { AtaliImageLocales } from './locales'
import { useField } from '@formily/react'
import { Image } from "antd"

export const AtaliImage: DnFC<any> = (props) => {
    const field = useField()
    let src = field['value']
    if (src && src != "") {
        src = (props.isDirect ? "" : "/api/core/file/download?id=") + src
    } else {
        src = props.src
    }
    return (
        <Image {...props} src={src} style={
            {
                objectFit: props.objectFit
            }
        } />
    )
}

AtaliImage.Behavior = createBehavior({
    name: 'AtaliImage',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliImage',
    designerProps: {
        propsSchema: createFieldSchema(AtaliImageSchema),
    },
    designerLocales: AtaliImageLocales,
})

AtaliImage.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '图片',
                "x-decorator": "FormItem",
                'x-component': 'AtaliImage',
                'x-component-props': {
                    width: "80px",
                    height: "80px",
                    objectFit: 'fill',
                    preview: false
                }
            }
        }
    ]
})

