import { Component } from 'react';
import { Field } from '@formily/core';

interface AtaliAudioProps {
    field: Field
}

interface AudioRecordState {
}

class AtaliAudio extends Component<AtaliAudioProps, AudioRecordState> {
    constructor(props: AtaliAudioProps) {
        super(props);
        this.state = {
        };
    }


    render() {
        const { field } = this.props;
        const data = field.value
        return (
            <div>
                {data && (
                    <audio controls>
                        <source src={(data instanceof Blob) ? URL.createObjectURL(data) : data} type="audio/mp3" />
                    </audio>
                )}
                {!data && (
                    <audio controls>
                    </audio>
                )}
            </div>
        );
    }
}

export default AtaliAudio;
