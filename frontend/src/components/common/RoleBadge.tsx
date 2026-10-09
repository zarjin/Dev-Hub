import React from 'react';
import { Badge } from '../ui/Badge';
import { ShieldAlert, ShieldCheck, UserCheck, Crown, Code2, Palette, Eye } from 'lucide-react';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm', className }) => {
  switch (role) {
    case 'owner':
      return (
        <Badge variant="purple" size={size} className={className}>
          <Crown className="h-3 w-3 mr-1 text-purple-400" />
          Owner
        </Badge>
      );
    case 'admin':
      return (
        <Badge variant="primary" size={size} className={className}>
          <ShieldAlert className="h-3 w-3 mr-1 text-devhub-400" />
          Admin
        </Badge>
      );
    case 'team_lead':
      return (
        <Badge variant="warning" size={size} className={className}>
          <ShieldCheck className="h-3 w-3 mr-1 text-amber-400" />
          Team Lead
        </Badge>
      );
    case 'developer':
      return (
        <Badge variant="primary" size={size} className={className}>
          <Code2 className="h-3 w-3 mr-1 text-devhub-300" />
          Developer
        </Badge>
      );
    case 'designer':
      return (
        <Badge variant="purple" size={size} className={className}>
          <Palette className="h-3 w-3 mr-1 text-fuchsia-400" />
          Designer
        </Badge>
      );
    case 'viewer':
      return (
        <Badge variant="neutral" size={size} className={className}>
          <Eye className="h-3 w-3 mr-1 text-slate-400" />
          Viewer
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          <UserCheck className="h-3 w-3 mr-1 text-slate-400" />
          {role}
        </Badge>
      );
  }
};
