import React from 'react';
import { Button, Card } from 'antd';
import { Page } from '../../model';
import { Form } from '@swiftease/formily-antd-v5'
import { Form as FormilyForm } from '@formily/core/esm/models'
import { funcs } from '@swiftease/atali-form'
import { uuid } from 'uuidv4'
import './index.less';

interface SearchComponentProps {
    onSubmit?: ((resetPageIndex?: boolean | undefined) => void) | undefined;
    onReset?: (e: React.MouseEvent<Element, MouseEvent>) => any;
    searchForm: FormilyForm;
    searchFormSchema: {};
    pageConfig: Page;
    customerAction?: React.ReactNode;
    createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element;
    searchFunc: () => void;
    formResetFunc: () => void;
    updateSearchHeight: (height: any) => void
}

interface SearchComponentState {
    showAllCondition: boolean
    componentID: string
    resizeObserver?: ResizeObserver
}

class SearchComponent extends React.Component<SearchComponentProps, SearchComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            showAllCondition: true,
            componentID: uuid()
        }
    }
    resizeFn(d: SearchComponent) {
        return () => {
            d.props.updateSearchHeight(document.getElementById(d.state.componentID)?.['offsetHeight'] || 0)
        }
    }
    componentDidMount(): void {
        const self = this
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                self.props.updateSearchHeight(entry.contentRect.height)
            }
        });
        window.addEventListener('resize', this.resizeFn(this))
        const myElement = document.getElementById(this.state.componentID);
        resizeObserver.observe(myElement);
        this.setState({ resizeObserver })
    }

    componentWillUnmount() {
        const myElement = document.getElementById(this.state.componentID);
        this.state.resizeObserver?.unobserve(myElement)
    }

    render(): React.ReactNode {
        return (
            <Card id={this.state.componentID} className={'pageSearch'} style={{ margin: 10 }} bodyStyle={{ padding: 20, paddingTop: 10, paddingBottom: 10 }}>
                <Form form={this.props.searchForm} labelCol={this.props.searchFormSchema["labelCol"]} wrapperCol={this.props.searchFormSchema["wrapperCol"]} className={'search-form' + (this.state.showAllCondition ? ' search-form-with-all' : '')}>
                    {this.props.createSchemaField && this.props.createSchemaField(this.props.searchFormSchema, funcs, true)}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0.625rem' }}>
                        <Button key="submit" size='small' style={{ marginRight: '10px' }} onClick={() => {
                            this.props.searchFunc();
                        }} type="primary">
                            查询
                        </Button>
                        <Button key="button" size='small' onClick={() => {
                            this.props.formResetFunc();
                        }} type="primary">
                            重置
                        </Button>
                        <a href="javascript:void(0)" className='action' onClick={() => {
                            this.setState({ showAllCondition: !this.state.showAllCondition })
                        }}>{this.state.showAllCondition ? '收起' : '展开'}  </a>
                    </div>
                </Form>
                {this.props.customerAction}
            </Card>
        );
    }

};

export default SearchComponent;
