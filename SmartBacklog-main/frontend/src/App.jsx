import React from 'react'
import { BoardProvider } from './context/BoardContext'
import Board from './pages/Board'

export default function App() {
  return (
    <BoardProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Board />
      </div>
    </BoardProvider>
  )
}