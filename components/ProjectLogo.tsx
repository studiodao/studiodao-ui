import { useContext, useState } from 'react'

export default function ProjectLogo({
  uri,
  name,
  size,
}: {
  uri: string | undefined
  name: string | undefined
  size?: number
}) {
  const [srcLoadError, setSrcLoadError] = useState(false)
  const validImg = uri && !srcLoadError

  const _size = size ?? 80

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: _size,
        width: _size,
        borderRadius: '1px',
        background: validImg ? undefined : 'light-gray',
      }}
    >
      {validImg ? (
        <img
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '4px'
          }}
          src={uri}
          alt={name + ' logo'}
          onError={() => setSrcLoadError(true)}
        />
      ) : (
        <div
          style={{
            fontSize: '2.5rem',
          }}
        >
          🧃
        </div>
      )}
    </div>
  )
}
