'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Moon, Sun, Shield, Mail, Smartphone, Save } from 'lucide-react';

const notificationChannels = [
  { id: 'email', label: 'Email', icon: Mail, enabled: true },
  { id: 'push', label: 'Push Notifications', icon: Smartphone, enabled: true },
  { id: 'sms', label: 'SMS Alerts', icon: Bell, enabled: false },
];

const notificationEvents = [
  { id: 'critical', label: 'Critical alerts', email: true, push: true, sms: true },
  { id: 'warning', label: 'Warning alerts', email: true, push: true, sms: false },
  { id: 'info', label: 'Info alerts', email: false, push: true, sms: false },
  { id: 'deploy', label: 'Deployments', email: true, push: false, sms: false },
  { id: 'maintenance', label: 'Maintenance windows', email: true, push: true, sms: false },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-sars-100">Settings</h1>
        <p className="text-sm text-sars-400">System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-sars-800/50 bg-sars-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sars-100">
              <User className="h-5 w-5 text-sars-400" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sars-700 text-lg font-bold text-sars-100">
                JD
              </div>
              <div>
                <p className="text-base font-medium text-sars-100">Jane Doe</p>
                <p className="text-sm text-sars-400">jane.doe@sars.local</p>
                <Badge variant="secondary">Administrator</Badge>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: 'Jane Doe' },
                { label: 'Email', value: 'jane.doe@sars.local' },
                { label: 'Phone', value: '+1 (555) 0123-4567' },
                { label: 'Timezone', value: 'UTC-5 (Eastern)' },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3">
                  <div>
                    <p className="text-xs text-sars-500">{field.label}</p>
                    <p className="text-sm text-sars-100">{field.value}</p>
                  </div>
                  <button className="text-xs text-sars-400 hover:text-sars-200">Edit</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                <Bell className="h-5 w-5 text-sars-400" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {notificationChannels.map((ch) => (
                  <button
                    key={ch.id}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                      ch.enabled
                        ? 'border-sars-600 bg-sars-700/50 text-sars-100'
                        : 'border-sars-800 text-sars-500 hover:border-sars-700'
                    }`}
                  >
                    <ch.icon className="h-4 w-4" />
                    {ch.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {notificationEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-2.5"
                  >
                    <span className="text-sm text-sars-300">{evt.label}</span>
                    <div className="flex gap-3 text-xs text-sars-500">
                      <span className={evt.email ? 'text-green-400' : 'text-sars-600'}>Email</span>
                      <span className={evt.push ? 'text-green-400' : 'text-sars-600'}>Push</span>
                      <span className={evt.sms ? 'text-green-400' : 'text-sars-600'}>SMS</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-sars-800/50 bg-sars-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sars-100">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-sars-400" />
                ) : (
                  <Sun className="h-5 w-5 text-sars-400" />
                )}
                Theme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors ${
                    theme === 'dark'
                      ? 'border-sars-600 bg-sars-700/50 text-sars-100'
                      : 'border-sars-800 text-sars-500 hover:border-sars-700'
                  }`}
                >
                  <Moon className="h-4 w-4" /> Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors ${
                    theme === 'light'
                      ? 'border-sars-600 bg-sars-700/50 text-sars-100'
                      : 'border-sars-800 text-sars-500 hover:border-sars-700'
                  }`}
                >
                  <Sun className="h-4 w-4" /> Light
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-sars-800/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-sars-400" />
                  <div>
                    <p className="text-sm text-sars-100">Session</p>
                    <p className="text-xs text-sars-500">Last login: 2h ago from 10.0.1.45</p>
                  </div>
                </div>
                <button className="text-xs text-red-400 hover:text-red-300">Logout</button>
              </div>

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sars-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sars-500">
                <Save className="h-4 w-4" /> Save Preferences
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
