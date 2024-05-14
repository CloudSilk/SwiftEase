import { AtaliFormDrawer as AtaliFormDrawerFormily } from './formily'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { FormDrawerLocales } from './locales'
import { FormDrawerSchema } from './schema'
import { observer, useField } from '@formily/react'
import { ArrayTable } from '@swiftease/formily-antd-v5'

export const AtaliFormDrawer: DnFC<any> = observer((props) => {
  const field = useField()
  return <AtaliFormDrawerFormily field={field} {...props} record={ArrayTable.useRecord?.()}> </AtaliFormDrawerFormily>
})

AtaliFormDrawer.Behavior = createBehavior({
  name: 'AtaliFormDrawer',
  extends: ['Field'],
  selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliFormDrawer',
  designerProps: {
    propsSchema: createFieldSchema(FormDrawerSchema),
  },
  designerLocales: FormDrawerLocales,
})

AtaliFormDrawer.Resource = createResource({
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: ' ',
        'x-decorator': '',
        'x-component': 'AtaliFormDrawer',
        "x-component-props": {
          "title": "子表单",
          "htmlType": "button",
          "formWidth": 1200,
          "indexPosition": 0,
          "parentPath": '',
          "httpMethod": 'POST',
          "action": 1,
          "showTitle": true,
        },
        "x-decorator-props": {
          "colon": false
        }
      },
    },
  ],
})