"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

const predefinedTags = ["マインド", "習慣", "スキル", "対人関係", "健康", "生活"]

interface EntryFormProps {
  onEntryCreated?: () => void
}

export function EntryForm({ onEntryCreated }: EntryFormProps) {
  const [text, setText] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      toast({
        title: "エラー",
        description: "テキストを入力してください",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          text: text.trim(),
          tags: selectedTags,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create entry')
      }

      const entry = await response.json()
      console.log('Created entry:', entry) // Debug log

      toast({
        title: "登録完了",
        description: "エントリが保存されました",
      })

      // Reset form
      setText("")
      setTagInput("")
      setSelectedTags([])

      // Notify parent component
      onEntryCreated?.()
    } catch (error) {
      console.error('Failed to create entry:', error)
      toast({
        title: "エラー",
        description: "エントリの保存に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>新規エントリ</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">テキスト</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="あなたの考えを入力してください..."
              className="min-h-[150px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">タグ</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="タグを入力..."
              disabled={isSubmitting}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  if (tagInput.trim()) {
                    addTag(tagInput.trim())
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
