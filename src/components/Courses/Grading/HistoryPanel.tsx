import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

interface HistoryPanelProps {
  history: any[]
  user: any
  formatDate: (dateString: string) => string
}

export default function HistoryPanel({ history, user, formatDate }: HistoryPanelProps) {
  // Utility for badge color (could also be extracted separately)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TURNED_IN':
        return 'bg-green-100 text-green-800'
      case 'CREATED':
        return 'bg-blue-100 text-blue-800'
      case 'RETURNED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Submission History</h3>
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div key={index} className="border rounded-md p-3">
            <div className="flex items-center justify-between mb-1">
              <Badge className={getStatusColor(entry.stateHistory.state)}>
                {entry.stateHistory.state.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(entry.stateHistory.stateTimestamp)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">By: {user.name.fullName}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
