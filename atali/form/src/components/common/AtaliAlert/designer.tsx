
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliAlertSchema } from './schema'
import { AtaliAlertLocales } from './locales'
import { Alert } from 'antd'

export const AtaliAlert: DnFC<any> = (props) => {
    const style = {
        float: props.styleFloat,
        position: props.stylePosition,
        top: props.styleTop,
        left: props.styleLeft,
        right: props.styleRight,
        bottom: props.styleBottom,
    }
    return (
        <Alert {...props} style={style} />
    )
}

AtaliAlert.Behavior = createBehavior({
    name: 'AtaliAlert',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliAlert',
    designerProps: {
        propsSchema: createVoidFieldSchema(AtaliAlertSchema),
    },
    designerLocales: AtaliAlertLocales,
})

AtaliAlert.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'void',
                'x-component': 'AtaliAlert',
                'x-component-props': {
                    description: '警告提示的辅助性文字介绍',
                    message: '提示标题',
                    type: 'success',
                    showIcon: true,
                    closable: true,
                    banner: false
                }
            }
        }
    ]
})

