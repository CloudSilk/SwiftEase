import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget
} from '@swiftease/designable-react'
import { SettingsForm, setNpmCDNRegistry } from '@swiftease/designable-react-settings-form'
import {
  createDesigner,
  Shortcut,
  KeyCode,
  Engine,
} from '@swiftease/designable-core'
import {
  SchemaEditorWidget,
  MarkupSchemaWidget,
  Inputs,
  AllDesignerComponents,
  Arrays, Displays, Layouts, CustomerComponents, funcs, commonComponents, chartComponents, AtaliValueInput
} from '@swiftease/atali-form'
import { BMapAddressPicker } from '@swiftease/atali-components'
import { PreviewWidget } from './PreviewWidget'
import { ActionsWidget } from './ActionsWidget'
import React from 'react'
import { saveSchema } from './service'
import { matchPath } from '@umijs/max'
setNpmCDNRegistry('//unpkg.com')

interface StationAPPDesignerState {
  engine: Engine
}

export default class StationAPPDesigner extends React.Component<any, StationAPPDesignerState>{
  constructor(props: any) {
    super(props);
    const SaveShortCut = new Shortcut({
      codes: [
        [KeyCode.Meta, KeyCode.S],
        [KeyCode.Control, KeyCode.S],
      ],
      handler(ctx) {
        const list = window.location.href.split("/")
        saveSchema(ctx.engine, list.pop() || "", () => { })
      },
    })
    this.state = {
      engine: createDesigner({
        shortcuts: [
          SaveShortCut
        ],
        rootComponentName: 'Form',
      })
    }
  }


  render() {
    const match = matchPath(
      { path: "/station/app/designer/:appID" },
      location.hash.replace("#",""),
    );
    return (
      <Designer engine={this.state.engine}>
        <StudioPanel actions={<ActionsWidget formID={match?.params?.appID} />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget title="sources.Common" sources={commonComponents} />
              <ResourceWidget title="sources.Charts" sources={chartComponents} />
              <ResourceWidget title="sources.Customer" sources={[...CustomerComponents, BMapAddressPicker]} />
              <ResourceWidget title="sources.Inputs" sources={Inputs} />
              <ResourceWidget title="sources.Layouts" sources={Layouts} />
              <ResourceWidget title="sources.Arrays" sources={Arrays} />
              <ResourceWidget title="sources.Displays" sources={Displays} />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget
                  use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
                />
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  {() => (
                    <ComponentTreeWidget
                      components={{ ...AllDesignerComponents, BMapAddressPicker }}
                    />
                  )}
                </ViewPanel>
                <ViewPanel type="JSONTREE" scrollable={false}>
                  {(tree, onChange) => (
                    <SchemaEditorWidget tree={tree} onChange={onChange} />
                  )}
                </ViewPanel>
                <ViewPanel type="MARKUP" scrollable={false}>
                  {(tree) => <MarkupSchemaWidget tree={tree} />}
                </ViewPanel>
                <ViewPanel type="PREVIEW">
                  {(tree) => <PreviewWidget tree={tree} />}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm scope={funcs} components={{ AtaliValueInput }} />
          </SettingsPanel>
        </StudioPanel>
      </Designer>
    )
  }
}


