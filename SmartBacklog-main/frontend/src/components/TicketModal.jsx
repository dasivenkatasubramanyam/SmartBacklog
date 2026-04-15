import React, { useState, useEffect } from 'react'
import { X, Sparkles, Loader2, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { useBoard } from '../context/BoardContext'
import { useAI } from '../hooks/useAI'

const FIBONACCI = [1, 2, 3, 5, 8, 13]
const PRIORITIES = ['low', 'medium', 'high', 'blocking']

const PRIORITY_STYLES = {
  low:      'border-gray-300 text-gray-600 bg-gray-50',
  medium:   'border-blue-300 text-blue-700 bg-blue-50',
  high:     'border-amber-300 text-amber-700 bg-amber-50',
  blocking: 'border-red-300 text-red-700 bg-red-50'
}

export default function TicketModal() {
  const { modalOpen, editingTicket, defaultColumn, closeModal, addTicket, updateTicket } = useBoard()
  const { analyze, loading, error, result, reset } = useAI()

  const [form, setForm] = useState({
    title: '',
    description: '',
    column: 'todo',
    points: null,
    priority: 'medium',
    criteria: []
  })
  const [aiApplied, setAiApplied] = useState(false)

  useEffect(() => {
    if (modalOpen) {
      if (editingTicket) {
        setForm({
          title: editingTicket.title,
          description: editingTicket.description || '',
          column: editingTicket.column,
          points: editingTicket.points || null,
          priority: editingTicket.priority || 'medium',
          criteria: editingTicket.criteria || []
        })
        setAiApplied(editingTicket.aiGenerated || false)
      } else {
        setForm({
          title: '',
          description: '',
          column: defaultColumn,
          points: null,
          priority: 'medium',
          criteria: []
        })
        setAiApplied(false)
      }
      reset()
    }
  }, [modalOpen, editingTicket, defaultColumn])

  useEffect(() => {
    if (result) {
      setForm(prev => ({
        ...prev,
        points: result.points,
        priority: result.priority,
        criteria: result.criteria
      }))
      setAiApplied(true)
    }
  }, [result])

  if (!modalOpen) return null

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editingTicket) {
      updateTicket(editingTicket.id, { ...form, aiGenerated: aiApplied })
    } else {
      addTicket({ ...form, aiGenerated: aiApplied })
    }
    closeModal()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {editingTicket ? 'Edit ticket' : 'New ticket'}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Login page, Stripe payment integration..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="As a [user], I want to [action] so that [goal]..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Column */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Column
            </label>
            <select
              value={form.column}
              onChange={e => setForm(p => ({ ...p, column: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* AI Coach Section */}
          <div className="border border-teal-200 rounded-xl p-4 bg-teal-50/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-teal-600" />
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                AI Agile Coach
              </span>
            </div>

            {/* US-14 — Generate button */}
            <button
              onClick={() => analyze({ title: form.title, description: form.description })}
              disabled={loading || !form.title.trim()}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Analyzing ticket...</>
                : <><Sparkles size={14} /> {aiApplied ? 'Regenerate analysis' : 'Generate AI analysis'}</>
              }
            </button>

            {/* Error */}
            {error && (
              <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* AI Results */}
            {(result || (editingTicket && aiApplied)) && (
              <div className="mt-3 space-y-3">

                {/* US-16 + US-17 — Story points */}
                <div>
                  <p className="text-xs font-medium text-teal-800 mb-1.5">
                    Story points (AI suggested: {result?.points || form.points})
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {FIBONACCI.map(n => (
                      <button
                        key={n}
                        onClick={() => setForm(p => ({ ...p, points: n }))}
                        className={`text-xs font-medium w-9 h-9 rounded-lg border transition-colors ${
                          form.points === n
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* US-18 + US-19 — Priority */}
                <div>
                  <p className="text-xs font-medium text-teal-800 mb-1.5">
                    Priority (AI suggested: {result?.priority || form.priority})
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {PRIORITIES.map(p => (
                      <button
                        key={p}
                        onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                        className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                          form.priority === p
                            ? PRIORITY_STYLES[p]
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {p === 'blocking' && <AlertTriangle size={10} />}
                        {p === 'high' && <AlertCircle size={10} />}
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* US-15 — Display criteria */}
                {form.criteria.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-teal-800 mb-1.5">
                      Acceptance criteria
                    </p>
                    <ul className="space-y-1.5">
                      {form.criteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-teal-900">
                          <CheckCircle size={12} className="text-teal-500 mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coach reasoning */}
                {result?.reasoning && (
                  <p className="text-xs text-teal-700 italic border-t border-teal-200 pt-2">
                    Coach: {result.reasoning}
                  </p>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="px-4 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            {editingTicket ? 'Save changes' : 'Create ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}