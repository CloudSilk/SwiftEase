
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliCommonContainerSchema } from './schema'
import { AtaliCommonContainerLocales } from './locales'
import { useField } from '@formily/react'
import { AtaliCommonContainerFormily } from './fomily'

export const AtaliCommonContainer: DnFC<any> = (props) => {
    const field = useField()
    return <AtaliCommonContainerFormily field={field} {...props}>
        {props.children}
    </AtaliCommonContainerFormily>
    // const style = {
    //     margin: 10,
    //     height: 100,
    //     "borderStyle": "solid",
    //     "borderWidth": "1px",
    //     "borderColor": "rgba(221,220,226,1)",
    //     ...props.style,
    //     float: props.styleFloat,
    //     position: props.stylePosition,
    //     top: props.styleTop,
    //     left: props.styleLeft,
    //     right: props.styleRight,
    //     bottom: props.styleBottom,
    //     minHeight: props.minHeight,
    //     maxHeight: props.maxHeight,
    //     minWidth: props.minWidth,
    //     maxWidth: props.maxWidth
    // }
    // if (props.heightGap && props.heightGap > 0) {
    //     style.height = document.body.offsetHeight - props.heightGap
    // }
    // return (
    //     <div {...props} style={style}>
    //         {props.children}
    //     </div>
    // )
}

AtaliCommonContainer.Behavior = createBehavior({
    name: 'AtaliCommonContainer',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliCommonContainer',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliCommonContainerSchema),
    },
    designerLocales: AtaliCommonContainerLocales,
})

AtaliCommonContainer.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: ' ',
                type: 'void',
                'x-component': 'AtaliCommonContainer',
                'x-component-props': {
                    title: 'Title',
                }
            }
        }
    ]
})

