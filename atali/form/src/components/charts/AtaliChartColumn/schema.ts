import { ISchema } from '@formily/react'
import { areaSchema, createAxisSchema, chartContainerSchema, dataSchema, graphicStylesSchema, pointSchema, styleSchema } from '../utils'

export const areaGraphicStylesSchema = {
  ...graphicStylesSchema,
  isPercent: {
    type: 'boolean',
    title: '百分比',
    'x-decorator': 'FormItem',
    'x-component': 'Switch',
  },
  startOnZero: {
    type: 'boolean',
    title: '从0基准线开始填充',
    'x-decorator': 'FormItem',
    'x-component': 'Switch',
  },
}

export const AtaliChartColumnSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        defaultValue: '柱状图',
      }
    },
    ...dataSchema,
    ...chartContainerSchema,
    ...areaGraphicStylesSchema,
    areaStyle: {
      ...styleSchema,
      title: '图形样式'
    },
    point: pointSchema,
    area: areaSchema,
    xAxis: createAxisSchema('X轴配置'),
    yAxis: createAxisSchema('Y轴配置')
  }
}