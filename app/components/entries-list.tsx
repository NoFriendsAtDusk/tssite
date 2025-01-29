"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { SearchIcon, EditIcon, TrashIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const predefinedTags = ["マインド", "習慣", "スキル", "対人関係", "健康", "生活"]

interface Entry {
  id: number
  text: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface EntriesListProps {
  refresh?: number
}

export function EntriesList({ refresh = 0 }: EntriesListProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [editTagInput, setEditTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries', {
        headers: {
          'Accept': 'application/json; charset=utf-8'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries')
      }

      const data = await response.json()
      console.log('Fetched entries:', data)
      setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
      toast({
        title: "エラー",
        description: "エントリの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [refresh])

  const handleDelete = async (id: number) => {
    if (!confirm('このエントリを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }

      setEntries(entries.filter(entry => entry.id !== id))
      toast({
        title: "削除完了",
        description: "エントリが削除されました",
      })
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        title: "エラー",
        description: "エントリの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry)
    setEditTagInput("")
  }

  const handleSaveEdit = async () => {
    if (!editingEntry) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/entries/${editingEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          text: editingEntry.text,
          tags: editingEntry.tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update entry')
      }

      const updatedEntry = await response.json()
      console.log('Updated entry:', updatedEntry)

      setEntries(entries.map(entry => 
        entry.id === editingEntry.id ? updatedEntry : entry
      ))
      setEditingEntry(null)
      toast({
        title: "更新完了",
        description: "エントリが更新されました",
      })
    } catch (error) {
      console.error('Error updating entry:', error)
      toast({
        title: "エラー",
        description: "エントリの更新に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTagToEdit = (tag: string) => {
    if (editingEntry && !editingEntry.tags.includes(tag)) {
      setEditingEntry({
        ...editingEntry,
        tags: [...editingEntry.tags, tag],
      })
    }
    setEditTagInput("")
  }

  const removeTagFromEdit = (tagToRemove: string) => {
    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        tags: editingEntry.tags.filter(tag => tag !== tagToRemove),
      })
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => entry.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>読み込み中...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>エントリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from(new Set(entries.flatMap(entry => entry.tags))).map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <p className="text-center text-muted-foreground">エントリがありません</p>
            ) : (
              filteredEntries.map(entry => (
                <Card key={entry.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        {entry.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(entry.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>エントリの編集</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <Textarea
                value={editingEntry.text}
                onChange={(e) =>
                  setEditingEntry({
                    ...editingEntry,
                    text: e.target.value,
                  })
                }
                disabled={isSubmitting}
                className="min-h-[150px]"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">タグ</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingEntry.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeTagFromEdit(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  placeholder="タグを入力..."
                  disabled={isSubmitting}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (editTagInput.trim()) {
                        addTagToEdit(editTagInput.trim())
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {predefinedTags.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => addTagToEdit(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
