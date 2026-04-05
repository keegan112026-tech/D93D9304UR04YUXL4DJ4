import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, ShieldAlert, Scale, 
  HelpCircle, AlertTriangle, MessageSquare 
} from 'lucide-react';

/**
 * FactStatusBadge: Unified Institutional Status
 * Standardizes the "Reliability/Fact" marking across the platform.
 */
export default function FactStatusBadge({ status, className = "" }) {
  const config = {
    'Confirmed': {
      icon: <CheckCircle size={10} />,
      styles: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: '已證實 / Confirmed'
    },
    'Claim': {
      icon: <MessageSquare size={10} />,
      styles: 'bg-amber-50 text-amber-700 border-amber-200',
      label: '單方主張 / Claim'
    },
    'Court Recognized': {
      icon: <Scale size={10} />,
      styles: 'bg-blue-50 text-blue-700 border-blue-200',
      label: '法院採認 / Recognized'
    },
    'Institutional Position': {
      icon: <ShieldAlert size={10} />,
      styles: 'bg-slate-50 text-slate-700 border-slate-200',
      label: '機關立場 / Institutional'
    },
    'Danger': {
      icon: <AlertTriangle size={10} />,
      styles: 'bg-rose-50 text-rose-700 border-rose-200',
      label: '高度爭議 / Contested'
    },
    'Rumor': {
      icon: <HelpCircle size={10} />,
      styles: 'bg-purple-50 text-purple-700 border-purple-200',
      label: '傳言未證實 / Rumor'
    }
  };

  const current = config[status] || config['Rumor'];

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-4 px-6 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest font-sans italic border shadow-sm transition-all ${current.styles} ${className}`}
    >
      {current.icon}
      {current.label}
    </Badge>
  );
}
