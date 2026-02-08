
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

async function requestJson(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'content-type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const detail = data?.detail || data?.message || `Request failed (${res.status})`
    throw new Error(detail)
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
