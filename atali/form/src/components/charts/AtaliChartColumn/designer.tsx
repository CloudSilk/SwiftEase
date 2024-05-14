
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliChartColumnSchema } from './schema'
import { AtaliChartColumnLocales } from './locales'
import './index.less'
import { useField } from '@formily/react'
import { Column } from '@ant-design/charts'

const testData = [
    {
        type: '家具家电',
        sales: 38,
    },
    {
        type: '粮油副食',
        sales: 52,
    },
    {
        type: '生鲜水果',
        sales: 61,
    },
    {
        type: '美容洗护',
        sales: 145,
    },
    {
        type: '母婴用品',
        sales: 48,
    },
    {
        type: '进口食品',
        sales: 38,
    },
    {
        type: '食品饮料',
        sales: 38,
    },
    {
        type: '家庭清洁',
        sales: 38,
    },
]

export const AtaliChartColumn: DnFC<any> = (props) => {
    const field = useField()

    const config = {
        ...props,
        //@ts-ignore
        data: field.value ?? testData,
    };
    const { appendPaddings } = props
    if (appendPaddings && appendPaddings.length > 0) {
        const list = appendPaddings.split("px")
        config.appendPadding = [
            +list[0], +list[1], +list[2], +list[3]
        ]
    }
    
    return <Column {...config} />;
}

AtaliChartColumn.Behavior = createBehavior({
    name: 'AtaliChartColumn',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliChartColumn',
    designerProps: {
        propsSchema: createFieldSchema(AtaliChartColumnSchema),
    },
    designerLocales: AtaliChartColumnLocales,
})

AtaliChartColumn.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliChartColumn',
                'x-component-props': {
                    title: '柱状图',
                    xField: 'type',
                    yField: 'sales',
                    height:200,
                    autoFit: true
                },
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n  $self.setValue([\n    {\n      type: \"家具家电\",\n      sales: 38,\n    },\n    {\n      type: \"粮油副食\",\n      sales: 52,\n    },\n    {\n      type: \"生鲜水果\",\n      sales: 61,\n    },\n    {\n      type: \"美容洗护\",\n      sales: 145,\n    },\n    {\n      type: \"母婴用品\",\n      sales: 48,\n    },\n    {\n      type: \"进口食品\",\n      sales: 38,\n    },\n    {\n      type: \"食品饮料\",\n      sales: 38,\n    },\n    {\n      type: \"家庭清洁\",\n      sales: 38,\n    },\n  ])\n}, [])\n"
                      },
                },
            }
        }
    ]
})

