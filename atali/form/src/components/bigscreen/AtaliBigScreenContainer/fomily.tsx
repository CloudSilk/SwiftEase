import { Field } from "@formily/core";
import React from "react";
import './style.less';


interface AtaliBigScreenContainerProps {
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
    title: string
    titleColor: string
    titleBeforeColor: string
    children: any
}
interface AtaliBigScreenContainerState {
    height: number
}

export class AtaliBigScreenContainerFormily extends React.Component<AtaliBigScreenContainerProps, AtaliBigScreenContainerState> {
    constructor(props: AtaliBigScreenContainerProps) {
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
    resizeFn(self: AtaliBigScreenContainerFormily) {
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
            "borderColor": "#0bc4e9",
            transition: "all 1s",
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
            <>
                <div {...this.props} style={style} className="bigscreen-container-border">
                    <div className="bigscreen-container-title">
                        <div className="bigscreen-container-title-before" style={{ background: this.props.titleBeforeColor ?? '#59ebe8' }}></div>
                        <div style={{ "color": this.props.titleColor }}>{this.props.title ?? '标题'}</div>
                    </div>
                    <div className="bigscreen-container-body">
                        {this.props.children}
                    </div>
                </div></>
        )
    }
}