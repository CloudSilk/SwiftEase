import { Field } from "@formily/core";
import React from "react";
import './style.less';
import { Avatar } from "antd";


interface AtaliBigScreenTitleProps {
    field: Field
    title: string
    titleColor: string
    titleBeforeColor: string
    titleIcon: string
}
interface AtaliBigScreenTitleState {
}

export class AtaliBigScreenTitleFormily extends React.Component<AtaliBigScreenTitleProps, AtaliBigScreenTitleState> {
    constructor(props: AtaliBigScreenTitleProps) {
        super(props)
    }

    render() {
        return (<div {...this.props} className="bigscreen-container-title">
            {this.props.titleIcon && <Avatar shape="square" size={24} src={this.props.titleIcon}></Avatar>}
            {!this.props.titleIcon &&<div className="bigscreen-container-title-before" style={{ background: this.props.titleBeforeColor ?? '#59ebe8' }}></div>}
            <div style={{ "color": this.props.titleColor }}>{this.props.title ?? '标题'}</div>
        </div>
        )
    }
}