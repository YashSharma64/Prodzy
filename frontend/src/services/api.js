
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

function toFriendlyErrorMessage({ status, detail }) {
  const msg = String(detail || '').toLowerCase()

  const looksLikeAuth =
    status === 401 ||
    status === 403 ||
    /api\s*key|unauthorized|forbidden|permission|invalid\s*key|missing\s*key/.test(msg) ||
    /your_key_here|placeholder/.test(msg)

  if (looksLikeAuth) {
    return (
      'Gemini API key is missing or invalid. Add a valid `GEMINI_API_KEY` in `backend/.env`, restart the backend, then try again.'
    )
  }

  const looksLikeQuota =
    status === 429 ||
    /quota|rate\s*limit|resource_exhausted|too\s*many\s*requests/.test(msg)

  if (looksLikeQuota) {
    return 'Gemini quota/rate limit reached. Please wait a bit and try again, or use a different API key.'
  }

  if (status >= 500) {
    return 'The AI service is temporarily unavailable. Please try again in a moment.'
  }

  return String(detail || `Request failed (${status})`)
}

async function requestJson(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'content-type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })

  const text = await res.text()
  const data = safeJsonParse(text)

  if (!res.ok) {
    const detail = data?.detail || data?.message || text || `Request failed (${res.status})`
    const friendly = toFriendlyErrorMessage({ status: res.status, detail })
    throw new Error(friendly)
  }

  return data
}

export async function generateDescription(payload) {
  return requestJson('/generate-description', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function evaluateDescription(payload) {
  return requestJson('/evaluate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
