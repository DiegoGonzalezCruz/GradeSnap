"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function SendAnnouncement() {
  const [announcement, setAnnouncement] = useState("")

  const handleSendAnnouncement = () => {
    // This is where you'd implement the logic to send the announcement
    console.log("Sending announcement:", announcement)
    // Reset the textarea after sending
    setAnnouncement("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your announcement here..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSendAnnouncement}>Send Announcement</Button>
      </CardContent>
    </Card>
  )
}

