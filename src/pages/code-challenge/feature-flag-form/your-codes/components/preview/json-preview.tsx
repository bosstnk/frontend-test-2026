import { Editor } from '@monaco-editor/react'
import { useIsDarkMode } from './use-is-dark-mode'

interface JsonPreviewProps {
  value: unknown
}

export function JsonPreview({ value }: JsonPreviewProps) {
  const isDark = useIsDarkMode()

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <h2 className="border-b border-border px-4 py-3 text-sm font-medium">
        JSON Preview
      </h2>
      <Editor
        height="480px"
        language="json"
        theme={isDark ? 'vs-dark' : 'light'}
        value={JSON.stringify(value, null, 2)}
        options={{ readOnly: true, minimap: { enabled: false } }}
      />
    </section>
  )
}
