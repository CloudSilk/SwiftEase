import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
import { TreeSelect as AntdTreeSelect } from 'antd'
import { TreeSelectProps } from 'antd/lib/tree-select'

import { LoadingOutlined } from '@ant-design/icons'
import { PreviewText } from '@swiftease/formily-antd-v5'
import { Field } from '@formily/core'

export interface AtaliTreeSelectProps extends TreeSelectProps {
  url: string,
  labelField: string,
  idField: string
  field: Field
}

export const AtaliTreeSelect: ReactFC<TreeSelectProps<any, any>> = connect(
  AntdTreeSelect,
  mapProps(
    {
      dataSource: 'treeData',
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
  mapReadPretty(PreviewText.TreeSelect)
)

export default AtaliTreeSelect