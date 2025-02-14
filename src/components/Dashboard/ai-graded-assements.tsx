import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import GetAISummary from './get-ai-summary'
// import GetStats from './get-stats'

export function AIGradedAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What is the deal?</CardTitle>
      </CardHeader>
      <CardContent>
        <GetAISummary />
        {/* <GetStats /> */}
      </CardContent>
    </Card>
  )
}
