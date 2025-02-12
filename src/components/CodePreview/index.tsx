import { Button, message, Tabs, TabsProps } from "antd"
import { useMemo, useRef } from "react"
import { copyTextToClipboard, removeExtraLineBreaks, removeSpecialChars, splitWithLineThrough } from "../../utils"
import "./style.css"

export interface CodePreviewProps {
  prefix: string
  cellOfKeys: { type: string; text: string }[][]
  cellOfValues: { name: string; id: string; cells: { type: string; text: string }[][] }[]
}

const CodePreview = ({
  prefix = '',
  cellOfKeys = [],
  cellOfValues = []
}: CodePreviewProps) => {
  const codeRef = useRef<HTMLElement>(null)
  const [messageApi, contextHolder] = message.useMessage();

  // 生成key
  const createKey = (
    orignKey: string,
    obj: Record<string, string> = {},
    level = 0
  ): string => {
    if (!orignKey) return ''
    let key = level ? `${level}-${orignKey}` : orignKey
    key = removeSpecialChars(removeExtraLineBreaks(
      splitWithLineThrough(key.toLowerCase())
    ), true)
    key = (prefix + key).slice(0, 24)

    if (!obj[key]) {
      level > 0 && console.error(`${orignKey} 已存在，修改为 ${key}`)
      return key
    }
    return createKey(orignKey, obj, level + 1)
  }

  // 生成json
  const createJSON = (
    fieldName: string,
    cellOfKeys: CodePreviewProps['cellOfKeys'],
    values: CodePreviewProps['cellOfValues'][0]['cells']
  ) => {
    try {
      let obj: Record<string, string> = {}
      cellOfKeys.forEach((c, i) => {
        let key = createKey(c[0].text, obj)
        const val = values[i]?.[0]?.text || ''
        if (key) {
          obj[key] = val
        }
        !val && console.error(`列（${fieldName}）：${key} 的值为空`)
      })

      return JSON.stringify(obj, null, 2)
    } catch (e) {
      console.log(e)
      return ''
    }
  }

  // 每个field下的json
  const jsonList = useMemo(() => {
    return cellOfValues.map(v => createJSON(v.name, cellOfKeys, v.cells))
  }, [cellOfKeys, cellOfValues])


  const copy = () => {
    copyTextToClipboard(codeRef.current?.textContent || '')
    messageApi.info('复制成功！')
  }

  const renderJSON = (json: string) => <div className="code-preview">
    <Button
      type="link"
      style={{ position: 'absolute', right: 0, top: 0 }}
      onClick={copy}
    >复制</Button>
    <code ref={codeRef}>
      <div className="json">{json}</div>
    </code>
  </div>

  const items: TabsProps['items'] = useMemo(() => {
    return jsonList.map((json, i) => ({
      key: cellOfValues[i].id,
      label: cellOfValues[i].name,
      children: renderJSON(json)
    }))
  }, [jsonList])



  if (!cellOfKeys?.length) return null

  return <>
    {contextHolder}
    <Tabs
      items={items}
    />
  </>
}

export default CodePreview