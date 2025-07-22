import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuardianSearchProps {
  onSearch: (location: string) => void;
}

export const GuardianSearch = ({ onSearch }: GuardianSearchProps) => {
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="guardian-search-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter UK postcode or town..."
            className="guardian-input"
          />
        </div>
        <div>
          <Button 
            onClick={handleSearch}
            className="guardian-btn-search w-full"
          >
            Search Area
          </Button>
        </div>
      </div>
    </div>
  );
};