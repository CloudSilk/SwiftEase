import React, { Component } from 'react';
import { Button } from 'antd';
import { AudioOutlined, StopFilled } from '@ant-design/icons';

interface AudioRecorderProps {
    title?: string
    onChange?: (val: any) => void
}

interface AudioRecordState {
    mediaRecorder: any
    audioUrl?: string
    isRecording: boolean
}

class AudioRecorder extends Component<AudioRecorderProps,AudioRecordState> {
    constructor(props: AudioRecorderProps) {
        super(props);
        this.state = {
            audioUrl: '',
            mediaRecorder : React.createRef(),
            isRecording: false,
        };
    }

    startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.state.mediaRecorder.current = new MediaRecorder(stream);
            const chunks: BlobPart[] | undefined = [];
            this.setState({ audioUrl:undefined})
            this.state.mediaRecorder.current.ondataavailable = (e:any) => chunks.push(e.data);
            this.state.mediaRecorder.current.onstop = (e:any) => {
                const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
                this.props.onChange?.(audioBlob)
                this.setState({ audioUrl: URL.createObjectURL(audioBlob) });
            };

            this.state.mediaRecorder.current.start();
            this.setState({ isRecording: true });
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    stopRecording = () => {
        if (this.state.mediaRecorder.current) {
            this.state.mediaRecorder.current.stop();
            this.setState({ isRecording: false });
        }
    };

    render() {
        const { title } = this.props;
        const { audioUrl, isRecording } = this.state;

        return (
            <div>
                <div style={{ paddingLeft: 0 }}>
                    <Button onClick={isRecording ? this.stopRecording : this.startRecording} type="text" shape="circle" icon={isRecording ? <StopFilled /> : <AudioOutlined />} />
                    <span>{title ?? '1. 希望我们大家都能像他一样'}</span>
                </div>
                <div>
                    {audioUrl && (
                        <audio controls>
                            <source src={audioUrl} type="audio/mp3" />
                        </audio>
                    )}
                    {!audioUrl && (
                        <audio controls>
                        </audio>
                    )}
                </div>
            </div>
        );
    }
}

export default AudioRecorder;
