import React from "react";
import { createReactEditorJS } from 'react-editor-js'
import Embed from '@editorjs/embed'
import List from '@editorjs/list'
import LinkTool from '@editorjs/link'
import Image from './plugins/Image'
import Header from '@editorjs/header'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import Tooltip from 'editorjs-tooltip';
import DragDrop from 'editorjs-drag-drop';
import Paragraph from '@editorjs/paragraph'
import Underline from '@editorjs/underline';
import { EditorCore } from "@react-editor-js/core";
import AlignmentTuneTool from './plugins/Alignment'

import { FontSizeTool } from './plugins/FontSize/FontSizeTool'
import './plugins/FontSize/FontSizeTool.less';
import ColorPickerTool from "./plugins/ColorPicker/ColorPickerTool";
import { Field } from "@formily/core";
import { Card, Col, Empty, Row } from "antd";

import './index.less'
import Blocks from "./render";

const ReactEditorJS = createReactEditorJS()

interface AtaliEditorComponentProps {
    value?: string
    field?: Field
    width?: string
    height?: string
    title?: string
    preview?: boolean
    readonly?: boolean
    onChange?: (val: string) => void
}

interface EditorState {
    blocks: any
    editorCore?: EditorCore
    result: any
}

export class AtaliEditorComponent extends React.Component<AtaliEditorComponentProps, EditorState> {
    constructor(props: any) {
        super(props)
        let value = props.value ?? '{}'
        if (typeof value === 'string' && value.startsWith('{')) {
            value = JSON.parse(value)
        } else {
            value = {}
        }
        this.state = {
            blocks: value,//,
            result: value
        }
    }

    render(): React.ReactNode {
        const editor = <div style={{ paddingLeft: 40 }}>{!this.props.field?.designable && <ReactEditorJS defaultValue={this.state.blocks}
            onInitialize={(core) => {
                this.setState({ editorCore: core })
            }}
            onReady={() => {
                new DragDrop(this.state.editorCore?.['_editorJS'])
                // new Undo({
                //     editor: this.state.editorCore?.['_editorJS'], shortcuts: {
                //         undo: 'CMD+Z',
                //         redo: 'CMD+SHIFT+Z'
                //     }
                // })
            }}
            onChange={(api, event) => {
                console.log(api, event);
                this.state.editorCore?.save().then(data => {
                    this.setState({ result: data })
                    this.props.onChange?.(JSON.stringify(data));
                })
            }}
            value={this.state.blocks} tools={{
                embed: Embed,
                list: List,
                linkTool: LinkTool,
                underline: Underline,
                image: {
                    class: Image,
                    toolbox: {
                        title: '图片'
                    },
                    config: {
                    }
                },
                video: {
                    class: Image,
                    toolbox: {
                        title: '视频'
                    },
                    config: {
                        field: 'video',
                        captionPlaceholder: '请输入视频描述',
                        captionEnabled: true,
                        types: 'video/*,.mkv',
                    }
                },
                header: {
                    class: Header,
                    inlineToolbar: true,
                    tunes: ['anyTuneName'],
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                    tunes: ['anyTuneName'],
                },
                marker: Marker,
                delimiter: Delimiter,
                inlineCode: InlineCode,
                fontSize: FontSizeTool,
                tooltip: {
                    class: Tooltip,
                    config: {
                        location: 'left',
                        highlightColor: '#FFEFD5',
                        underline: true,
                        backgroundColor: '#154360',
                        textColor: '#FDFEFE',
                        holder: 'editorId',
                    }
                },
                textColor: {
                    class: ColorPickerTool
                },
                anyTuneName: {
                    class: AlignmentTuneTool,
                    config: {
                        default: "left",
                        blocks: {
                            header: 'center',
                            list: 'left'
                        }
                    },
                }

            }} />}</div>

        return <Card title={this.props.title} bodyStyle={{ paddingTop: 0 }} style={{ borderRadius: "10px", width: this.props.width ?? '90%', height: this.props.height, marginLeft: 'auto', marginRight: 'auto', marginTop: 10 }}>
            {this.props.field?.designable ? <Empty /> :
                <Row>
                    {!this.props.readonly && <Col span={this.props.preview ? 12 : 24}>
                        {editor}</Col>}
                    {(this.props.preview || this.props.readonly) && <Col span={this.props.readonly ? 24 : 12}>
                        <div style={{ marginLeft: 10 }}><Blocks data={this.state.result ?? { "time": 1679476886791, "blocks": [], "version": "2.26.5" }} /></div>
                    </Col>}
                </Row>
            }</Card>
    }
}

export default AtaliEditorComponent