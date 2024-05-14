// import { connect } from '@formily/react'
// import { Input as FormilyInput } from '@swiftease/formily-antd-v5'

// export const RelatedPageInput = connect(FormilyInput)
import React from 'react';
import { InputProps, Input } from 'antd';
const { Search } = Input;

export interface RelatedPageInputProps extends InputProps {
    onSearch: any;
}

export interface RelatedPageInputAtaliListState {
    dataSource: any[]
}

export class RelatedPageInput extends React.Component<RelatedPageInputProps, RelatedPageInputAtaliListState>{
    constructor(props: RelatedPageInputProps) {
        super(props);
    }

    render() {
        return <>
            <Search {...this.props} />
        </>
    }
}