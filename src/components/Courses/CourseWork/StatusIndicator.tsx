interface StatusIndicatorProps {
  state: string
}

export const StatusIndicator = ({ state }: StatusIndicatorProps) => {
  let bgColor = 'bg-yellow-500' // Default to 'created'

  if (state === 'RETURNED') {
    bgColor = 'bg-green-500'
  } else if (state === 'TURNED_IN') {
    bgColor = 'bg-blue-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${bgColor}`} />
      {state}
    </div>
  )
}
