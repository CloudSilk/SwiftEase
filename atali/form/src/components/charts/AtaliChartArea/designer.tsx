
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliChartAreaSchema } from './schema'
import { AtaliChartAreaLocales } from './locales'
import './index.less'
import { useField } from '@formily/react'
import { Area } from '@ant-design/charts'

const testData = [
    {
        "timePeriod": "2006 Q3",
        "value": 1
    },
    {
        "timePeriod": "2006 Q4",
        "value": 1.08
    },
    {
        "timePeriod": "2007 Q1",
        "value": 1.17
    },
    {
        "timePeriod": "2007 Q2",
        "value": 1.26
    },
    {
        "timePeriod": "2007 Q3",
        "value": 1.34
    },
    {
        "timePeriod": "2007 Q4",
        "value": 1.41
    },
    {
        "timePeriod": "2008 Q1",
        "value": 1.52
    },
    {
        "timePeriod": "2008 Q2",
        "value": 1.67
    },
    {
        "timePeriod": "2008 Q3",
        "value": 1.84
    },
    {
        "timePeriod": "2008 Q4",
        "value": 2.07
    },
    {
        "timePeriod": "2009 Q1",
        "value": 2.39
    },
    {
        "timePeriod": "2009 Q2",
        "value": 2.71
    },
    {
        "timePeriod": "2009 Q3",
        "value": 3.03
    },
    {
        "timePeriod": "2009 Q4",
        "value": 3.33
    },
    {
        "timePeriod": "2010 Q1",
        "value": 3.5
    },
    {
        "timePeriod": "2010 Q2",
        "value": 3.37
    },
    {
        "timePeriod": "2010 Q3",
        "value": 3.15
    },
    {
        "timePeriod": "2010 Q4",
        "value": 3.01
    },
    {
        "timePeriod": "2011 Q1",
        "value": 2.8
    },
    {
        "timePeriod": "2011 Q2",
        "value": 2.8
    },
    {
        "timePeriod": "2011 Q3",
        "value": 2.84
    },
    {
        "timePeriod": "2011 Q4",
        "value": 2.75
    },
]

export const AtaliChartArea: DnFC<any> = (props) => {
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
    
    return <Area {...config} />;
}

AtaliChartArea.Behavior = createBehavior({
    name: 'AtaliChartArea',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliChartArea',
    designerProps: {
        propsSchema: createFieldSchema(AtaliChartAreaSchema),
    },
    designerLocales: AtaliChartAreaLocales,
})

AtaliChartArea.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliChartArea',
                'x-component-props': {
                    title: '面积图',
                    xField: 'timePeriod',
                    yField: 'value',
                    height:200,
                    autoFit: true
                },
                "x-reactions": {
                    "fulfill": {
                        "run": "$effect(() => {\n  fetch(\n    \"https://gw.alipayobjects.com/os/bmw-prod/360c3eae-0c73-46f0-a982-4746a6095010.json\"\n  )\n    .then((response) => response.json())\n    .then((json) => $self.setValue(json))\n    .catch((error) => {\n      console.log(\"fetch data failed\", error)\n    })\n}, [])\n"
                    }
                },
            }
        }
    ]
})

