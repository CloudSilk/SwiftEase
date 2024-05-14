import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
import { Select as AntdSelect } from 'antd'
import { SelectProps } from 'antd/lib/select'

import { LoadingOutlined } from '@ant-design/icons'
import { PreviewText } from '@swiftease/formily-antd-v5'
import { Field } from '@formily/core'

export interface AtaliSelectProps extends SelectProps {
    url: string,
    labelField: string,
    idField: string
    field: Field
}

export const AtaliSelect: ReactFC<SelectProps<any, any>> = connect(
    AntdSelect,
    mapProps(
      {
        dataSource: 'options',
        loading: true,
      },
      (props, field) => {
        return {
          ...props,
          suffixIcon:
            field?.['loading'] || field?.['validating'] ? (
              <LoadingOutlined />
            ) : (
              props.suffixIcon
            ),
        }
      }
    ),
    mapReadPretty(PreviewText.Select)
  )
  
  export default AtaliSelect