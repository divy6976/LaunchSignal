import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, BarChart3 } from 'lucide-react';
import StartupAnalytics from './StartupAnalytics';

const AnalyticsModal = ({ isOpen, onClose, startup }) => {
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Analytics Dashboard</span>
            </DialogTitle>
            <DialogDescription>
              View detailed analytics and performance metrics for your startup
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-4">
          {startup ? (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Analytics for: {startup.name}</h3>
                <p className="text-blue-600">Startup ID: {startup._id || startup.id}</p>
              </div>
              <StartupAnalytics 
                startupId={startup._id || startup.id} 
                startupName={startup.name}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">Loading startup data...</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;
