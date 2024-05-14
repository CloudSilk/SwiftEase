import { ISchema } from '@formily/react'

export const CustomerUploadSchema: ISchema & { Dragger?: ISchema } = {
    type: 'object',
    properties: {
        textContent: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        accept: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
        action: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
                include: ['TEXT', 'EXPRESSION'],
            },
        },
        name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: 'file',
            },
        },
        maxCount: {
            type: 'number',
            'x-decorator': 'FormItem',
            'x-component': 'NumberPicker',
        },
        method: {
            enum: ['POST', 'PUT', 'GET'],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: 'POST',
                optionType: 'button',
            },
        },
        data: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
            },
        },
        headers: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
            },
        },

        listType: {
            enum: ['text', 'picture', 'picture-card'],
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
                defaultValue: 'text',
                optionType: 'button',
            },
        },
        directory: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        multiple: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        openFileDialogOnClick: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                defaultChecked: true,
            },
        },
        showUploadList: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                defaultChecked: true,
            },
        },
        withCredentials: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
        beforeUpload: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
                noCheck: true
            }
        },
        onChange: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
                noCheck: true
            }
        },
        onRemove: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'AtaliValueInput',
            'x-component-props': {
                include: ['EXPRESSION'],
                noCheck: true
            }
        },
        isArray: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
            'x-component-props': {
                defaultValue: false,
            },
        },
        toFileField: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: 'files',
            },
        },
        fileIDField: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: 'fileID',
            },
        },
        fileNameField: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: '',
            },
        },
        fileTypeField: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: '',
            },
        },
        fileSizeField: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
                defaultValue: '',
            },
        },
    },
}

CustomerUploadSchema.Dragger = CustomerUploadSchema