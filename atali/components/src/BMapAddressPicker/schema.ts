import { ISchema } from '@formily/react'

export const BMapAddressPickerSchema: ISchema = {
    type: 'object',
    properties: {
        showMap: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        mapWidth: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker'
        },
        mapHeight: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
            'x-component-props': {
                defaultValue: 300,
            },
        },
        addonBefore: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        addonAfter: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        prefix: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        suffix: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        allowClear: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        bordered: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                defaultChecked: true,
            },
        },
        maxLength: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
        },
        placeholder: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        size: {
            type: 'string',
            enum: ['large', 'small', 'middle', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
                defaultValue: 'middle',
            },
        }
    },
}