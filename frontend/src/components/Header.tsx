import { Search } from 'lucide-react'
import { Kbd, Button } from '@/components/ui'
import { useTaskStore } from '@/store'

export function Header() {
  const { setCommandOpen } = useTaskStore()

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your tasks with keyboard-first efficiency
        </p>
      </div>

      {/* Command bar trigger */}
      <Button
        variant="outline"
        className="gap-3 text-muted-foreground hover:text-foreground"
        onClick={() => setCommandOpen(true)}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search or command...</span>
        <div className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </Button>
    </header>
  )
}
