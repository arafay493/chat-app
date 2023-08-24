import { useChats } from '@/context/chatContext'
import React, { useState } from 'react'

const ChatHeader = () => {
    const [showMenu , setShowMenu] = useState(false)
    const {users , data} = useChats()

    const online = users[data.user.uid] 
  return (
    <div>ChatHeader</div>
  )
}

export default ChatHeader