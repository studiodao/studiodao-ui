import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Link from 'next/link'
import { CSSProperties, useEffect, useState } from 'react'
import Logo from './Logo'

import {
  navDropdownItem,
  navMenuItemStyles,
  topLeftNavStyles,
} from './navStyles'


function NavMenuItem({
  text,
  route,
  onClick,
}: {
  text: string
  route?: string
  onClick?: VoidFunction
}) {
  if (!route) {
    return (
      <div
        className="nav-menu-item hover-opacity"
        onClick={onClick}
        role="button"
        style={navMenuItemStyles}
      >
        {text}
      </div>
    )
  }

  const external = route?.startsWith('http')
  if (external) {
    return (
      <ExternalLink
        className="nav-menu-item hover-opacity"
        style={navMenuItemStyles}
        href={route}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </ExternalLink>
    )
  }
  return (
    <Link href={route}>
      <a
        className="nav-menu-item hover-opacity"
        onClick={onClick}
        style={navMenuItemStyles}
      >
        {text}
      </a>
    </Link>
  )
}


export function TopLeftNavItems({
  mobile,
  onClickMenuItems,
}: {
  mobile?: boolean
  onClickMenuItems?: VoidFunction
}) {
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false)
  const dropdownIconStyle: CSSProperties = {
    fontSize: 13,
    marginLeft: 7,
  }

  // Close resources dropdown when clicking anywhere in the window except the dropdown items
  useEffect(() => {
    function handleClick() {
      setResourcesOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <Space
      size={mobile ? 0 : 'large'}
      style={{ ...topLeftNavStyles }}
      direction={mobile ? 'vertical' : 'horizontal'}
    >
      <Link href="/">
          <a style={{ display: 'inline-block' }}>{<Logo />}</a>
        </Link>
    </Space>
  )
}
