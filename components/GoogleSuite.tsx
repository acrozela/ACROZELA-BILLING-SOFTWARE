import React, { useState, useEffect } from 'react';
import { Mail, HardDrive, FileText, Video, MessageSquare, Calendar, Sparkles, LayoutGrid, Search, BarChart, Globe, MapPin, Share2, UserCheck, Lock } from 'lucide-react';

interface ToolProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  url: string;
  color: string;
  locked: boolean;
}

const ToolCard: React.FC<ToolProps> = ({ icon, name, description, url, color, locked }) => {
  const CardContent = (
    <div className={`relative bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group flex flex-col h-full ${locked ? 'opacity-70 grayscale' : 'cursor-pointer'}`}>
      {locked && (
        <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
          <Lock className="text-slate-400" size={32} />
        </div>
      )}
      <div className={`p-4 rounded-xl w-fit mb-5 ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{name}</h3>
      <p className="text-sm text-slate-500 flex-grow leading-relaxed">{description}</p>
    </div>
  );

  if (locked) return CardContent;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {CardContent}
    </a>
  );
};

export const GoogleSuite = ({ isConnected, onConnect }: { isConnected: boolean, onConnect: () => void }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    // Simulate network delay
    setTimeout(() => {
        setConnecting(false);
        onConnect();
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

        <div className="flex items-center gap-8 mb-8 md:mb-0 relative z-10">
          <div className="bg-white p-4 rounded-full shadow-lg">
             {isConnected ? <UserCheck size={40} className="text-green-600"/> : <img src="https://www.google.com/favicon.ico" alt="G" className="w-10 h-10" />}
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{isConnected ? `Connected to Google` : "Connect Your Google Account"}</h2>
            <p className="text-blue-100 mt-2 text-lg max-w-xl">
                {isConnected 
                    ? "Your workspace is ready. Access all your tools instantly."
                    : "One secure sign-in to unlock Gmail, Drive, Analytics, and AI tools directly from your dashboard."}
            </p>
          </div>
        </div>
        
        {!isConnected && (
            <button 
                onClick={handleConnect}
                disabled={connecting}
                className="relative z-10 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-80 flex items-center gap-3"
            >
            {connecting ? (
                <>
                    <RefreshCw className="animate-spin" size={20}/> Connecting...
                </>
            ) : (
                <>Sign In with Google</>
            )}
            </button>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><LayoutGrid className="text-blue-600"/> Workspace Apps</h2>
        <p className="text-slate-500 mt-1">Productivity & Collaboration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ToolCard 
          icon={<Mail size={24} />} 
          name="Gmail" 
          description="Professional email & secure communication." 
          url="https://gmail.google.com"
          color="bg-red-500"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<HardDrive size={24} />} 
          name="Google Drive" 
          description="Secure cloud storage & file sharing." 
          url="https://drive.google.com"
          color="bg-blue-500"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<FileText size={24} />} 
          name="Docs & Sheets" 
          description="Documents, Spreadsheets, and Slides." 
          url="https://docs.google.com"
          color="bg-green-500"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<Video size={24} />} 
          name="Google Meet" 
          description="Premium video conferencing." 
          url="https://meet.google.com"
          color="bg-yellow-500"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<MessageSquare size={24} />} 
          name="Google Chat" 
          description="Team messaging and collaboration." 
          url="https://chat.google.com"
          color="bg-emerald-500"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<Calendar size={24} />} 
          name="Google Calendar" 
          description="Scheduling and time management." 
          url="https://calendar.google.com"
          color="bg-blue-600"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<Sparkles size={24} />} 
          name="Gemini AI" 
          description="AI-powered research & content creation." 
          url="https://gemini.google.com"
          color="bg-purple-600"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<LayoutGrid size={24} />} 
          name="AppSheet" 
          description="Build no-code automation apps." 
          url="https://www.appsheet.com"
          color="bg-indigo-600"
          locked={!isConnected}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><BarChart className="text-blue-600"/> Business Growth</h2>
        <p className="text-slate-500 mt-1">Marketing, Analytics & Cloud</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <ToolCard 
          icon={<MapPin size={24} />} 
          name="Business Profile" 
          description="Manage your storefront on Maps." 
          url="https://business.google.com"
          color="bg-blue-700"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<BarChart size={24} />} 
          name="Google Ads" 
          description="Online advertising platform." 
          url="https://ads.google.com"
          color="bg-slate-700"
          locked={!isConnected}
        />
        <ToolCard 
          icon={<Search size={24} />} 
          name="Google Analytics" 
          description="Audience insights and tracking." 
          url="https://analytics.google.com"
          color="bg-orange-500"
          locked={!isConnected}
        />
         <ToolCard 
          icon={<Globe size={24} />} 
          name="Google Cloud" 
          description="Enterprise cloud infrastructure." 
          url="https://cloud.google.com"
          color="bg-blue-500"
          locked={!isConnected}
        />
      </div>
    </div>
  );
};

// Simple Refresh Icon for loading state
const RefreshCw = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
);
