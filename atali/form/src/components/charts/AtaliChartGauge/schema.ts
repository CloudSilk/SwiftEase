import { ISchema } from '@formily/react'
import { chartContainerSchema, graphicStylesSchema, styleSchema, metaSchema } from '../utils'

const pieDataSchema = {
  angleField: {
    type: 'string',
    title: '切片大小字段',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    description: '扇形切片大小（弧度）所对应的数据字段名'
  },
  colorField: {
    type: 'string',
    title: '颜色字段',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    description: '扇形颜色映射对应的数据字段名。'
  },
  meta: metaSchema
}

export const AtaliChartGaugeSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '仪表盘',
      }
    },
    ...pieDataSchema,
    ...chartContainerSchema,
    ...graphicStylesSchema,
    lineStyle: {
      ...styleSchema,
      title: '图形样式'
    },
  }
}