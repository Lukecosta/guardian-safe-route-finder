import { useState, useEffect } from 'react';

interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    loading: false
  });

  const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            coordinates: position.coords,
            error: null,
            loading: false
          });
          resolve(position.coords);
        },
        (error) => {
          const errorMessage = `Error getting location: ${error.message}`;
          setState({
            coordinates: null,
            error: errorMessage,
            loading: false
          });
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  return {
    ...state,
    getCurrentLocation
  };
};