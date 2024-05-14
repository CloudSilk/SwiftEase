import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
import { Cascader as AntdCascader } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { PreviewText } from '@swiftease/formily-antd-v5'


export const AtaliCascader: ReactFC<any> = connect(
  AntdCascader,
  mapProps(
    {
      dataSource: 'options',
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
  mapReadPretty(PreviewText.Cascader)
)

export default AtaliCascader