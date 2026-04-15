import React from 'react'
import { Plus } from 'lucide-react'
import { Droppable } from '@hello-pangea/dnd'
import { useBoard } from '../context/BoardContext'
import TicketCard from './TicketCard'

const COLUMN_CONFIG = {
  todo:       { label: 'To Do',       dotClass: 'bg-gray-400' },
  inprogress: { label: 'In Progress', dotClass: 'bg-amber-400' },
  done:       { label: 'Done',        dotClass: 'bg-teal-400' }
}

export default function Column({ id }) {
  const { tickets, openNewModal } = useBoard()
  const config = COLUMN_CONFIG[id]
  const colTickets = tickets.filter(t => t.column === id)

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {config.label}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {colTickets.length}
          </span>
        </div>
        <button
          onClick={() => openNewModal(id)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Droppable ticket area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-xl p-2 flex flex-col gap-2 transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-teal-50 border-2 border-dashed border-teal-300'
                : 'bg-gray-100/60'
            }`}
          >
            {colTickets.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-gray-400 text-center py-8">
                  No tickets yet<br />
                  <button
                    onClick={() => openNewModal(id)}
                    className="mt-1 text-teal-500 hover:underline"
                  >
                    Add one
                  </button>
                </p>
              </div>
            ) : (
              colTickets.map((ticket, index) => (
                <TicketCard key={ticket.id} ticket={ticket} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}