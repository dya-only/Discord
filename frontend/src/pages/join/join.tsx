import { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Join = () => {
  const { roomKey } = useParams<{ roomKey: string }>()

  useEffect(() => {
    console.log(roomKey)
  }, [roomKey])

  return (
    <Fragment>
      join url
    </Fragment>
  )
}

export default Join