
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliChartGaugeSchema } from './schema'
import { AtaliChartGaugeLocales } from './locales'
import './index.less'
import { useField } from '@formily/react'
import { Gauge } from '@ant-design/charts'

export const AtaliChartGauge: DnFC<any> = (props) => {
    const field = useField()

    const config = {
        range: {
            color: '#30BF78',
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        axis: {
            label: {
                formatter(v:any) {
                    return Number(v) * 100;
                },
            },
            subTickLine: {
                count: 3,
            },
        },
        statistic: {
            content: {
                //@ts-ignore
                formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
                style: {
                    color: 'rgba(0,0,0,0.65)',
                    fontSize: 48,
                },
            },
        },
        ...props,
        //@ts-ignore
        percent: field.value ?? 0.75,
    };
    const { appendPaddings } = props
    if (appendPaddings && appendPaddings.length > 0) {
        const list = appendPaddings.split("px")
        config.appendPadding = [
            +list[0], +list[1], +list[2], +list[3]
        ]
    }
    
    return <Gauge {...config} />;
}

AtaliChartGauge.Behavior = createBehavior({
    name: 'AtaliChartGauge',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliChartGauge',
    designerProps: {
        propsSchema: createFieldSchema(AtaliChartGaugeSchema),
    },
    designerLocales: AtaliChartGaugeLocales,
})

AtaliChartGauge.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliChartGauge',
                'x-component-props': {
                    title: '仪表盘',
                    height:200,
                },
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n  $self.setValue(0.85)\n},[])"
                    }
                },
            }
        }
    ]
})

