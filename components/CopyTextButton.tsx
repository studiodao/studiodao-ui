import { CopyOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { CSSProperties, useContext, useState } from 'react'

// Copies a given text to clipboard when clicked
export default function CopyTextButton({
  value,
  style = {},
}: {
  value: string | undefined
  style?: CSSProperties
}) {
  const primaryTextColor = 'black'
  const [copied, setCopied] = useState<boolean>(false)
  const copyText = () => {
    if (navigator) {
      navigator.clipboard.writeText(value ?? '')
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }
  return (
    <Tooltip
      trigger={['hover']}
      title={<span>{copied ? `Copied!` : `Copy to clipboard`}</span>}
    >
      <CopyOutlined
        onClick={copyText}
        className="copyIcon"
        style={{ ...style, color: primaryTextColor }}
      />
    </Tooltip>
  )
}
