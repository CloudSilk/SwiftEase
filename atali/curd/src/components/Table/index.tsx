import React, { createRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { CommonService, QueryResponse } from '@swiftease/atali-pkg';
import { Page } from '../../model'
import ProTable from '@ant-design/pro-table';
import { Form as FormilyForm } from '@formily/core/esm/models'
import { PaginationConfig } from 'antd/lib/pagination';
import './index.less'
import 'react-resizable/css/styles.css';
// import 'react-resizable/css/size.css';
import { Resizable } from 'react-resizable';
import { uuid } from 'uuidv4'
import { Table } from 'antd';
interface TableComponentProps {
    actionRef?: React.MutableRefObject<ActionType | undefined>;
    columns?: ProColumns<any>[];
    rowKey: string;
    pageConfig: Page;
    showAdd?: () => void;
    service?: CommonService<any>;
    searchForm: FormilyForm;
    headerTitle?: React.ReactNode;
    getPagination: () => PaginationConfig | false
    toolBarRender: false | ((action: ActionType | undefined, rows: {
        selectedRowKeys?: (string | number)[] | undefined;
        selectedRows?: any[] | undefined;
    }) => React.ReactNode[]) | undefined
    rowClick?: (data: any) => void,
    fromParentData?: any
    searchHeight: any,
    isResizable?: boolean
    enableSelection: boolean
    onSelectedChange?: (selectedRowKeys: any, selectedRows: any) => void
}

interface TableComponentState {
    pageSize?: number,
    defaultColumns?: any,
    scrollX?: number,
    isDragging?: boolean,
    columnsWidthObj?: any,
    components?: any
}

const ResizableTitle = (resizeProps: { [x: string]: any; cresize: any; width: any }) => {
    const { cresize, width, isResizable, ...restProps } = resizeProps;
    delete restProps.cresize;
    if (!width) {
        return <th {...restProps} />;
    }

    if (isResizable === false) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={cresize} draggableOpts={{ enableUserSelectHack: false }} >
            <th {...restProps} />
        </Resizable>
    )
}

class TableComponent extends React.Component<TableComponentProps, TableComponentState> {
    tableDom;
    isDragegringRef;
    constructor(props: any) {
        super(props);
        this.tableDom = createRef();
        this.isDragegringRef = false;
        this.state = Object.assign(this.state || {}, {
            defaultColumns: props.columns,
            scrollX: 0,
            isDragging: false,
            columnsWidthObj: {},
            components: {
                cell: ResizableTitle
            }
        });
    }

    setColumnsWidth = (data) => {
        const { defaultColumns } = this.state;
        defaultColumns.forEach((item) => {
            if (typeof item.title === 'string') {
                if (data[item.title]) {
                    item.width = data[item.title];
                }
            } else if (typeof item.titleName === 'string') {
                if (data[item.titleName]) {
                    item.width = data[item.titleName];
                }
            }
        });
        this.setState({ ...this.state, defaultColumns });
    };

    componentDidMount() {
        if (this.props.isResizable) {
            this.setState({
                ...this.state, components: {
                    header: {
                        cell: ResizableTitle
                    }
                }
            });
        }

        const fn = () => {
            if (this.isDragegringRef) {
                this.setState((prevState: any) => {
                    let columns = prevState.defaultColumns;
                    const obj: Record<string, any> = {};
                    columns.forEach((item) => {
                        if (typeof item.title === 'string') {
                            obj[item.title] = item.width;
                        } else if (typeof item.titleName === 'string') {
                            obj[item.titleName] = item.width;
                        } else {
                            console.error(
                                '因为表头需要保存宽度，请在columns里面的加上title或者titleName为string类型',
                            );
                        }
                    });
                    // 保存表格宽度使用习惯
                    // saveTableColumnsWidth({ tableName: props.tableName, headerLength: JSON.stringify(obj) });

                    return { defaultColumns: columns }
                });
                this.isDragegringRef = false;
            }
        };
        window.addEventListener('mouseup', fn.bind(this));
        return () => {
            window.removeEventListener('mouseup', fn.bind(this));
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps?.columns !== this.props?.columns) {
            this.setState({
                defaultColumns: this.props?.columns || [],
            });
            let eles: any = null;
            const fn = (e: { stopPropagation: () => void; }) => {
                e.stopPropagation();
            };
            setTimeout(() => {
                if (this.tableDom.current) {
                    const threadThs = this.tableDom.current.querySelectorAll('TH');
                    let count = 0;
                    if (this.props.enableSelection) {
                        count -= 1;
                    }

                    const columnsCopy = this.props.columns;
                    const total = columnsCopy?.reduce((num, item, index) => {
                        if (item.hideInTable === true) {
                            count += 1;
                            return num;
                        }
                        if (threadThs[index - count]?.clientWidth) {
                            Object.assign(item, { width: threadThs[index - count]?.clientWidth });
                        }
                        if (!item.dataIndex) {
                            Object.assign(item, { isResizable: false });
                        }
                        return Number(item.width) + num;
                    }, 0) || this.props.pageConfig?.scrollX;
                    const num = total < (this.props.pageConfig?.scrollX || 0) ? total : this.props.pageConfig?.scrollX || 0;
                    this.setState({
                        ...this.state,
                        scrollX: num
                    });
                    if (this.props) {
                        this.setState({ ...this.state, defaultColumns: columnsCopy });
                        // Object.assign(this.props, {columns: columnsCopy});
                    }
                }
                eles = document.querySelectorAll('.react-resizable-handle');
                if (eles && eles.length > 0) {
                    eles.forEach((item: any) => {
                        item.addEventListener('click', fn.bind(this));
                    });
                }
            }, 500)
            return () => {
                if (eles && eles.length > 0) {
                    eles.forEach((item: any) => {
                        item.removeEventListener('click', fn.bind(this));
                    })
                }
            }
        }
    }

    calcTableHeight() {
        var h = document.body.offsetHeight - (this.props.searchHeight ?? 0) - 210
        console.log("表格高度", h, document.body.offsetHeight, this.props.searchHeight)
        return h
    }
    render() {
        const { defaultColumns, components, scrollX } = this.state;
        const { isResizable } = this.props;
        let columns = [], scrolX = scrollX || 0;
        if (isResizable && defaultColumns?.length) {
            columns = defaultColumns.map((col, index) => ({
                ...col,
                onHeaderCell: (): any => {
                    return {
                        width: col.width || 100,
                        isResizable: col.isResizable,
                        cresize: (_e: any, { size }: { size: any }) => {
                            this.isDragegringRef = true;
                            const nextColumns = [...columns];
                            nextColumns[index] = {
                                ...nextColumns[index],
                                width: size.width,
                            };
                            console.log(nextColumns)
                            const total = nextColumns.reduce((num, item) => {
                                return Number(item.width) + num;
                            }, 0);
                            // 如果宽度总和小于传入的宽度 使用计算的宽度
                            if (total < scrollX) {
                                scrolX = total
                            }
                            this.setState({ defaultColumns: nextColumns });
                        },
                    };
                },
            }));

        }
        return (
            <div ref={this.tableDom}>
                <ProTable<any> key={uuid()} className={'pageTable'}
                    columns={isResizable ? columns : this.props.columns}
                    rowKey={this.props.rowKey}
                    actionRef={this.props.actionRef}
                    components={components}
                    // cardBordered={false}
                    style={{ margin: 10, height: this.calcTableHeight() }}
                    bordered={this.props.pageConfig?.bordered === false ? false : true}
                    pagination={{
                        defaultPageSize: this.props.pageConfig?.pageSize,
                        pageSize: this.props.pageConfig?.pageSize,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "15", "20", "30", "50", "100", "200"]
                    }}
                    scroll={{ x: scrolX || (this.props.pageConfig?.scrollX ?? 1200), y: this.calcTableHeight() - 110 }}
                    request={async (params = {}, sort, filter) => {
                        params['pageIndex'] = params['current']
                        const searchValues = { ...this.props.searchForm.values }
                        eval(this.props.pageConfig?.queryBefore ?? '')
                        let resp: QueryResponse<any> | null | undefined;
                        if (this.props.pageConfig.path !== "") {
                            resp = await this.props.service?.query({ ...params, ...searchValues, sortConfig: sort })
                        } else {
                            resp = await this.props.service?.query({ pageName: this.props.pageConfig?.name, ...params, data: { ...searchValues }, ...searchValues, sortConfig: sort })
                        }

                        if (!resp || !resp.data) {
                            return {
                                code: resp?.code,
                                message: resp?.message,
                                total: 0,
                                data: []
                            }
                        }
                        eval(this.props.pageConfig?.queryAfter ?? '')
                        return resp
                    }
                    }
                    rowSelection={this.props.enableSelection ? ({
                        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                        defaultSelectedRowKeys: [],
                        onChange: (selectedRowKeys: any, selectedRows: any) => {
                            this.props.onSelectedChange?.(selectedRowKeys, selectedRows)
                        }
                    }) : undefined}
                    options={{ density: true, ...this.props.pageConfig.toolBar }}
                    search={false}
                    toolBarRender={this.props.toolBarRender}
                    onRow={(item) => {
                        return {
                            onMouseDown: () => {
                                if (this.props.rowClick) {
                                    this.props.rowClick(item)
                                }

                            },
                        };
                    }}
                />
            </div>
        );
    }
}

export default TableComponent;