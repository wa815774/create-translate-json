import { bitable, ITable, ITableMeta, IViewMeta } from "@lark-base-open/js-sdk"
import { Select, SelectProps } from "antd"
import { useEffect, useState } from "react"

const FieldSelector = ({ tableId, viewId, ...props }: SelectProps & {
  tableId: ITableMeta['id'];
  viewId: IViewMeta['id']
}) => {
  const [fieldList, setFieldList] = useState<any[]>([])

  useEffect(() => {
    let off
    init()
      .then(o => (off = o))

    return off
  }, [tableId, viewId])

  const init = async () => {
    if (!tableId || !viewId) return
    const table = await bitable.base.getTable(tableId)
    const view = await table.getViewById(viewId)
    const fieldList = (await view.getFieldMetaList())?.filter(f => f.type === 1) // 只显示文本field
    setFieldList(fieldList)
    let defaultField = props.value || fieldList.find(f => f.name === '英文') || fieldList[0]
    if (defaultField) {
      const valid = fieldList.some(f => f.id === defaultField.id)
      if (!valid) {
        defaultField = fieldList[0]
      }
    }

    if (!props.value) {
      props.onChange?.(
        defaultField?.id
          ? props.mode == 'multiple'
            ? [defaultField.id]
            : defaultField.id
          : undefined
      )
    }

    const off = listen(table)
    return off
  }

  const listen = (table: ITable) => {
    const off = table.onFieldDelete((event) => {
      init()
    })
    const off2 = table.onFieldAdd((event) => {
      init()
    })
    return () => {
      off()
      off2()
    }
  }

  return <Select
    {...props}
    options={fieldList.map(t => ({ label: t.name, value: t.id }))}
  />
}

export default FieldSelector