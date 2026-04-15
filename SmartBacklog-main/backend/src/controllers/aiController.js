import 'dotenv/config'
import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY is missing in .env file')
}

const client = new OpenAI({ apiKey })

const SYSTEM_PROMPT = `You are an expert Agile Coach and senior Product Owner with 15 years of experience in software delivery.

Your role is to analyze user stories or ticket titles and respond ONLY with a valid JSON object — no markdown, no preamble, no explanation.

Always return this exact structure:
{
  "criteria": ["criterion 1", "criterion 2", "criterion 3", "criterion 4", "criterion 5"],
  "points": 5,
  "priority": "medium",
  "reasoning": "One concise sentence explaining your point and priority estimates."
}

Rules:
- criteria: 4 to 6 clear, testable acceptance criteria
- points: Fibonacci only — 1, 2, 3, 5, 8, or 13
  - 1-2: trivial (label, copy, config change)
  - 3: simple feature with clear scope
  - 5: moderate complexity, some integration needed
  - 8: high complexity, multiple systems or unknowns
  - 13: very complex or poorly defined
- priority: exactly one of "low", "medium", "high", or "blocking"
  - "blocking" = critical infrastructure (auth, payments, security)
  - "high" = blocks other user-facing features
  - "medium" = standard important feature
  - "low" = nice to have, no dependencies
- reasoning: max 20 words`

export const analyzeTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body

    if (!title?.trim()) {
      return res.status(400).json({ error: 'Ticket title is required' })
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'OPENAI_API_KEY missing. Check backend/.env' })
    }

    const userMessage = `Ticket title: "${title.trim()}"${description?.trim() ? `\nDescription: "${description.trim()}"` : ''}`

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.5
    })

    const raw = completion.choices?.[0]?.message?.content || ''
    const cleaned = raw.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (err) {
      console.error('❌ JSON parse error:', raw)
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' })
    }

    // Validate Fibonacci
    const FIBONACCI = [1, 2, 3, 5, 8, 13]
    if (!FIBONACCI.includes(parsed.points)) parsed.points = 5

    // Validate priority
    if (!['low', 'medium', 'high', 'blocking'].includes(parsed.priority)) {
      parsed.priority = 'medium'
    }

    // Validate criteria
    if (!Array.isArray(parsed.criteria) || parsed.criteria.length === 0) {
      return res.status(500).json({ error: 'AI did not return valid criteria. Please try again.' })
    }

    res.json({
      criteria: parsed.criteria.slice(0, 6),
      points: parsed.points,
      priority: parsed.priority,
      reasoning: parsed.reasoning || '',
      model: completion.model
    })

  } catch (err) {
    console.error('❌ AI Error:', err)
    if (err.status === 401) return res.status(401).json({ error: 'Invalid OpenAI API key.' })
    if (err.status === 429) return res.status(429).json({ error: 'Rate limit reached. Try again later.' })
    next(err)
  }
}