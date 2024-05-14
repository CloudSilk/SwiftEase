import type { ProSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { createSchemaField } from '@/pages/form/field'
import Avatar from '@/components/RightContent/index';
import './index.less'
import Shortcuts from './components/Shortcuts';
import { LeftNav, ComplexPage } from '@swiftease/atali-curd';
import { ViewComponent, newService } from '@swiftease/atali-form';
import { CommonService } from '@swiftease/atali-pkg';
import React from 'react';
interface StationAppProps { }
interface StationAppState {
  productionLineService: CommonService<any>
  stationService: CommonService<any>
  factoryService: CommonService<any>
  selectedFactoryID: any
  selectedProductionLineID: any
  selectedStationID: any
  execOrderByMes: boolean
  settings: Partial<ProSettings>
}

export default class StationApp extends React.Component<StationAppProps, StationAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      productionLineService: newService('aiot/productionline'),
      stationService: newService('aiot/station'),
      factoryService: newService('aiot/factory'),
      settings: {
        layout: 'mix',
        contentWidth: 'Fluid',
        fixedHeader: true,
        fixSiderbar: true,
        colorWeak: false,
        logo: (process.env.WEB_BASE !== undefined && process.env.WEB_BASE !== "" ? process.env.WEB_BASE : "") + '/icon-32x32.png',
        iconfontUrl: "//at.alicdn.com/t/font_2590742_729agyh0ndx.js",
        menuRender: false,
        title: "工站配置",
        waterMarkProps: {
          content: '工站配置',
        },
        token: {
          bgLayout: "#C8C8C8",
          header: {
            colorBgHeader: '#0ec7a7',
            colorBgMenuItemSelected: "#06A88D",
            colorHeaderTitle: '#fff',
            colorTextMenu: '#fff',
            colorTextMenuSecondary: '#dfdfdf',
            colorTextMenuSelected: '#fff',
            colorTextRightActionsItem: '#dfdfdf',
          },
          sider: {
            colorMenuBackground: '#DDE1EA',
            colorTextMenuSelected: '#0ec7a7',
            colorBgMenuItemSelected: '#e6fff7',
          },
          pageContainer: {
            paddingBlockPageContainerContent: 0,
            paddingInlinePageContainerContent: 0
          }
        },
      }
    }
  }

  render(): React.ReactNode {
    return (
      <div id="station">
        <ComplexPage
          title='工站配置'
          settings={this.state.settings}
          createSchemaField={createSchemaField}
          grandpaService={this.state.factoryService}
          grandpaFieldName='factoryID'
          grandpaPageName='Factory'
          grandpaTitle='工厂'
          fatherService={this.state.productionLineService}
          fatherFieldName='productionLineID'
          fatherPageName='ProductionLine'
          fatherTitle='产线'
          sonService={this.state.stationService}
          sonPageName='Station'
          detailFormID='99089ea6-745d-4a8f-bb77-d0fabeca1d97'
          getDetail={async (id) => {
            const resp = await this.state.stationService.get<any>("/api/aiot/station/detail/full", { id: id })
            this.setState({ execOrderByMes: resp.data?.execOrderByMes })
            return resp
          }}
          avatar={<Avatar />}
          newShortcuts={(selectedGrandpaID: any, selectedFatherID: any, selectedSonID: any, sonDetailView: React.RefObject<ViewComponent>, leftNavView: React.RefObject<LeftNav>) => {
            return <div><Shortcuts
              execOrderByMes={this.state.execOrderByMes}
              createSchemaField={createSchemaField}
              productionLineService={this.state.productionLineService}
              stationService={this.state.stationService}
              factoryService={this.state.factoryService}
              selectedFactoryID={selectedGrandpaID}
              selectedProductionLineID={selectedFatherID}
              selectedStationID={selectedSonID}
              addFactorySuccess={() => {
                leftNavView.current?.getGrandpaList()
              }}
              addProductionLineSuccess={() => {
                leftNavView.current?.getFatherList(selectedGrandpaID)
              }}
              addStationSuccess={() => {
                leftNavView.current?.getSonList(selectedFatherID)
              }}
              addStationDeviceSuccess={() => {
                sonDetailView.current?.reload()
              }}
              addStationAPPSuccess={() => {
                sonDetailView.current?.reload()
              }}
              addStationFunctionSuccess={() => {
                sonDetailView.current?.reload()
              }}
              addWorkmanshipSuccess={() => {
                sonDetailView.current?.reload()
              }}></Shortcuts></div>
          }}
        ></ComplexPage>
        <SettingDrawer
          enableDarkTheme
          getContainer={() => document.getElementById('station')}
          settings={this.state.settings}
          onSettingChange={(changeSetting) => {
            this.setState({ settings: changeSetting });
          }}
          disableUrlParams={true}
        />
      </div>
    );
  }
}