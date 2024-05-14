import { useField, observer } from '@formily/react'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { MenuTree as FormilyMenuTree } from './formily';
import { MenuTreeLocales } from './locales';

export const MenuTree: DnFC<any> = observer((props) => {
    const field = useField()
    return <FormilyMenuTree field={field} id={field.query("id").value()} {...props}></FormilyMenuTree>
})

MenuTree.Behavior = createBehavior(
    {
        name: 'MenuTree',
        extends: ['Field'],
        selector: (node) => node.props !== undefined && node.props['x-component'] === 'MenuTree',
        designerProps: {
            propsSchema: createFieldSchema({
                type: 'object',
                properties: {
                    menuField: {
                        type: 'string',
                        title: '值字段',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                            defaultValue: 'roleMenus',
                        },
                    },
                    showCheck: {
                        type: 'boolean',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        'x-component-props': {
                            defaultChecked: false,
                        },
                    },
                    showInMenu: {
                        type: 'boolean',
                        title:'菜单显示',
                        'x-decorator': 'FormItem',
                        'x-component': 'Switch',
                        'x-component-props': {
                            defaultChecked: false,
                        },
                    },
                }
            }),
        },
        designerLocales: MenuTreeLocales,
    }
)

MenuTree.Resource = createResource(
    {
        icon: 'InputSource',
        elements: [
            {
                componentName: 'Field',
                props: {
                    "title": "菜单选择",
                    "x-decorator": "FormItem",
                    "x-component": "MenuTree",
                    "x-validator": [],
                    "x-component-props": {
                        "checkStrictly": true,
                        "menuField": "roleMenus"
                    },
                    "x-decorator-props": {},
                    "name": "menuFuncs",
                },
            },
        ],
    }
)