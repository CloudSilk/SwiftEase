import { useEffect, useState } from 'react'
import { Space, Button, Radio, Modal, Input, Form, Select, message } from 'antd'
import { useDesigner, TextWidget } from '@swiftease/designable-react'
import { GlobalRegistry } from '@swiftease/designable-core'
import { observer } from '@formily/react'
import { loadInitialSchema, saveSchema, publishSchema, StationAPP } from './service'
import { transformToSchema, transformToTreeNode } from '@swiftease/designable-formily-transformer'

export const ActionsWidget = observer((props:any) => {
  const designer = useDesigner()
  const [versions, setVersions] = useState<any[]>([])
  const [formSchame, setFormSchame] = useState<StationAPP>({} as StationAPP)
  const [selectedVersion, setSelectedVersion] = useState<number>(0)
  useEffect(() => {
    loadInitialSchema(designer, props?.formID, (data: StationAPP) => {
      setFormSchame(data)
      const list: any[] = [{
        label: '当前版本',
        value: 0
      }]
      data.versions?.forEach(v => {
        list.push({ label: v.version, value: v["id"], schema: v.schema })
      })
      setVersions(list)
    })
  }, [])

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [version, setVersion] = useState('')
  const [description, setDescription] = useState('')

  const showModal = () => {
    if (selectedVersion > 0) {
      message.warning('已发布的版本不能在生成版本')
      return
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    publishSchema(() => {
      setIsModalVisible(false);
    }, designer, props?.formID, version, description)

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Space style={{ marginRight: 10 }}>
      <a>{formSchame?.name}</a>
      <div><a>版本选择：</a><Select style={{ width: 150 }} defaultValue={0} value={selectedVersion}
        options={versions} onSelect={(value:number, option:any) => {
          if (selectedVersion == 0) {
            formSchame.schema = JSON.stringify(
              transformToSchema(designer.getCurrentTree(), {
                designableFieldName: 'DesignableField',
                designableFormName: 'Root',
              })
            )
          }
          setSelectedVersion(value)
          if (value > 0 && option.schema && option.schema !== "") {
            designer.setCurrentTree(
              transformToTreeNode(JSON.parse(option.schema), {
                designableFieldName: 'DesignableField',
                designableFormName: 'Root',
              })
            )
          } else if (value == 0) {
            designer.setCurrentTree(
              transformToTreeNode(JSON.parse(formSchame.schema), {
                designableFieldName: 'DesignableField',
                designableFormName: 'Root',
              })
            )
          }
        }}
      ></Select></div>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button
        onClick={() => {
          if (selectedVersion > 0) {
            message.warning('已发布的版本不能编辑')
            return
          }
          saveSchema(designer, props?.formID, () => {
            formSchame.schema = JSON.stringify(
              transformToSchema(designer.getCurrentTree(), {
                designableFieldName: 'DesignableField',
                designableFormName: 'Root',
              })
            )
          })
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={showModal}
      >
        <TextWidget>Publish</TextWidget>
      </Button>
      <Modal title="版本发布" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="版本号"
            name="version"
          >
            <Input placeholder="版本号" value={version} onChange={(props) => {
              setVersion(props.target.value)
            }} />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea placeholder="描述" value={description} onChange={(props) => {
              setDescription(props.target.value)
            }} /></Form.Item>
        </Form>
      </Modal>
    </Space>
  )
})
