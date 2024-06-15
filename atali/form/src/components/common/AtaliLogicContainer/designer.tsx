
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliLogicContainerSchema } from './schema'
import { AtaliLogicContainerLocales } from './locales'
import { useField } from '@formily/react'
import { AtaliLogicContainerFormily } from './fomily'

export const AtaliLogicContianer: DnFC<any> = (props) => {
    const field = useField()
    return <AtaliLogicContainerFormily field={field} {...props}>
        {/* {props.children} */}
    </AtaliLogicContainerFormily>
}

AtaliLogicContianer.Behavior = createBehavior({
    name: 'AtaliLogicContianer',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliLogicContianer',
    designerProps: {
        draggable: true,
        propsSchema: createFieldSchema(AtaliLogicContainerSchema),
    },
    designerLocales: AtaliLogicContainerLocales,
})

AtaliLogicContianer.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: '逻辑运算',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliLogicContianer',
                'x-component-props': {
                    title: 'Title'
                }
            }
        }
    ]
})

