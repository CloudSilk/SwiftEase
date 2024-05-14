import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { BMapAddressPicker as  BMapAddressPickerFormily} from './formily';
import { BMapAddressPickerLocales } from './locales';
import { observer, useField } from '@formily/react';
import { BMapAddressPickerSchema } from "./schema";

export const BMapAddressPicker: DnFC<any> = observer((props) => {
    const field = useField()
    return <BMapAddressPickerFormily field={field} {...props}></BMapAddressPickerFormily>
})

BMapAddressPicker.Behavior = createBehavior({
    name: 'BMapAddressPicker',
    extends: ['Field'],
    selector: (node) => node.props !== undefined && node.props['x-component'] === 'BMapAddressPicker',
    designerProps: {
        propsSchema: createFieldSchema(BMapAddressPickerSchema),
    },
    designerLocales: BMapAddressPickerLocales,
})

BMapAddressPicker.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                "title": "地址",
                "x-decorator": "FormItem",
                "x-component": "BMapAddressPicker",
                "name": "address",
            },
        },
    ],
})
