
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliChartLineSchema } from './schema'
import { AtaliChartLineLocales } from './locales'
import './index.less'
import { useField } from '@formily/react'
import { Line } from '@ant-design/charts'

export const AtaliChartLine: DnFC<any> = (props) => {
    const field = useField()
   
    const config = {
        ...props,
        //@ts-ignore
        data: field.value ?? [{ "year": "1991", "value": 3 },
        { "year": "1992", "value": 4 },
        { "year": "1993", "value": 3.5 },
        { "year": "1994", "value": 5 },
        { "year": "1995", "value": 4.9 },
        { "year": "1996", "value": 6 },
        { "year": "1997", "value": 7 },
        { "year": "1998", "value": 9 },
        { "year": "1888", "value": 13 }],
    };
    const {appendPaddings}=props
    if(appendPaddings && appendPaddings.length>0){
        const list=appendPaddings.split("px")
        config.appendPadding=[
            +list[0],+list[1],+list[2],+list[3]
        ]
    }
    
    return <Line {...config} />;
}

AtaliChartLine.Behavior = createBehavior({
    name: 'AtaliChartLine',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliChartLine',
    designerProps: {
        propsSchema: createFieldSchema(AtaliChartLineSchema),
    },
    designerLocales: AtaliChartLineLocales,
})

AtaliChartLine.Resource = createResource({
    icon: 'CardSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array',
                'x-decorator': 'FormItem',
                'x-component': 'AtaliChartLine',
                'x-component-props': {
                    title: '折线图',
                    xField: 'year',
                    yField: 'value',
                    height:200,
                    autoFit: true
                },
                "x-reactions": {
                    "dependencies": [
                        {
                            "property": "value",
                            "type": "any"
                        }
                    ],
                    "fulfill": {
                        "run": "$effect(() => {\n  $self.setValue([\n    { year: \"1991\", value: 3 },\n    { year: \"1992\", value: 4 },\n    { year: \"1993\", value: 3.5 },\n    { year: \"1994\", value: 5 },\n    { year: \"1995\", value: 4.9 },\n    { year: \"1996\", value: 6 },\n    { year: \"1997\", value: 7 },\n    { year: \"1998\", value: 9 },\n    { year: \"1999\", value: 13 },\n  ])\n}, [])\n"
                    }
                },
            }
        }
    ]
})

