
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliStatisticSchema } from './schema'
import { AtaliStatisticLocales } from './locales'
import { Statistic } from 'antd'

export const AtaliStatistic: DnFC<any> = (props) => {
    return (
        <div>
            <Statistic {...props} valueStyle={{color:props?.style?.color}} style={{ ...props.style,margin: 10 }}>
            </Statistic>
        </div>

    )
}

AtaliStatistic.Behavior = createBehavior({
    name: 'AtaliStatistic',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliStatistic',
    designerProps: {
        propsSchema: createFieldSchema(AtaliStatisticSchema),
    },
    designerLocales: AtaliStatisticLocales,
})

AtaliStatistic.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                "x-decorator": "FormItem",
                'x-component': 'AtaliStatistic',
                'x-component-props': {
                    title: '统计数值11',
                },
                "name": "id",
                "default":1000
            },

        }
    ]
})

