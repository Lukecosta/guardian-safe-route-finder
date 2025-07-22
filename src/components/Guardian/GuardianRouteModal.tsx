import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RouteRecommendations {
  avoidAreas: string[];
  safeTimes: string[];
  recommendations: string[];
}

interface GuardianRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: RouteRecommendations | null;
  crimeCount: number;
}

export const GuardianRouteModal = ({ 
  isOpen, 
  onClose, 
  recommendations, 
  crimeCount 
}: GuardianRouteModalProps) => {
  if (!recommendations) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 z-[9999] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="guardian-brand text-2xl">
            <i className="fas fa-robot mr-2"></i>
            AI Route Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="guardian-feature-card">
            <h5>
              <i className="fas fa-chart-bar mr-2"></i>
              Crime Analysis Summary
            </h5>
            <p className="text-gray-300">
              Based on <span className="text-primary font-semibold">{crimeCount}</span> recent incidents in this area.
            </p>
          </div>

          {/* Areas to Avoid */}
          <div className="guardian-feature-card">
            <h6>
              <i className="fas fa-exclamation-triangle mr-2 text-red-500"></i>
              Areas to Avoid
            </h6>
            {recommendations.avoidAreas.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.avoidAreas.map((area, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-times-circle text-red-500 mr-2"></i>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center text-green-400">
                <i className="fas fa-check-circle mr-2"></i>
                <span>No specific high-risk areas identified</span>
              </div>
            )}
          </div>

          {/* Safer Travel Times */}
          <div className="guardian-feature-card">
            <h6>
              <i className="fas fa-clock mr-2 text-green-500"></i>
              Recommended Travel Times
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {recommendations.safeTimes.map((time, index) => (
                <div key={index} className="bg-green-500/20 text-green-300 px-3 py-2 rounded-lg text-center">
                  <i className="fas fa-clock mr-1"></i>
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Recommendations */}
          <div className="guardian-feature-card">
            <h6>
              <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
              AI Safety Recommendations
            </h6>
            <div className="space-y-3">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={onClose}
              className="guardian-btn-search"
            >
              <i className="fas fa-check mr-2"></i>
              Got It
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <i className="fas fa-print mr-2"></i>
              Print Report
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 border-t border-gray-700 pt-4">
            <i className="fas fa-info-circle mr-1"></i>
            This analysis is based on historical crime data and should be used as guidance only. 
            Always remain vigilant and trust your instincts when assessing safety.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};