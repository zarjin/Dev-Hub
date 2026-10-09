import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Moon, Bell, Key, Check, Copy } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(true);

  const mockApiKey = 'devhub_live_sec_8921f0a28bd937d10c2834b';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure notification preferences, security tokens, and theme settings
        </p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-devhub-400" />
            <span>Theme &amp; Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Dark-First Mode</h4>
              <p className="text-[11px] text-slate-400">
                Optimized for code readability and OLED screens.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-devhub-400 bg-devhub-500/10 px-2.5 py-1 rounded-lg border border-devhub-500/20">
              Active (Default)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-devhub-400" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-surface-border">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Task Assigned Alerts</h4>
              <p className="text-[11px] text-slate-400">
                Notify when a task ticket is assigned to you.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded bg-surface-card border-surface-border text-devhub-500 h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-surface-border">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Task Review Requests</h4>
              <p className="text-[11px] text-slate-400">
                Notify when a developer submits work for lead review.
              </p>
            </div>
            <input
              type="checkbox"
              checked={reviewAlerts}
              onChange={(e) => setReviewAlerts(e.target.checked)}
              className="rounded bg-surface-card border-surface-border text-devhub-500 h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Comment Thread Mentions</h4>
              <p className="text-[11px] text-slate-400">
                Notify when someone replies to your comment.
              </p>
            </div>
            <input
              type="checkbox"
              checked={browserAlerts}
              onChange={(e) => setBrowserAlerts(e.target.checked)}
              className="rounded bg-surface-card border-surface-border text-devhub-500 h-4 w-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* API Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-4 w-4 text-devhub-400" />
            <span>API &amp; Express Backend Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            The frontend connects via centralized Axios client using the environment variable{' '}
            <code className="text-devhub-400 font-mono bg-surface-elevated px-1.5 py-0.5 rounded border border-surface-border">
              VITE_API_URL
            </code>
            .
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-400">
              Personal Access Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={mockApiKey}
                className="flex-1 bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs font-mono text-slate-300 select-all"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyKey}
                leftIcon={apiKeyCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              >
                {apiKeyCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
