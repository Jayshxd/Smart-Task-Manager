import { useEffect, useCallback } from 'react'
import { useTaskStore } from '@/store'
import { isModKey } from '@/lib/utils'

export function useKeyboardShortcuts() {
  const {
    moveSelection,
    toggleCommandOpen,
    toggleFocusMode,
    setEditing,
    setCreating,
    getSelectedTask,
    selectedTaskId,
    isEditing,
    isCreating,
    isCommandOpen,
    isFocusMode,
  } = useTaskStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow escape to close modals
        if (e.key === 'Escape') {
          if (isEditing) setEditing(null)
          if (isCreating) setCreating(false)
        }
        return
      }

      // Command palette (Ctrl/Cmd + K)
      if (isModKey(e) && e.key === 'k') {
        e.preventDefault()
        toggleCommandOpen()
        return
      }

      // Escape to exit focus mode or close dialogs
      if (e.key === 'Escape') {
        if (isCommandOpen) {
          toggleCommandOpen()
        } else if (isFocusMode) {
          toggleFocusMode()
        } else if (isEditing) {
          setEditing(null)
        } else if (isCreating) {
          setCreating(false)
        }
        return
      }

      // Navigation shortcuts (only when not in modal)
      if (!isCommandOpen && !isEditing && !isCreating) {
        switch (e.key.toLowerCase()) {
          case 'j':
            e.preventDefault()
            moveSelection('down')
            break
          case 'k':
            e.preventDefault()
            moveSelection('up')
            break
          case 'e':
            e.preventDefault()
            if (selectedTaskId) {
              setEditing(selectedTaskId)
            }
            break
          case 'f':
            e.preventDefault()
            if (selectedTaskId) {
              toggleFocusMode(selectedTaskId)
            }
            break
          case 'n':
            e.preventDefault()
            setCreating(true)
            break
          case 'x':
            // Toggle complete is handled in TaskCard component
            break
        }
      }
    },
    [
      isEditing,
      isCreating,
      isCommandOpen,
      isFocusMode,
      selectedTaskId,
      moveSelection,
      toggleCommandOpen,
      toggleFocusMode,
      setEditing,
      setCreating,
      getSelectedTask,
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
