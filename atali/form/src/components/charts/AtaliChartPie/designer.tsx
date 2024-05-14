
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliChartPieSchema } from './schema'
import { AtaliChartPieLocales } from './locales'
import './index.less'
import { useField } from '@formily/react'
import { Pie } from '@ant-design/charts'

export const AtaliChartPie: DnFC<any> = (props) => {
    const field = useField()

    const config = {
        ...props,
        //@ts-ignore
        data: field.value ?? [{
            type: '分类一',
            value: 27,
        },
        {
            type: '分类二',
            value: 25,
        },
        {
            type: '分类三',
            value: 18,
        },
        {
            type: '分类四',
            value: 15,
        },
        {
            type: '分类五',
            value: 10,
        },
        {
            type: '其他',
            value: 5,
        }],
    };
    const { appendPaddings } = props
    if (appendPaddings && appendPaddings.length > 0) {
        const list = appendPaddings.split("px")
        config.appendPadding = [
            +list[0], +list[1], +list[2], +list[3]
        ]
    }
    
    return <Pie {...config} />;
}

AtaliChartPie.Behavior = createBehavior({
    name: 'AtaliChartPie',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliChartPie',
    designerProps: {
        propsSchema: createFieldSchema(AtaliChartPieSchema),
    },
    designerLocales: AtaliChartPieLocales,
})

AtaliChartPie.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliChartPie',
                'x-component-props': {
                    title: '饼图',
                    angleField: 'value',
                    colorField: 'type',
                    height:200,
                },
                "x-reactions": {
                    "dependencies": [
                        {
                            "property": "value",
                            "type": "any"
                        }
                    ],
                    "fulfill": {
                        "run": "$effect(() => {\n  $self.setValue([\n    {\n      type: \"分类一\",\n      value: 27,\n    },\n    {\n      type: \"分类二\",\n      value: 25,\n    },\n    {\n      type: \"分类三\",\n      value: 18,\n    },\n    {\n      type: \"分类四\",\n      value: 15,\n    },\n    {\n      type: \"分类五\",\n      value: 10,\n    },\n    {\n      type: \"其他\",\n      value: 5,\n    },\n  ])\n}, [])\n"
                      }
                },
            }
        }
    ]
})

