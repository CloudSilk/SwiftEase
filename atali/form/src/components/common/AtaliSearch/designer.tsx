import { AtaliSearch as AtaliSearchFormily } from './formily'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { SearchLocales } from './locales'
import { SearchSchema } from './schema'
import { observer, useField } from '@formily/react'
import { ArrayTable } from '@swiftease/formily-antd-v5'

export const AtaliSearch: DnFC<any> = observer((props) => {
  const field = useField()
  return <AtaliSearchFormily field={field} {...props} record={ArrayTable.useRecord?.()}> </AtaliSearchFormily>
})

AtaliSearch.Behavior = createBehavior({
  name: 'AtaliSearch',
  extends: ['Field'],
  selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliSearch',
  designerProps: {
    propsSchema: createFieldSchema(SearchSchema),
  },
  designerLocales: SearchLocales,
})

AtaliSearch.Resource = createResource({
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: ' ',
        'x-decorator': 'FormItem',
        'x-component': 'AtaliSearch',
        "x-component-props": {
          // "title": "子表单",
          // "htmlType": "button",
          // "formWidth": 1200,
          // "indexPosition": 0,
          // "parentPath": '',
          "httpMethod": 'GET',
          "action": 2,
          "showTitle": true,
        },
        "x-decorator-props": {
          "colon": false
        }
      },
    },
  ],
})