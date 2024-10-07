'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function MemeCoinPage() {
  const [isCopied, setIsCopied] = useState(false)
  const contractAddress = "4F179EXXA5qahQkHjTABYi5Ci9UFcQTZfa9jogUBpump"

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [contractAddress])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md">
        <Image
          src="/images/zozo.png"
          alt="SENDOOR Logo"
          width={300}
          height={300}
          className="w-full h-auto rounded-t-lg"
          priority
        />
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">🐱 $ZOZO 🐱</CardTitle>
          <CardDescription className="text-center">Black Cat Zoning Out, also known as Black Cat Zoned Out or Staring Black Cat, refers to a video of a black cat staring blankly at a tan-colored cat which meme creators associated with &quot;zoning out,&quot; pairing the video with captions related to losing focus or dissociating. The meme template trended mostly on TikTok in 2023</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <span className="text-sm font-mono truncate max-w-[calc(100%-2.5rem)] sm:max-w-none">
              {contractAddress}
            </span>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} className="flex-shrink-0">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-4">
            <Link href="https://dexscreener.com/solana/2kgsfktwj8zanmn8v95fkp3uloorder36yguidafuarp" className="w-full">
              <Button className="w-full">Dex</Button>
            </Link>
            <a href="https://t.me/CTOZOZO" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button variant="outline" className="w-full">Join Community</Button>
            </a>
          </div>
          <Link href="/generator" className="w-full">
            <Button variant="secondary" className="w-full">Create Your Own ZoZo</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}