"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSettingsStore } from '@/lib/store'
import { useEffect, useState } from 'react'

export function LocationModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { territory, setTerritory } = useSettingsStore()
  const [selected, setSelected] = useState(territory)

  useEffect(() => {
    setSelected(territory)
  }, [territory])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTerritory = e.target.value
    setTerritory(newTerritory)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <select
          value={selected}
          onChange={handleChange}
          className="mt-4 w-full border rounded p-2"
        >
          <option value="WS">Glendale</option>
          <option value="ONT">Ontario</option>
          <option value="FEM">Santa Clarita</option>
          <option value="PHX">Phoenix</option>
        </select>
      </DialogContent>
    </Dialog>
  )
}