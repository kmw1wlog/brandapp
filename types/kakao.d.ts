declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        LatLngBounds: new () => {
          extend: (latlng: unknown) => void;
        };
        Size: new (width: number, height: number) => unknown;
        Point: new (x: number, y: number) => unknown;
        Map: new (container: HTMLElement, options: Record<string, unknown>) => {
          setBounds: (bounds: unknown) => void;
          setCenter: (latlng: unknown) => void;
          relayout: () => void;
        };
        Marker: new (options: Record<string, unknown>) => unknown;
        Circle: new (options: Record<string, unknown>) => {
          setMap: (map: unknown) => void;
        };
        InfoWindow: new (options: Record<string, unknown>) => {
          open: (map: unknown, marker?: unknown) => void;
        };
        event: {
          addListener: (target: unknown, type: string, callback: () => void) => void;
        };
      };
    };
  }
}

export {};
