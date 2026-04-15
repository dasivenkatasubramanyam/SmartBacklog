import React from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Header from '../components/Header'
import Column from '../components/Column'
import TicketModal from '../components/TicketModal'
import { useBoard } from '../context/BoardContext'

export default function Board() {
  const { moveTicket } = useBoard()

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // Dropped outside a column
    if (!destination) return

    // Dropped in the same place
    if (destination.droppableId === source.droppableId) return

    // Move ticket to new column
    moveTicket(draggableId, destination.droppableId)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <Column id="todo" />
            <Column id="inprogress" />
            <Column id="done" />
          </div>
        </main>
        <TicketModal />
      </div>
    </DragDropContext>
  )
}