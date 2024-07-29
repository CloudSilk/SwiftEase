import { Col, Row } from 'antd';
import type { ProSettings } from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import './index.less'
import { LeftNav } from './LeftNav';
import { ViewComponent } from '@swiftease/atali-form';
import { CommonService, getBodyHeight } from '@swiftease/atali-pkg';
import React from 'react';
interface ComplexPageProps {
  createSchemaField?: (formSchema: any, funcs: any, horizontal: boolean) => JSX.Element
  newShortcuts: (selectedGrandpaID: any, selectedFatherID: any, selectedSonID: any, sonDetailView: React.RefObject<ViewComponent>, leftNavView: React.RefObject<LeftNav>) => JSX.Element
  avatar: JSX.Element
  leftNav?: JSX.Element
  detailElement?: JSX.Element
  settings: Partial<ProSettings>
  fatherService: CommonService<any>
  sonService: CommonService<any>
  grandpaService: CommonService<any>
  grandpaPageName: string
  grandpaFieldName: string
  grandpaTitle: string
  fatherPageName: string
  fatherFieldName: string
  fatherTitle: string
  sonPageName: string
  getDetail?: (id: any) => any
  detailFormID: string
  title: string
}
interface ComplexPageState {
  selectedGrandpaID: any
  selectedFatherID: any
  selectedSonID: any
  height: number
}

export class ComplexPage extends React.Component<ComplexPageProps, ComplexPageState> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedGrandpaID: "",
      selectedFatherID: "",
      selectedSonID: "",
      height: getBodyHeight() - 60,
    }
    this.sonDetailView = React.createRef()
    this.leftNavView = React.createRef()
  }

  sonDetailView: React.RefObject<ViewComponent>;
  leftNavView: React.RefObject<LeftNav>;
  resizeFn(self: ComplexPage) {
    return () => {
      self.setState({ height: getBodyHeight() - 60 })
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeFn(this))
  }
  render(): React.ReactNode {
    return (
      <ProLayout
        {...this.props.settings}
        title={this.props.title}
        actionsRender={() => {
          return [<div>
            {this.props.avatar ?? <></>}
          </div>]
        }}
        footerRender={false}
        headerContentRender={() => {
          return <div>{this.props.newShortcuts(this.state.selectedGrandpaID, this.state.selectedFatherID, this.state.selectedSonID, this.sonDetailView, this.leftNavView)}</div>
        }}

      >
        <div style={{ margin: "0px 0 0 0" }}>
          <Row>
            <Col span={8} style={{ paddingRight: "10px" }}>
              {this.props.leftNav || <LeftNav
                ref={this.leftNavView}
                createSchemaField={this.props.createSchemaField}
                grandpaService={this.props.grandpaService}
                grandpaFieldName={this.props.grandpaFieldName}
                grandpaPageName={this.props.grandpaPageName}
                grandpaTitle={this.props.grandpaTitle}
                fatherService={this.props.fatherService}
                fatherFieldName={this.props.fatherFieldName}
                fatherPageName={this.props.fatherPageName}
                fatherTitle={this.props.fatherTitle}
                sonService={this.props.sonService}
                sonPageName={this.props.sonPageName}
                onChangeGrandpa={(id) => {
                  this.setState({ selectedGrandpaID: id });
                }}
                onChangeFather={(id) => {
                  this.setState({ selectedFatherID: id });
                }}
                onChangeSon={(id) => {
                  this.setState({ selectedSonID: id });
                }}></LeftNav>}</Col>
            <Col span={16}>
              <div style={{ height: getBodyHeight() - 60, overflowY: "scroll" }}>
                {this.props.detailElement || <ViewComponent ref={this.sonDetailView} createSchemaField={this.props.createSchemaField} getDetail={async (id) => {
                  const resp = await this.props.sonService.detail(id)
                  return resp
                }} id={this.state.selectedSonID} formID={this.props.detailFormID} funcs={{
                  reloadSon: () => {
                    this.sonDetailView.current?.reload()
                  }
                }}></ViewComponent>}
              </div>
            </Col>
          </Row>
        </div>
      </ProLayout>
    );
  }
}