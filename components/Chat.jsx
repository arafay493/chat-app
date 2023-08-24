import React from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'
import { useChats } from '@/context/chatContext'

const Chat = () => {
    const {data} = useChats()
  return (
    <div className='flex flex-col p-5 grow'>
        <ChatHeader />
        {data.chatId && <Messages />}
    </div>
  )
}

export default Chat