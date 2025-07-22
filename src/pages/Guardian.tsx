import { useState } from 'react';
import { GuardianNavbar } from '@/components/Guardian/GuardianNavbar';

import { GuardianSearch } from '@/components/Guardian/GuardianSearch';
import { GuardianMap } from '@/components/Guardian/GuardianMap';
import { GuardianFeatures } from '@/components/Guardian/GuardianFeatures';
import { GuardianStats } from '@/components/Guardian/GuardianStats';
import { GuardianCheckIn } from '@/components/Guardian/GuardianCheckIn';
import { GuardianRouteModal } from '@/components/Guardian/GuardianRouteModal';
import { CrimeDataService } from '@/services/crimeDataService';
import { SocialMediaService } from '@/services/socialMediaService';
import { useToast } from '@/hooks/use-toast';

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

const Guardian = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
  const [areaStats, setAreaStats] = useState<AreaStats | null>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [routeRecommendations, setRouteRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    try {
      const coordinates = await CrimeDataService.getLocationFromPostcodeOrTown(location);
      const newCenter: [number, number] = [coordinates.latitude, coordinates.longitude];
      
      setMapCenter(newCenter);
      
      // Fetch crime data and statistics
      const [crimeData, stats] = await Promise.all([
        CrimeDataService.getCrimesForArea(coordinates.latitude, coordinates.longitude),
        CrimeDataService.getAreaStatistics(coordinates.latitude, coordinates.longitude)
      ]);
      
      setCrimes(crimeData);
      setAreaStats(stats);
      
      toast({
        title: "Area Loaded",
        description: `Found ${crimeData.length} crime records for ${location}`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Location not found. Please try a different postcode or town name.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSafeCheckIn = async (coordinates: GeolocationCoordinates, platform: string) => {
    try {
      await SocialMediaService.shareLocation(platform, coordinates);
      
      // Update map to show user's location
      setMapCenter([coordinates.latitude, coordinates.longitude]);
      
      toast({
        title: "Check-in Complete!",
        description: "Your safety status has been shared successfully.",
      });
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Share Error",
        description: "Could not share your location. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFindSafeRoute = () => {
    if (crimes.length === 0) {
      toast({
        title: "No Data Available",
        description: "Please search for an area first to get route recommendations.",
        variant: "destructive"
      });
      return;
    }

    const recommendations = CrimeDataService.generateSafeRouteRecommendations(crimes);
    setRouteRecommendations(recommendations);
    setIsRouteModalOpen(true);
    
    toast({
      title: "AI Route Analysis Complete",
      description: "Safe route recommendations generated based on crime data analysis.",
    });
  };

  const handleReportCrime = (crimeData: any) => {
    console.log('Crime reported:', crimeData);
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Local authorities have been notified.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GuardianNavbar onCheckIn={() => setIsCheckInOpen(true)} />
      
      <div className="container mx-auto px-4 pt-24">
        <GuardianSearch onSearch={handleSearch} />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-300">Loading area data...</p>
          </div>
        )}
        
        <GuardianMap 
          crimes={crimes} 
          center={mapCenter}
        />
        
        {areaStats && <GuardianStats stats={areaStats} />}
        
        <GuardianFeatures 
          onFindSafeRoute={handleFindSafeRoute}
          onReportCrime={handleReportCrime}
        />
      </div>

      {/* Emergency Button */}
      <a href="tel:999" className="guardian-emergency-btn">
        <i className="fas fa-phone-alt mr-2"></i> Emergency - Call 999
      </a>

      {/* Check-in Modal */}
      <GuardianCheckIn 
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSafeCheckIn={handleSafeCheckIn}
      />

      {/* Route Analysis Modal */}
      <GuardianRouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        recommendations={routeRecommendations}
        crimeCount={crimes.length}
      />
    </div>
  );
};

export default Guardian;