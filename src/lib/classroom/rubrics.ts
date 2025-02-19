// src/lib/classroom/rubrics.ts

const API_BASE_URL = '/api/classroom/rubrics'

export async function getCriterions(rubricId: string) {
  const res = await fetch(`${API_BASE_URL}/${rubricId}/criterions`)
  if (!res.ok) {
    throw new Error('Failed to fetch criterions')
  }
  return res.json()
}

export async function createCriterion(rubricId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/${rubricId}/criterions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create criterion')
  }
  return res.json()
}

export async function getCriterion(rubricId: string, criterionId: string) {
  const res = await fetch(`${API_BASE_URL}/${rubricId}/criterions/${criterionId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch criterion')
  }
  return res.json()
}

export async function updateCriterion(rubricId: string, criterionId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/${rubricId}/criterions/${criterionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update criterion')
  }
  return res.json()
}

export async function deleteCriterion(rubricId: string, criterionId: string) {
  const res = await fetch(`${API_BASE_URL}/${rubricId}/criterions/${criterionId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error('Failed to delete criterion')
  }
  return res.json()
}
