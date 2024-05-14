
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC, DroppableWidget } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliTooltipSchema } from './schema'
import { AtaliTooltipLocales } from './locales'
import { Tooltip } from 'antd'

export const AtaliTooltip: DnFC<any> = (props) => {
    const style = {
        float: props.styleFloat,
        position: props.stylePosition,
        top: props.styleTop,
        left: props.styleLeft,
        right: props.styleRight,
        bottom: props.styleBottom,
    }
    return (
        <Tooltip {...props} title={
            <div style={{ width: 200 }}>{props.content}</div>
        }>
            <div style={style}>{props.children ?? <DroppableWidget></DroppableWidget>}</div>
        </Tooltip>
    )
}

AtaliTooltip.Behavior = createBehavior({
    name: 'AtaliTooltip',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliTooltip',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliTooltipSchema),
    },
    designerLocales: AtaliTooltipLocales,
})

AtaliTooltip.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: ' ',
                type: 'void',
                'x-component': 'AtaliTooltip',
                'x-component-props': {
                    title: '提示标题',
                    content: '提示内容',
                    trigger: 'hover',
                    placement: 'right'
                }
            }
        }
    ]
})

