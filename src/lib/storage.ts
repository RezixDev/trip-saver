// lib/storage.ts
import localforage from 'localforage'

// Initialize localforage
localforage.config({
  name: 'pwa-app',
  storeName: 'app_data'
})

export interface StorageItem {
  id: string
  timestamp: number
  type: 'form' | 'image' | 'location'
  data: any
}

class StorageService {
  private static instance: StorageService

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  async saveItem(item: Omit<StorageItem, 'id' | 'timestamp'>): Promise<StorageItem> {
    const newItem: StorageItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    try {
      const key = `item_${newItem.id}`
      await localforage.setItem(key, newItem)
      return newItem
    } catch (error) {
      console.error('Failed to save item:', error)
      throw new Error('Failed to save item to storage')
    }
  }

  async getItems(type?: StorageItem['type']): Promise<StorageItem[]> {
    const items: StorageItem[] = []

    try {
      await localforage.iterate((value: StorageItem) => {
        if (!type || value.type === type) {
          items.push(value)
        }
      })

      // Sort by timestamp, newest first
      return items.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Failed to retrieve items:', error)
      throw new Error('Failed to retrieve items from storage')
    }
  }

  async getItem(id: string): Promise<StorageItem | null> {
    try {
      const key = `item_${id}`
      return await localforage.getItem(key)
    } catch (error) {
      console.error('Failed to retrieve item:', error)
      throw new Error('Failed to retrieve item from storage')
    }
  }

  async removeItem(id: string): Promise<void> {
    try {
      const key = `item_${id}`
      await localforage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove item:', error)
      throw new Error('Failed to remove item from storage')
    }
  }
}

export const storage = StorageService.getInstance()
export default storage