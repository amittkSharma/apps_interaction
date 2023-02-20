import React, { useEffect, useRef, useState } from 'react'
import { notifyUser } from '../components'
import { FaCC } from '../models'

export const WsConnectionProvider: FaCC<any, any> = props => {
  const [message, setMessage] = useState<string>()
  const wsUrl = 'ws://localhost:8081'
  const ws = useRef<WebSocket>()
  const [socket, setSocket] = useState<WebSocket>()
  let timeout = 250

  useEffect(() => {
    ws.current = new WebSocket(wsUrl)
    setSocket(ws.current)
  }, [])

  useEffect(() => {
    if (ws.current) {
      connect()
    }
  })

  const connect = () => {
    if (ws.current) {
      let connectInterval: any
      // websocket onopen event listener
      ws.current.onopen = () => {
        notifyUser(`Connect to server on url: ${wsUrl}`, 'Success')
        timeout = 250 // reset timer to 250 on open of websocket connection
        clearTimeout(connectInterval) // clear Interval on on open of websocket connection
      }

      // websocket onclose event listener
      ws.current.onclose = e => {
        notifyUser(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
            10000 / 1000,
            (timeout + timeout) / 1000,
          )} second. ${e.reason}`,
          'Info',
        )

        timeout = timeout + timeout // increment retry interval
        connectInterval = setTimeout(check, Math.min(10000, timeout)) // call check function after timeout
      }

      // websocket onerror event listener
      ws.current.onerror = err => {
        notifyUser(
          `Error encountered on the server ${wsUrl}'. Closing socket due to error: ${err}`,
          'Error',
        )
        if (ws.current) {
          ws.current.close()
        }
      }

      ws.current.onmessage = (messageReceived: MessageEvent) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          setMessage(JSON.parse(messageReceived.data))
        } else {
          notifyUser(`Unable to send the data on server: ${wsUrl}`, 'Error')
        }
      }
    }
  }

  // /**
  //  * utilized by the @function connect to check if the connection is close, if so attempts to reconnect
  //  */
  const check = () => {
    if (ws.current) {
      if (!ws || ws.current.readyState === WebSocket.CLOSED) {
        console.log(`Hello check.....`)
        connect()
      }
    }
  }

  const sendRequest = (
    data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView | undefined,
  ) => {
    if (ws.current) {
      console.log('Sending data to the websocket...')
      if (data !== undefined) {
        ws.current.send(data)
      }
    }
  }

  return (
    <>
      {ws.current
        ? // eslint-disable-next-line react/prop-types
          props.children(message, sendRequest, socket?.readyState)
        : undefined}
    </>
  )
}
