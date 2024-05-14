import React from 'react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { CustomerUpload as FormilyCustomerUpload } from './formily'
import { CustomerUploadLocales } from './locales'
import { CustomerUploadSchema } from './schema'

export const CustomerUpload: DnFC<React.ComponentProps<typeof FormilyCustomerUpload>> =
    FormilyCustomerUpload

CustomerUpload.Behavior = createBehavior(
    {
        name: 'CustomerUpload',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'CustomerUpload',
        designerProps: {
            propsSchema: createFieldSchema(CustomerUploadSchema),
        },
        designerLocales: CustomerUploadLocales,
    }
)

CustomerUpload.Resource = createResource(
    {
        icon: 'UploadSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "type": "Array<object>",
                    "title": "图片",
                    "x-decorator": "FormItem",
                    "x-component": "CustomerUpload",
                    "x-component-props": {
                        "textContent": "Upload",
                        "maxCount":1,
                        "listType": "picture-card",
                        "action": "/api/core/file/upload",
                        "headers": "{{{'authorization': 'Bearer '+getToken()}}}",
                        "beforeUpload":"{{(file, fileList)=>{\n  if($self.componentProps.maxCount<=1) return true\n  const length=$self.value?.length??0\n  return $self.componentProps.maxCount>length\n}}}"
                    },
                    "x-validator": [],
                    "x-decorator-props": {},
                    "x-index": 4,
                    "name": "newFiles",
                    "x-reactions": {
                        "dependencies": [
                            {
                                "property": "value",
                                "type": "any",
                                "source": "id",
                                "name": "id"
                            }
                        ],
                        "fulfill": {
                            "run": "$effect(() => {\n  convertFile($self, $form.values, \"fileID\", \"fileName\")\n}, [$deps.id])\n"
                        }
                    }
                },
            },
        ],
    }
)
