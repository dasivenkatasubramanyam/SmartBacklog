import React from 'react'
import { Plus, Zap } from 'lucide-react'
import { useBoard } from '../context/BoardContext'

export default function Header() {
  const { tickets, openNewModal } = useBoard()
  const total = tickets.length
  const done = tickets.filter(t => t.column === 'done').length

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">SmartBacklog</span>
          <span className="text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
            AI
          </span>
        </div>
        <span className="hidden sm:block text-sm text-gray-400 ml-2">
          {done}/{total} tickets completed
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
          AI Coach active
        </div>
        <button
          onClick={() => openNewModal()}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          New ticket
        </button>
      </div>
    </header>
  )
}