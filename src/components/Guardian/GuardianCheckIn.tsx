import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface GuardianCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onSafeCheckIn: (location: GeolocationCoordinates, platform: string) => void;
}

export const GuardianCheckIn = ({ isOpen, onClose, onSafeCheckIn }: GuardianCheckInProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const handleSafeCheckIn = async (platform: 'facebook' | 'twitter' | 'both') => {
    setIsGettingLocation(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      await onSafeCheckIn(position.coords, platform);
      
      toast({
        title: "Check-in Successful!",
        description: `Your safety status has been shared on ${platform === 'both' ? 'Facebook and X' : platform}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location Error",
        description: "Could not get your location. Please check your permissions and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Safety Check In</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-300">
            Share your current location and safety status with your network. 
            This will post to your selected social media platforms with your coordinates.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleSafeCheckIn('facebook')}
              disabled={isGettingLocation}
              className="w-full bg-[#1877f2] hover:bg-[#1877f2]/80"
            >
              <i className="fab fa-facebook-f mr-2"></i>
              {isGettingLocation ? 'Getting Location...' : 'Share on Facebook'}
            </Button>
            
            <Button 
              onClick={() => handleSafeCheckIn('twitter')}
              disabled={isGettingLocation}
              className="w-full bg-black hover:bg-black/80"
            >
              <i className="fab fa-x-twitter mr-2"></i>
              {isGettingLocation ? 'Getting Location...' : 'Share on X (Twitter)'}
            </Button>
            
            <Button 
              onClick={() => handleSafeCheckIn('both')}
              disabled={isGettingLocation}
              className="guardian-btn-search w-full"
            >
              <i className="fas fa-share-alt mr-2"></i>
              {isGettingLocation ? 'Getting Location...' : 'Share on Both Platforms'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-400">
            Your location will be included in the post to help friends and family know where you are.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};