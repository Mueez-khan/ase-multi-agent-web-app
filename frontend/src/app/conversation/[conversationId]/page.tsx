'use client'

import React, { useState } from 'react'
import Sidebar from '../../../../components/Sidebar'
import ChatSection from '../../../../components/ChatSection'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-zinc-900">
      <Sidebar isOpen={isSidebarOpen} />
      <ChatSection />

      {/* Single toggle, always visible, slides with the sidebar edge */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        className={`absolute top-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'left-[17.5rem]' : 'left-3'
        }`}
      >
        {isSidebarOpen ? (
          <PanelLeftClose size={15} />
        ) : (
          <PanelLeftOpen size={15} />
        )}
      </button>
    </div>
  )
}