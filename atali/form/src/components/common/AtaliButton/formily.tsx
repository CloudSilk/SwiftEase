import { Button } from 'antd'
import { connect, mapProps } from '@formily/react'

export const AtaliButton = connect(
  Button,
  mapProps((props, field) => {
    return {
      ...props,
      children:<span>{props.title}</span>
    }
  })
)