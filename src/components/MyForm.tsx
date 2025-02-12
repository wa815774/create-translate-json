import { Button, Form, FormInstance, FormProps, Input } from "antd";
import FieldSelector from "./FieldSelector";
import NumberRange from "./NumberRange";
import TableSelector from "./TableSelector";
import ViewSelector from "./ViewSelector";


export interface FormValues {
  table: string;
  view: string;
  name: string;
  keyField: string;
  valuesField: string[];
  prefix?: string
  range?: [number | undefined, number | undefined] | []
}

interface MyFormProps {
  form: FormInstance<FormValues>
  onFinish: FormProps['onFinish']
}


const MyForm = ({ form, onFinish }: MyFormProps) => {
  const table = Form.useWatch('table', form);
  const view = Form.useWatch('view', form);
  const initialValues = {
    prefix: '',
    range: [1]
  }

  return <Form
    form={form}
    name="basic"
    initialValues={initialValues}
    layout="vertical"
    onFinish={onFinish}
    autoComplete="off"
  >
    <Form.Item
      label="选择数据表"
      name="table"
      rules={[{ required: true, message: 'Please select your table!' }]}
    >
      <TableSelector />
    </Form.Item>

    <Form.Item
      label="选择视图"
      name="view"
      rules={[{ required: true, message: 'Please select your view!' }]}
    >
      <ViewSelector tableId={table} />
    </Form.Item>

    <Form.Item
      label="选择生成key的字段"
      name="keyField"
      rules={[{ required: true, message: 'Please select your field!' }]}
    >
      <FieldSelector tableId={table} viewId={view} />
    </Form.Item>

    <Form.Item
      label="选择生成value的字段"
      name="valuesField"
      rules={[{ required: true, message: 'Please select your field!' }]}
    >
      <FieldSelector mode="multiple" allowClear tableId={table} viewId={view} />
    </Form.Item>


    <Form.Item
      label="前缀"
      name="prefix"
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="行范围"
      name="range"
    >
      <NumberRange />
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        生成 json
      </Button>
    </Form.Item>
  </Form>
}

export default MyForm