// hooks/useGeolocation.ts
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export const useGeolocation = (options?: PositionOptions) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        loading: false,
      }))
      return
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      })
    }

    const onError = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
      
      toast({
        title: 'Location Error',
        description: error.message,
        variant: 'destructive',
      })
    }

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [options])

  return state
}

