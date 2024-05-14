import React from 'react';

interface MenuBarProps {
}

interface MenuBarState {
}

export class MenuBar extends React.Component<MenuBarProps, MenuBarState>{
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
    }
    render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '40px',
                    background: '#fff7e6',
                }}
            >菜单栏</div>
        );
    }
};
