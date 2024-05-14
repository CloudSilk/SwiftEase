import { Field } from "@formily/core";
import React from "react";


interface AtaliCommonContainerProps {
    field: Field
    stylePosition: string
    styleFloat: string
    styleTop: number
    styleLeft: number
    styleRight: number
    styleBottom: number
    styleZIndex: number
    heightGap: number
    minHeight: number
    maxHeight: number
    minWidth: number
    maxWidth: number
    children: any
}
interface AtaliCommonContainerState {
    height: number
}

export class AtaliCommonContainerFormily extends React.Component<AtaliCommonContainerProps, AtaliCommonContainerState> {
    constructor(props: AtaliCommonContainerProps) {
        super(props)
        this.state = {
            height: this.getHeight(this.props.heightGap)
        }
    }
    getHeight(heightGap: number) {
        if (heightGap <= 0) {
            return 0
        }
        return document.body.offsetHeight - heightGap
    }
    resizeFn(self: AtaliCommonContainerFormily) {
        return () => {
            self.setState({ height: self.getHeight(self.props.heightGap) })
        }
    }
    componentDidMount() {
        if (this.props.heightGap && this.props.heightGap > 0) {
            window.addEventListener('resize', this.resizeFn(this))
        }
    }
    render() {
        const style = {
            margin: 10,
            height: 100,
            "borderStyle": "solid",
            "borderWidth": "1px",
            "borderColor": "rgba(221,220,226,1)",
            ...this.props['style'],
            float: this.props.styleFloat,
            position: this.props.stylePosition,
            top: this.props.styleTop,
            left: this.props.styleLeft,
            right: this.props.styleRight,
            bottom: this.props.styleBottom,
            minHeight: this.props.minHeight,
            maxHeight: this.props.maxHeight,
            minWidth: this.props.minWidth,
            maxWidth: this.props.maxWidth
        }
        if (this.state?.height && this.state?.height > 0) {
            style.height = this.state.height
        }
        return (
            <div {...this.props} style={style}>
                {this.props.children}
            </div>
        )
    }
}