/*
 * 支持文本、数字、布尔、表达式
 * Todo: JSON、富文本，公式
 */

import { Input, Button, Popover, InputNumber, Select } from 'antd'

import { TextWidget } from '@swiftease/designable-react'
import { createPolyInput, MonacoInput } from '@swiftease/designable-react-settings-form'

const STARTTAG_REX =
  /<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/

const EXPRESSION_REX = /^\{\{([\s\S]*)\}\}$/

const isNumber = (value: any) => typeof value === 'number'

const isBoolean = (value: any) => typeof value === 'boolean'

const isExpression = (value: any) => {
  return typeof value === 'string' && EXPRESSION_REX.test(value)
}

const isRichText = (value: any) => {
  return typeof value === 'string' && STARTTAG_REX.test(value)
}

const isNormalText = (value: any) => {
  return typeof value === 'string' && !isExpression(value) && !isRichText(value)
}

const takeNumber = (value: any) => {
  const num = String(value).replace(/[^\d\.]+/, '')
  if (num === '') return
  return Number(num)
}

export const AtaliValueInput = createPolyInput([
  {
    type: 'TEXT',
    icon: 'Text',
    component: Input,
    checker: isNormalText,
  },
  {
    type: 'EXPRESSION',
    icon: 'Expression',
    component: (props: any) => {
      let checker = props.checker
      if (props.noCheck) {
        checker = (value: any) => true
      }
      return (
        <Popover
          content={
            <div
              style={{
                width: 800,
                height: 400,
                marginLeft: -16,
                marginRight: -16,
                marginBottom: -12,
              }}
            >
              <MonacoInput {...props} checker={checker} language="javascript.expression" />
            </div>
          }
          trigger="click"
        >
          <Button block>
            <TextWidget token="SettingComponents.ValueInput.expression" />
          </Button>
        </Popover>
      )
    },
    checker: isExpression,
    toInputValue: (value) => {
      if (!value || value === '{{}}') return
      const matched = String(value).match(EXPRESSION_REX)
      return matched?.[1] || value || ''
    },
    toChangeValue: (value) => {
      if (!value || value === '{{}}') return
      const matched = String(value).match(EXPRESSION_REX)
      return `{{${matched?.[1] || value || ''}}}`
    },
  },
  {
    type: 'BOOLEAN',
    icon: 'Boolean',
    component: (props: any) => (
      <Select
        {...props}
        options={[
          { label: 'True', value: true },
          { label: 'False', value: false },
        ]}
      />
    ),
    checker: isBoolean,
    toInputValue: (value) => {
      return !!value
    },
    toChangeValue: (value) => {
      return !!value
    },
  },
  {
    type: 'NUMBER',
    icon: 'Number',
    component: InputNumber,
    checker: isNumber,
    toInputValue: takeNumber,
    toChangeValue: takeNumber,
  },
])
