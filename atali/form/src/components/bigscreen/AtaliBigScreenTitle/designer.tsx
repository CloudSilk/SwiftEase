
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliBigScreenTitleSchema } from './schema'
import { AtaliBigScreenTitleLocales } from './locales'
import { useField } from '@formily/react'
import { AtaliBigScreenTitleFormily } from './fomily'

export const AtaliBigScreenTitle: DnFC<any> = (props) => {
    const field = useField()
    return <div><AtaliBigScreenTitleFormily field={field} {...props}>
    </AtaliBigScreenTitleFormily></div>
}

AtaliBigScreenTitle.Behavior = createBehavior({
    name: 'AtaliBigScreenTitle',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliBigScreenTitle',
    designerProps: {
        propsSchema: createVoidFieldSchema(AtaliBigScreenTitleSchema),
    },
    designerLocales: AtaliBigScreenTitleLocales,
})

AtaliBigScreenTitle.Resource = createResource({
    icon: 'TextSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: ' ',
                type: 'void',
                'x-component': 'AtaliBigScreenTitle',
                'x-component-props': {
                    title: '标题',
                }
            }
        }
    ]
})

