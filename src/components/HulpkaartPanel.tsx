'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, BookOpen, X } from 'lucide-react';

interface HulpkaartSection {
  title: string;
  type: 'chips' | 'table' | 'contrast';
  items: any[];
}

interface HulpkaartPanelProps {
  data: any;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const HulpkaartPanel: React.FC<HulpkaartPanelProps> = ({ data, isCollapsed, onToggle, isMobile }) => {
  if (!data) return null;

  const sections = data.sections || [];

  if (isMobile) {
    if (isCollapsed) return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 bg-[#e63946] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-bounce"
      >
        <BookOpen size={20} />
        <span>Hulpkaart</span>
      </button>
    );

    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#1a1a2e] w-full max-h-[85vh] rounded-t-3xl overflow-hidden border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="p-5 bg-[#e63946] flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2 text-lg">
              <BookOpen size={24} />
              📋 Hulpkaart
            </h3>
            <button onClick={onToggle} className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[75vh] space-y-8">
            {sections.map((section: any, idx: number) => (
              <RenderSection key={idx} section={section} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`transition-all duration-500 ease-in-out border-l border-gray-800 bg-[#1a1a2e] shadow-2xl sticky top-0 h-fit max-h-screen overflow-y-auto flex flex-col z-30 self-start ${
        isCollapsed ? 'w-16' : 'w-96'
      }`}
    >
      <div 
        className={`p-4 bg-[#e63946] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}
      >
        {!isCollapsed && (
          <h3 className="text-white font-bold flex items-center gap-2">
            <BookOpen size={20} />
            📋 Hulpkaart
          </h3>
        )}
        <button 
          onClick={onToggle}
          className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          title={isCollapsed ? "Open Hulpkaart" : "Sluit Hulpkaart"}
        >
          {isCollapsed ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      <div className={`p-5 space-y-8 ${isCollapsed ? 'hidden' : 'block'}`}>
        {sections.map((section: any, idx: number) => (
          <RenderSection key={idx} section={section} />
        ))}
      </div>
    </div>
  );
};

const RenderSection = ({ section }: { section: any }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
      <h4 className="text-xs uppercase tracking-widest text-[#e63946] font-black mb-4 border-b border-[#e63946]/20 pb-2">
        {section.title}
      </h4>
      
      {section.type === 'chips' && (
        <div className="flex flex-wrap gap-2">
          {section.items.map((item: any, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-[#2a2a3e] border border-[#f4a261] rounded-lg text-sm shadow-md flex items-center gap-2 group hover:scale-105 transition-all cursor-default">
              <span className="text-[#f4a261] font-bold">{item.es}</span>
              <span className="text-gray-500 text-xs">·</span>
              <span className="text-gray-400">{item.nl}</span>
            </span>
          ))}
        </div>
      )}

      {section.type === 'table' && (
        <div className="bg-[#2a2a3e] rounded-xl border border-gray-700 overflow-hidden shadow-lg">
          <div className="divide-y divide-gray-700/50">
            {section.items.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                <span className="text-gray-400 text-sm font-medium">{item.left}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#e63946] font-bold">→</span>
                  <span className="text-[#f4a261] font-black text-sm">{item.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.type === 'contrast' && (
        <div className="space-y-3">
          {section.items.map((item: any, i: number) => (
            <div key={i} className="bg-gradient-to-r from-[#2a2a3e] to-[#1a1a2e] p-3 rounded-lg border border-gray-700 flex flex-col gap-1 shadow-md hover:scale-[1.02] transition-transform">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nederlands</div>
              <div className="text-sm text-gray-300 italic">{item.nl}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f4a261]"></div>
                <div className="text-sm text-[#f4a261] font-bold">{item.es}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HulpkaartPanel;
