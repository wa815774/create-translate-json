import "./App.css"
import { useRef, useState } from 'react';
import { bitable } from "@lark-base-open/js-sdk";
import MyForm, { FormValues } from './components/Form/MyForm';
import CodePreview from './components/CodePreview';
import { Divider, Form, Typography } from "antd";


export default function App() {
  const [form] = Form.useForm<FormValues>();
  const [submitValue, setSubmitValue] = useState<FormValues>();
  const [cellOfKeys, setCellOfKeys] = useState<{ type: string; text: string }[][]>([])
  const [cellOfValues, setCellOfValues] = useState<{ name: string; id: string; cells: { type: string; text: string }[][] }[]>([])
  const codePreviewRef = useRef<any>()

  const handleData = async (values: FormValues) => {
    console.log('values', values)
    const table = await bitable.base.getTable(values.table)
    const view = await table.getViewById(values.view)
    const recordIdList = await view.getVisibleRecordIdList()
    const keyFieid = await table.getField(values.keyField)
    const valuesField = await Promise.all(values.valuesField.map(f => table.getField(f)))
    const min = Math.max((values.range?.[0] || 0) - 1, 0)
    const max = values.range?.[1] || Number.MAX_SAFE_INTEGER
    let cellOfKeys = (await Promise.all(recordIdList.map(c => keyFieid.getValue(c as any))))
    cellOfKeys = cellOfKeys.slice(min, max).filter(c => c)
    const cellOfValues = await
      Promise.all(
        valuesField.map(async (f) => {
          const cells = await Promise.all(cellOfKeys.map((c, i) => f.getValue(recordIdList[i + min] as any)))
          return {
            ...f,
            name: await f.getName(),
            id: f.id,
            cells
          }
        })
      )

    // console.log('cellOfKeys', cellOfKeys)
    // console.log('cellOfValues', cellOfValues)
    setCellOfKeys(cellOfKeys)
    setCellOfValues(cellOfValues)
    setSubmitValue(values)
  }

  const handleFinish = async (values: FormValues) => {
    await handleData(values)

    setTimeout(() => {
      codePreviewRef.current?.scrollIntoView()
    }, 20)
  }

  const handleDownloadAll = async (values: FormValues) => {
    await handleData(values)
    setTimeout(() => {
      codePreviewRef.current?.downloadAll()
    }, 20)
  }

  return (
    <>
      <MyForm form={form} onFinish={handleFinish} onDownloadAll={handleDownloadAll} />
      <CodePreview
        ref={codePreviewRef}
        mode={submitValue?.mode || ''}
        prefix={submitValue?.prefix || ''}
        regExp={submitValue?.regExp || ''}
        replacement={submitValue?.replacement}
        customKeyFn={submitValue?.customKeyFn}
        isCheckKey={submitValue?.isCheckKey}
        cellOfKeys={cellOfKeys}
        cellOfValues={cellOfValues}
      />
    </>
  );
}