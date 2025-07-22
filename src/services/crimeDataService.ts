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

interface AreaStats {
  totalCrimes: number;
  categories: [string, number][];
  outcomes: [string, number][];
  monthlyTrends: [string, number][];
}

interface LocationResult {
  latitude: number;
  longitude: number;
}

export class CrimeDataService {
  private static async fetchWithRetry(url: string, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  }

  static async getLocationFromPostcodeOrTown(location: string): Promise<LocationResult> {
    try {
      // Try postcode first
      const postcodeResponse = await this.fetchWithRetry(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(location)}`
      );
      const postcodeData = await postcodeResponse.json();

      if (postcodeData.result) {
        return {
          latitude: postcodeData.result.latitude,
          longitude: postcodeData.result.longitude
        };
      }
    } catch (error) {
      // If postcode fails, try town search
      try {
        const townResponse = await this.fetchWithRetry(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=gb&limit=1`
        );
        const townData = await townResponse.json();

        if (townData.length > 0) {
          return {
            latitude: parseFloat(townData[0].lat),
            longitude: parseFloat(townData[0].lon)
          };
        }
      } catch (townError) {
        console.error('Town search failed:', townError);
      }
    }

    throw new Error('Location not found');
  }

  static async getCrimesForArea(lat: number, lon: number): Promise<Crime[]> {
    try {
      const response = await this.fetchWithRetry(
        `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lon}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching crime data:', error);
      return [];
    }
  }

  static async getAreaStatistics(lat: number, lon: number): Promise<AreaStats | null> {
    try {
      const crimes = await this.getCrimesForArea(lat, lon);

      const categories: { [key: string]: number } = {};
      const outcomes: { [key: string]: number } = {};
      const monthlyTrends: { [key: string]: number } = {};

      crimes.forEach(crime => {
        // Count by category
        categories[crime.category] = (categories[crime.category] || 0) + 1;
        
        // Count by outcome
        if (crime.outcome_status) {
          outcomes[crime.outcome_status.category] = (outcomes[crime.outcome_status.category] || 0) + 1;
        }
        
        // Track monthly trends
        monthlyTrends[crime.month] = (monthlyTrends[crime.month] || 0) + 1;
      });

      return {
        totalCrimes: crimes.length,
        categories: Object.entries(categories).sort((a, b) => b[1] - a[1]),
        outcomes: Object.entries(outcomes).sort((a, b) => b[1] - a[1]),
        monthlyTrends: Object.entries(monthlyTrends).sort((a, b) => b[0].localeCompare(a[0]))
      };
    } catch (error) {
      console.error('Error fetching area statistics:', error);
      return null;
    }
  }

  static generateSafeRouteRecommendations(crimes: Crime[]): {
    avoidAreas: string[];
    safeTimes: string[];
    recommendations: string[];
  } {
    const crimeCategories: { [key: string]: number } = {};
    const timePatterns: { [key: string]: number } = {};
    
    crimes.forEach(crime => {
      crimeCategories[crime.category] = (crimeCategories[crime.category] || 0) + 1;
      
      // Extract time patterns from month data if available
      const month = crime.month;
      timePatterns[month] = (timePatterns[month] || 0) + 1;
    });

    const highCrimeCategories = Object.entries(crimeCategories)
      .filter(([_, count]) => count > 5)
      .map(([category, _]) => category);

    const avoidAreas = [
      ...new Set(crimes
        .filter(crime => highCrimeCategories.includes(crime.category))
        .map(crime => crime.location.street.name)
        .filter(name => name && name !== 'On or near ')
        .slice(0, 5))
    ];

    const recommendations = [
      'Stick to well-lit main roads when possible',
      'Travel in groups, especially during evening hours',
      'Stay alert and aware of your surroundings',
      'Keep valuables out of sight',
      'Use main transportation routes rather than back streets'
    ];

    if (crimeCategories['vehicle-crime'] > 3) {
      recommendations.push('Use secure parking areas and remove all items from vehicle');
    }

    if (crimeCategories['burglary'] > 3) {
      recommendations.push('Ensure properties are well-secured before leaving');
    }

    return {
      avoidAreas,
      safeTimes: ['06:00-09:00', '12:00-14:00', '16:00-18:00'], // Generally safer commute times
      recommendations
    };
  }
}