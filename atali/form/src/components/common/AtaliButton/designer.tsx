import { AtaliButton as AtaliButtonFormily } from './formily'
import { createBehavior, createResource } from '@swiftease/designable-core'
import { DnFC } from '@swiftease/designable-react'
import { createFieldSchema } from '@swiftease/designable-formily-antd'
import { ButtonLocales } from './locales'
import { ButtonSchema } from './schema'
import { observer } from '@formily/reactive-react'
import { useField } from '@formily/react'

export const AtaliButton: DnFC<any> = observer((props) => {
  const field = useField()
  return <AtaliButtonFormily field={field} {...props}> </AtaliButtonFormily>
})

AtaliButton.Behavior = createBehavior({
  name: 'AtaliButton',
  extends: ['Field'],
  selector: (node) => node.props !== undefined && node.props['x-component'] === 'AtaliButton',
  designerProps: {
    propsSchema: createFieldSchema(ButtonSchema),
  },
  designerLocales: ButtonLocales,
})

AtaliButton.Resource = createResource({
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '按钮',
        'x-component': 'AtaliButton',
        "x-component-props": {
          "title": "按钮",
          "htmlType": "button"
        },
        "x-decorator-props": {
          "colon": false
        },
      },
    },
  ],
})