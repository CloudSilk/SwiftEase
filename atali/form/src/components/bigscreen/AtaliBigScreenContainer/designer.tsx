
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliBigScreenContainerSchema } from './schema'
import { AtaliBigScreenContainerLocales } from './locales'
import { useField } from '@formily/react'
import { AtaliBigScreenContainerFormily } from './fomily'

export const AtaliBigScreenContainer: DnFC<any> = (props) => {
    const field = useField()
    return <AtaliBigScreenContainerFormily field={field} {...props}>
        {props.children}
    </AtaliBigScreenContainerFormily>
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

AtaliBigScreenContainer.Behavior = createBehavior({
    name: 'AtaliBigScreenContainer',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliBigScreenContainer',
    designerProps: {
        droppable: true,
        propsSchema: createVoidFieldSchema(AtaliBigScreenContainerSchema),
    },
    designerLocales: AtaliBigScreenContainerLocales,
})

AtaliBigScreenContainer.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: ' ',
                type: 'void',
                'x-component': 'AtaliBigScreenContainer',
                'x-component-props': {
                    title: 'Title',
                }
            }
        }
    ]
})

