
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createVoidFieldSchema } from '@swiftease/designable-formily-antd'
import { AtaliUnitSchema } from './schema'
import { AtaliUnitLocales } from './locales'
import { Select } from 'antd';

const { Option, OptGroup } = Select;

import { unitData } from './data'

function genGroup(data: any[]) {
    const result = new Map<string, any[]>()
    data.forEach(item => {
        let units = result.get(item.type)
        if (!units) {
            units = []
        }
        units.push(<Option value={item.value}>{item.text}</Option>)
        result.set(item.type, units)
    })
    const groups: any[] = []
    result.forEach((values, key) => {
        groups.push(<OptGroup label={key}>
            {values}
        </OptGroup>)
    })
    return groups
}

export const AtaliUnit: DnFC<any> = (props) => {
    const data = genGroup(unitData)
    return (
        <Select {...props}>
            {data}
        </Select>
    )
}

AtaliUnit.Behavior = createBehavior({
    name: 'AtaliUnit',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliUnit',
    designerProps: {
        propsSchema: createVoidFieldSchema(AtaliUnitSchema),
    },
    designerLocales: AtaliUnitLocales,
})

AtaliUnit.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "单位",
                type: 'string',
                "x-decorator": "FormItem",
                'x-component': 'AtaliUnit',
                'x-component-props': {
                    "optionFilterProp": "label",
                    "allowClear": true,
                    "showSearch": true,
                    "showArrow": true
                },
                "name": "unit"
            }
        }
    ]
})

