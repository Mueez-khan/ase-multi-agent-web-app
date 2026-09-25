'use client'

import React, { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Sidebar({ isOpen }) {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [query, setQuery] = useState('')
  const [activeChat, setActiveChat] = useState(null)
  const [chats, setChats] = useState([])

  const handleUserChats = async () => {
    try {
      const result = await fetch(
        'http://localhost:3000/api/conversations',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!result.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await result.json()

      console.log('User conversations:', data)
      console.log('Conversations:', data.response)

      setChats(data.response || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setChats([])
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      handleUserChats()
    }
  }, [status])

  const handleNavigation = (id ) => {
    setActiveChat(id)
    router.push(`/conversation/${id}`)

  }

  const handleNewChat = () => {
    const uuid = window.crypto.randomUUID();
    console.log("Sidebar uuid" , uuid)
    router.push(`/conversation/${uuid}`)

  }
  // Search conversations by title
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className={`h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-0 border-r-0'
      }`}
    >
      <div className="w-72 h-full flex flex-col shrink-0">

        {/* Brand */}
        <div className="flex items-center gap-2 px-4 pt-5 pb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 flex items-center justify-center text-zinc-950 font-black text-sm">
            SE
          </div>

          <div className="leading-tight">
            <p className="text-white font-bold text-sm">
              Studio
            </p>

            <p className="text-zinc-500 text-xs">
              Personal workspace
            </p>
          </div>
        </div>

        {/* New chat */}
        <div className="px-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-400 transition-colors text-zinc-950 font-semibold text-sm py-2.5"
          >
            <Plus size={16} strokeWidth={2.5} />
            New chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 mt-3">
          <div className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-teal-500/60 px-3 py-2">
            <Search
              size={15}
              className="text-zinc-500 shrink-0"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none w-full"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-3 mt-4 space-y-1">

          {filteredChats.length === 0 && (
            <p className="text-zinc-600 text-sm text-center mt-6">
              {query ? 'No chats found' : 'No conversations yet'}
            </p>
          )}

          {filteredChats.map((chat) => {
            const isActive = activeChat === chat.id

            return (
              <button
                key={chat.id}
                onClick={() => handleNavigation(chat.id)}
                className={`w-full flex items-start gap-2 text-left rounded-xl px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <MessageSquare
                  size={15}
                  className={`mt-0.5 shrink-0 ${
                    isActive
                      ? 'text-teal-400'
                      : 'text-zinc-600'
                  }`}
                />

                <span className="line-clamp-2 leading-snug">
                  {chat?.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-3 py-3 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-xs font-bold">
                MK
              </div>

              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-zinc-950 animate-pulse" />
            </div>

            <div className="leading-tight">
              <p className="text-white text-xs font-semibold">
                Mueez
              </p>

              <p className="text-zinc-500 text-[11px] flex items-center gap-1">
                <Sparkles size={10} />
                Pro
              </p>
            </div>
          </div>

          <button className="text-zinc-500 hover:text-white transition-colors">
            <Settings size={17} />
          </button>

        </div>

      </div>
    </div>
  )
}

export default Sidebar