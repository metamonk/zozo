'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"

export function MemeCoinPageComponent() {
  const [isCopied, setIsCopied] = useState(false)
  const contractAddress = "0x1234567890123456789012345678901234567890"
  
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [contractAddress])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">🚀 MoonDoge Coin 🌙</CardTitle>
          <CardDescription className="text-center">The memest of all meme coins!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="text-sm font-mono">{truncateAddress(contractAddress)}</span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full">Buy Now</Button>
            <Button variant="outline" className="w-full">Join Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}