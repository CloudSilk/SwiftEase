import React from "react";
import * as icons from  '@ant-design/icons';

export default (props: {icon: string, iconProps: any}) => {
    const {icon} = props;
    const antIcon: {[key: string]: any} = icons;
    return React.createElement(antIcon[icon], {...props.iconProps});
};