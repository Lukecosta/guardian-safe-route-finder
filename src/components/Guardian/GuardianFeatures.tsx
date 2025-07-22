import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GuardianFeaturesProps {
  onFindSafeRoute: () => void;
  onReportCrime: (crimeData: any) => void;
}

export const GuardianFeatures = ({ onFindSafeRoute, onReportCrime }: GuardianFeaturesProps) => {
  const [crimeType, setCrimeType] = useState('');
  const [description, setDescription] = useState('');

  const handleCrimeReport = () => {
    if (crimeType && description) {
      onReportCrime({
        type: crimeType,
        description,
        timestamp: new Date().toISOString()
      });
      setCrimeType('');
      setDescription('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="guardian-feature-card">
        <h4>
          <i className="fas fa-route mr-2"></i> AI Safe Route
        </h4>
        <p className="text-gray-300 mb-4">
          Get AI-suggested safe routes based on historical crime data
        </p>
        <Button 
          onClick={onFindSafeRoute}
          className="guardian-btn-search"
        >
          Find Safe Route
        </Button>
      </div>

      <div className="guardian-feature-card">
        <h4>
          <i className="fas fa-exclamation-triangle mr-2"></i> Report Crime
        </h4>
        <p className="text-gray-300 mb-4">
          Help keep the community safe by reporting incidents
        </p>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="guardian-btn-search">
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Report Crime</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Incident Type</Label>
                <Select value={crimeType} onValueChange={setCrimeType}>
                  <SelectTrigger className="guardian-input">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="assault">Assault</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                    <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened..."
                  className="guardian-input"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Upload Photos/Videos</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="guardian-input"
                />
              </div>
              
              <Button 
                onClick={handleCrimeReport}
                className="guardian-btn-search w-full"
              >
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};