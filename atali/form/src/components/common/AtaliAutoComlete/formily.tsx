import { PreviewText } from '@swiftease/formily-antd-v5'
import { connect, mapReadPretty, mapProps, ReactFC } from '@formily/react'
import { AutoComplete } from 'antd'
import { AutoCompleteProps } from 'antd/lib/auto-complete'

export interface FormilyAutoCompleteProps extends AutoCompleteProps {
    url: string
}

export const FormilyAutoComplete: ReactFC<AutoCompleteProps<any, any>> = connect(
    AutoComplete,
    mapProps(
      {
        dataSource: 'options',
        loading: true,
      },
      (props, field) => {
        return {
          ...props
        }
      }
    ),
    mapReadPretty(PreviewText.Select)
  )
  
  export default FormilyAutoComplete