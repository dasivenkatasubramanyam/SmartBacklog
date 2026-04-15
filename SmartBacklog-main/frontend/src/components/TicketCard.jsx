import React, { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Trash2, ChevronRight, ChevronLeft, Sparkles, AlertTriangle, AlertCircle } from 'lucide-react'
import { useBoard } from '../context/BoardContext'

const COLUMNS = ['todo', 'inprogress', 'done']

const PRIORITY_CONFIG = {
  low:      { label: 'Low',      classes: 'bg-gray-100 text-gray-600' },
  medium:   { label: 'Medium',   classes: 'bg-blue-50 text-blue-700 border border-blue-200' },
  high:     { label: 'High',     classes: 'bg-amber-50 text-amber-700 border border-amber-200' },
  blocking: { label: 'Blocking', classes: 'bg-red-50 text-red-700 border border-red-200' }
}

const POINTS_COLOR = {
  1:  'bg-green-50 text-green-700',
  2:  'bg-green-50 text-green-700',
  3:  'bg-blue-50 text-blue-700',
  5:  'bg-blue-50 text-blue-700',
  8:  'bg-amber-50 text-amber-700',
  13: 'bg-red-50 text-red-700'
}

export default function TicketCard({ ticket, index }) {
  const { openEditModal, deleteTicket, moveTicket } = useBoard()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const colIdx = COLUMNS.indexOf(ticket.column)
  const priority = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.medium

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirmDelete) {
      deleteTicket(ticket.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => openEditModal(ticket)}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all ${
            snapshot.isDragging
              ? 'border-teal-400 shadow-lg rotate-1'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }`}
        >
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 leading-snug flex-1">
              {ticket.title}
            </h3>
            {ticket.aiGenerated && (
              <span className="flex-shrink-0 flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-100">
                <Sparkles size={9} /> AI
              </span>
            )}
          </div>

          {/* Description */}
          {ticket.description && (
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
              {ticket.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {ticket.points && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${POINTS_COLOR[ticket.points] || 'bg-gray-100 text-gray-600'}`}>
                {ticket.points} pts
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${priority.classes}`}>
              {ticket.priority === 'blocking' && <AlertTriangle size={10} />}
              {ticket.priority === 'high' && <AlertCircle size={10} />}
              {priority.label}
            </span>
            {ticket.criteria?.length > 0 && (
              <span className="text-xs text-gray-400">
                {ticket.criteria.length} criteria
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (colIdx > 0) moveTicket(ticket.id, COLUMNS[colIdx - 1])
                }}
                disabled={colIdx === 0}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (colIdx < COLUMNS.length - 1) moveTicket(ticket.id, COLUMNS[colIdx + 1])
                }}
                disabled={colIdx === COLUMNS.length - 1}
                className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <button
              onClick={handleDelete}
              className={`p-1 rounded transition-colors ${
                confirmDelete
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
              }`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}