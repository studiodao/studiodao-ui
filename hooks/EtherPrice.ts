import { useState } from 'react'

export function useEtherPrice() {
  const [price, setPrice] = useState<number>(0)

  setPrice(1)

  return price
}
