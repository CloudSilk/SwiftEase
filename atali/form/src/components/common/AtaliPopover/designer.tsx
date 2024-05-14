
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC, DroppableWidget } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliPopoverSchema } from './schema'
import { AtaliPopoverLocales } from './locales'
import { Popover } from 'antd'

export const AtaliPopover: DnFC<any> = (props) => {
    const style = {
        float: props.styleFloat,
        position: props.stylePosition,
        top: props.styleTop,
        left: props.styleLeft,
        right: props.styleRight,
        bottom: props.styleBottom,
    }
    return (
        <Popover {...props} content={
            <div style={{width:200}}>{props.content}</div>
        }>
            <div style={style}>{props.children ?? <DroppableWidget></DroppableWidget>}</div>
        </Popover>
    )
}

AtaliPopover.Behavior = createBehavior({
    name: 'AtaliPopover',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliPopover',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliPopoverSchema),
    },
    designerLocales: AtaliPopoverLocales,
})

AtaliPopover.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: ' ',
                type: 'void',
                'x-component': 'AtaliPopover',
                'x-component-props': {
                    title: '卡片标题',
                    trigger: 'hover',
                    content: '卡片内容',
                    placement: 'right'
                }
            }
        }
    ]
})

