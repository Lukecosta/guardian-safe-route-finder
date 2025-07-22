import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuardianNavbarProps {
  onCheckIn: () => void;
}

export const GuardianNavbar = ({ onCheckIn }: GuardianNavbarProps) => {
  const [friendEmail, setFriendEmail] = useState('');

  const handleTrackFriend = () => {
    if (friendEmail) {
      alert(`Tracking request sent to ${friendEmail}`);
      setFriendEmail('');
    }
  };

  return (
    <nav className="guardian-navbar">
      <div className="container mx-auto flex items-center justify-between">
        <div className="guardian-brand text-2xl">
          <i className="fas fa-shield-alt mr-2"></i> Guardian
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={onCheckIn}
            className="text-white hover:text-primary transition-colors"
          >
            Check In
          </button>
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-white hover:text-primary transition-colors">
                Track Friend
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Track a Friend</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="guardian-input"
                />
                <Button 
                  onClick={handleTrackFriend}
                  className="guardian-btn-search w-full"
                >
                  Send Tracking Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="md:hidden">
          <button className="text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};