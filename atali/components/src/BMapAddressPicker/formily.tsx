import { Map, NavigationControl, GeolocationControl } from '@uiw/react-baidu-map'
import React from 'react'
import { Input } from 'antd'
import { connect, mapProps, mapReadPretty } from '@formily/react';
import { PreviewText } from '@swiftease/formily-antd-v5';
import { Field } from '@formily/core';

interface AddressPickerProps {
    onSelected?: (item: any) => void
    showMap: boolean
    mapWidth: number
    mapHeight: number
    onConfirm: (e: any) => void
    id?: string
    onChange?: (value: string) => void
    field: Field
}

interface AddressPickerState {
    value: string
    data: any[]
    address: string
    selected: any
    center?: any
    ac?: BMap.Autocomplete
}

const componentID = 'addressInput'

export class AtaliAddressPicker extends React.Component<AddressPickerProps, AddressPickerState>{
    mapRef: React.RefObject<any>
    constructor(props: any) {
        super(props)
        this.state = {
            value: props.field?.value,
            address: "",
            data: [],
            selected: null,
            center: {}
        }
        this.mapRef = React.createRef();
    }

    setLocation(value: string) {
        const map = this.mapRef?.current?.map
        if (!map) return
        const self = this;
        map.clearOverlays();    //清除地图上所有覆盖物
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: () => {
                const result = local.getResults();    //获取第一个智能搜索的结果
                let data: any = undefined
                if (result instanceof Array) {
                    data = result[0]
                } else {
                    data = result
                }
                if (!data) return
                var pp = data.getPoi(0)?.point;    //获取第一个智能搜索的结果
                if (!pp) return
                self.setState({ center: pp })
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));
            }
        });
        local.search(value);
    }
    showSearchResult() {
        if (!this.state.ac) return
        if (this.state.ac.getResults().getNumPois() == 0 && this.state.value !== "") {
            this.state.ac.search(this.state.value)
        } else {
            this.state.ac.show()
        }
    }
    componentDidMount() {
        const ac = new BMap.Autocomplete({
            'input': this.props.id ?? componentID
        });

        ac.onconfirm = e => {
            this.props.onConfirm && this.props.onConfirm(e);
            const value = e.item?.value?.city + e.item?.value?.district + e.item?.value?.business
            this.setState({ value: value })
            this.setLocation(value)
            this.props.onChange?.(value)
        };
        ac.setInputValue(this.props.field?.value)
        this.setState({ ac: ac, value: this.props.field?.value })
    }
    render() {
        return <>
            <Input id={this.props.id ?? componentID} onFocus={() => this.showSearchResult()} onClick={() => {
                this.showSearchResult()
            }} value={this.state.value} onChange={e => {
                this.setState({ value: e.currentTarget.value })
                this.setLocation(e.currentTarget.value)
                this.props.onChange?.(e.currentTarget.value)
                this.state.ac?.show()
            }}></Input>
            {this.props.showMap && <Map enableScrollWheelZoom={true} ref={this.mapRef} style={{ width: this.props.mapWidth ?? '100%', height: this.props.mapHeight ?? 300 }} >
                <NavigationControl />
                <GeolocationControl
                    onLocationSuccess={(e) => {
                        const map = this.mapRef?.current?.map
                        if (!map) return
                        map.centerAndZoom(e.point, 18);
                    }}
                />
            </Map>}
        </>
    }
}

export const BMapAddressPicker = connect(
    AtaliAddressPicker,
    mapProps((props, field) => {
        return {
            ...props,
        }
    }),
    mapReadPretty(PreviewText.Input)
)

export default BMapAddressPicker