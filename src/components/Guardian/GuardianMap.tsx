import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom crime marker icons
const getCrimeIcon = (category: string) => {
  const iconMap: { [key: string]: string } = {
    'vehicle-crime': '🚗',
    'violent-crime': '👊',
    'shoplifting': '🏪',
    'burglary': '🏠',
    'robbery': '💰',
    'theft-from-the-person': '👤',
    'anti-social-behaviour': '⚠️',
    'criminal-damage-arson': '🔥',
    'drugs': '💊',
    'other-theft': '🎒',
    'possession-of-weapons': '🔪',
    'public-order': '👮',
    'bicycle-theft': '🚲'
  };

  const emoji = iconMap[category] || '📍';
  
  return L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #ff4800, #ee0979);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">${emoji}</div>`,
    className: 'guardian-crime-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

interface Crime {
  category: string;
  location: {
    latitude: number;
    longitude: number;
    street: { name: string };
  };
  month: string;
  outcome_status?: { category: string };
}

interface GuardianMapProps {
  crimes: Crime[];
  center: [number, number];
  onRouteRequest?: (start: [number, number], end: [number, number]) => void;
}

export const GuardianMap = ({ crimes, center, onRouteRequest }: GuardianMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(center, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markers.forEach(marker => mapInstanceRef.current?.removeLayer(marker));
    setMarkers([]);

    // Update map center
    mapInstanceRef.current.setView(center, 14);

    // Add new crime markers
    const newMarkers: L.Marker[] = [];
    
    crimes.forEach(crime => {
      const crimeIcon = getCrimeIcon(crime.category);
      const marker = L.marker([crime.location.latitude, crime.location.longitude], { icon: crimeIcon });
      
      const riskLevel = calculateRiskLevel(crime, crimes);
      const safetyTips = generateSafetyTips(crime.category);

      const popupContent = `
        <div class="guardian-crime-popup">
          <h3>${crime.category.replace(/-/g, ' ').toUpperCase()}</h3>
          <p><strong>Location:</strong> ${crime.location.street.name}</p>
          <p><strong>Date:</strong> ${crime.month}</p>
          <p><strong>Status:</strong> 
            <span class="guardian-status-badge status-${riskLevel.toLowerCase()}">
              ${crime.outcome_status ? crime.outcome_status.category : 'Under Investigation'}
            </span>
          </p>
          <p><strong>Safety Tip:</strong> ${safetyTips}</p>
        </div>`;

      marker.bindPopup(popupContent);
      marker.addTo(mapInstanceRef.current!);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [crimes, center]);

  const calculateRiskLevel = (crime: Crime, allCrimes: Crime[]) => {
    const crimeCategories: { [key: string]: number } = {};
    allCrimes.forEach(c => {
      crimeCategories[c.category] = (crimeCategories[c.category] || 0) + 1;
    });

    const frequency = crimeCategories[crime.category];
    const total = Object.values(crimeCategories).reduce((a, b) => a + b, 0);
    const percentage = (frequency / total) * 100;

    if (percentage > 20) return 'DANGER';
    if (percentage > 10) return 'CAUTION';
    return 'SAFE';
  };

  const generateSafetyTips = (category: string) => {
    const tips: { [key: string]: string } = {
      'anti-social-behaviour': 'Stay in well-lit areas and travel in groups when possible.',
      'burglary': 'Ensure your property is well-secured and consider installing security cameras.',
      'robbery': 'Stay alert and avoid displaying valuable items in public.',
      'vehicle-crime': 'Park in well-lit areas and don\'t leave valuables visible in your car.',
      'violent-crime': 'Avoid known trouble spots and stay aware of your surroundings.',
      'other-crime': 'Stay vigilant and report any suspicious activity to authorities.'
    };
    return tips[category] || tips['other-crime'];
  };

  return <div ref={mapRef} className="guardian-map" />;
};