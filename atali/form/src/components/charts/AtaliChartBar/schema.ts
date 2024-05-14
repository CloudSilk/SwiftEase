import { ISchema } from '@formily/react'
import { areaSchema, createAxisSchema, chartContainerSchema, dataSchema, graphicStylesSchema, pointSchema, reflectSchema, styleSchema } from '../utils'



export const AtaliChartBarSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '条形图',
      }
    },
    ...dataSchema,
    reflect: reflectSchema,
    ...chartContainerSchema,
    ...graphicStylesSchema,
    lineStyle: {
      ...styleSchema,
      title: '图形样式'
    },
    point: pointSchema,
    area: areaSchema,
    xAxis: createAxisSchema('X轴配置'),
    yAxis: createAxisSchema('Y轴配置')
  }
}