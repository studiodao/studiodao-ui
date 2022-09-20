export default function Logo({ height }: { height?: number }) {

  if (!height) {
    height = 30
  }

  return (
    <img
      style={{ height }}
      src={
        'https://assets.website-files.com/62c4a1bbbb81016b15e64da5/62c4b4c079fd5838d3f8ccb5_StudioDao_Type01.svg'
      }
      alt="StudioDao logo"
    />
  )
}
