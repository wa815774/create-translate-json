import "./style.css"
import { Button, Checkbox, Flex, Form, FormInstance, FormProps, Input, Radio, Space, Tooltip } from "antd";
import FieldSelector from "./FieldSelector";
import NumberRange from "./NumberRange";
import TableSelector from "./TableSelector";
import ViewSelector from "./ViewSelector";
import ModeSelector, { Mode } from "./ModeSelector";
import SmartlingRule from "./SmartlingRule";
import { TipIcon } from "../Icon";
import CodeEditor from "./CodeEditor";
import { safeEval } from "../../utils";

export interface FormValues {
  mode: string;
  table: string;
  tableAndView: [string, string];
  view: string;
  name: string;
  keyField: string;
  valuesField: string[];
  prefix?: string
  regExp?: string
  replacement?: string
  customKeyFn?: string
  isCheckKey?: boolean
  range?: [number | undefined, number | undefined] | []
}

interface MyFormProps {
  form: FormInstance<FormValues>
  onFinish: FormProps['onFinish']
  onDownloadAll: (values: FormValues) => void
}

const customCode = `(function hello(key) {
    // 随便写...
    return key // 请在这里返回最终结果
})`


const MyForm = ({ form, onFinish, onDownloadAll }: MyFormProps) => {
  const mode = Form.useWatch('mode', form);
  const table = Form.useWatch('table', form);
  const view = Form.useWatch('view', form);
  // const [table, view] = Form.useWatch('tableAndView', form) || [];
  const initialValues = {
    mode: Mode.default,
    prefix: '',
    range: [1],
    customKeyFn: customCode
  }

  return <>
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      variant={'filled'}
      colon={false}
    >
      <Form.Item
        className="sticky-tabs"
        name="mode"
      >
        <ModeSelector className="form-item--mode" />
      </Form.Item>

      <Form.Item label="表格:" layout="horizontal">
        <Flex align="flex-start" gap={8}>
          <Form.Item
            className="inline-form-item"
            // label="表格"
            name="table"
          // rules={[{ required: true, message: '请选择数据表！' }]}
          >
            <TableSelector />
          </Form.Item>
          <span className="form-item-split">/</span>
          <Form.Item
            className="inline-form-item"
            // label="视图"
            name="view"
          // rules={[{ required: true, message: '请选择视图！' }]}
          >
            <ViewSelector tableId={table} />
          </Form.Item>
        </Flex>
      </Form.Item>

      <Form.Item
        label="行范围:"
        name="range"
        layout="horizontal"
      >
        <NumberRange />
      </Form.Item>

      <Form.Item label="键值对:">
        <Flex gap={8} align="center">
          <span className="form-item-split">{'{'}</span>
          <Flex style={{ width: '100%' }} gap={8} align="center">
            <Form.Item
              // label="键值对"
              name="keyField"
              rules={[{ required: true, message: '请选择生成key的字段！' }]}
              style={{ marginBottom: 0, width: '20vw' }}
            >
              <FieldSelector tableId={table} viewId={view} />
            </Form.Item>

            <span className="form-item-split">:</span>

            <Form.Item
              className="inline-form-item"
              // label="生成value的字段"
              name="valuesField"
              rules={[{ required: true, message: '请选择生成value的字段！' }]}
            >
              <FieldSelector mode="multiple" tableId={table} viewId={view} />
            </Form.Item>
          </Flex>
          <span className="form-item-split">{'}'}</span>
        </Flex>
      </Form.Item>

      <Form.Item
        label="前缀:"
        name="prefix"
      >
        <Input />
      </Form.Item>

      {mode === Mode.regExp && <Form.Item
        label="正则表达式:"
        name="regExp"
        rules={[{ pattern: (/^\/(.*)\/([gimuy]*)$/), message: '格式不正确' }]}
      >
        <Input placeholder="/(w+)/g" />
      </Form.Item>}

      {mode === Mode.regExp && <Form.Item
        label="替换成:"
        name="replacement"
      >
        <Input placeholder="$1" />
      </Form.Item>}

      {mode === Mode.custom && <Form.Item
        label="自定义key:"
        name="customKeyFn"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (value.indexOf('document') > -1 || value.indexOf('fetch') > -1 || !safeEval(value)) {
                console.log('报错了')
                return Promise.reject(new Error('你在搞事情!'));
              }
              return Promise.resolve();
            },
            // validateTrigger: 'blur'
          }),
        ]}
      >
        <CodeEditor defaultValue={customCode} />
      </Form.Item>}


      {mode === Mode.smartling && <Form.Item
        name="isCheckKey"
        valuePropName="checked"
      >
        <Checkbox>
          <Flex gap={8} align="center">
            是否对生成后的key做校验
            <Tooltip placement="right" title={<SmartlingRule />}>
              <TipIcon />
            </Tooltip>
          </Flex>
        </Checkbox>
      </Form.Item>}
    </Form>

    <Flex gap={16} className="sticky-footer-btn">
      <Button type="primary" onClick={form.submit}>
        生成 json
      </Button>
      <Button color="primary" variant="filled" onClick={async () => {
        await form.validateFields()
        onDownloadAll(form.getFieldsValue())
      }}>
        下载全部
      </Button>
    </Flex>
  </>
}

export default MyForm