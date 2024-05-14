import { Upload, Button, message, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import { Code, CommonResponse, CommonService, getToken } from '@swiftease/atali-pkg';

interface UploadComponentProps {
    service?: CommonService<any>;
    uploadUrl: string
    multi: boolean
    maxCount: number
}

interface UploadComponentState {
    fileList: any[]
    uploading: boolean
    message?: string
    showResult: boolean
}

class UploadComponent extends React.Component<UploadComponentProps, UploadComponentState> {
    state = {
        fileList: [],
        uploading: false,
        message: '',
        showResult: false
    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file);
        });
        this.setState({
            uploading: true,
            showResult: false
        });
        this.props.service?.post<CommonResponse>((this.props.uploadUrl && this.props.uploadUrl !== '') ? this.props.uploadUrl : '/api/' + this.props.service?.uriPrefix + '/import', formData, {
            headers: {
                // 'Content-Type': 'multipart/form-data',
                authorization: 'Bearer ' + getToken(),
            },
        })
            .then(res => {
                if (res?.code !== Code.Success) {
                    message.error(res?.message);
                } else {
                    this.setState({
                        fileList: [],
                        message: res.message,
                        showResult: true
                    });
                    message.success('上传成功');
                }
                this.setState({
                    uploading: false
                })
            })

    };

    render() {
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: (file: any) => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file: any) => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
            maxCount: this.props.maxCount,
            multiple: this.props.multi
        };

        return (
            <div style={{ height: '400px', padding: '20px' }}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={this.handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? '上传中' : '开始上传'}
                </Button>
                {this.state.showResult && <Result
                    title={this.state.message}
                />}
            </div>
        );
    }
}

export default UploadComponent;