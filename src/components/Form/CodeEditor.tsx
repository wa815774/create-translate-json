import { useEffect } from "react";
import * as monaco from 'monaco-editor'

const CodeEditor = ({ defaultValue, onChange, onBlur }: any) => {
    useEffect(() => {
        const dom = document.getElementById("code-editor")
        if (!dom || !monaco) return
        let editor = monaco.editor.create(dom, {
            value: defaultValue,
            language: "javascript",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            theme: "vs-dark",
            padding: { top: 8, bottom: 8 },
            minimap: {
                enabled: false // 关闭右上角的预览框  
            },
        });
        if (defaultValue) {
            onChange?.(defaultValue)
        }
        editor.onDidBlurEditorText((e) => {
            // console.log('不编辑了', editor.getValue())
            onBlur?.(editor.getValue())
        })
        editor.onDidChangeModelContent((e) => {
            onChange?.(editor.getValue())
        })

        return () => {
            editor.dispose()
            editor = null as any
        }
    }, []);

    return <div id="code-editor" style={{
        height: 300,
        borderRadius: 8,
        overflow: 'hidden'
    }}></div>
}

export default CodeEditor