import React from 'react';
import { ScanSearch, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { formatDate } from '../../utils/formatters';

const POPULAR_TARGETS = ['nginx:latest', 'python:3.11-slim', 'node:20-alpine', 'alpine:3.19', 'ubuntu:22.04', 'redis:7-alpine'];

const ScanTab = ({
  scanInput, setScanInput, scanType, setScanType,
  scanning, scanProgress, scanResult, scanError,
  onScan, onNavigate, scans,
}) => {
  const getProgressMessage = () => {
    if (scanProgress < 20) return 'Initializing Trivy scanner...';
    if (scanProgress < 50) return 'Downloading vulnerability database...';
    if (scanProgress < 80) return 'Analyzing dependencies and components...';
    return 'Finalizing results...';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B1F3B]">SCA Scanner</h1>
        <p className="text-gray-500 text-sm mt-1">Powered by Trivy v0.69 — Real vulnerability scanning</p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1B1F3B] flex items-center justify-center mx-auto mb-6">
              <ScanSearch className="w-8 h-8 text-[#C8FF00]" />
            </div>
            <h2 className="text-xl font-bold text-[#1B1F3B] mb-2">Scan Your Target</h2>
            <p className="text-gray-500 text-sm mb-6">Enter a Docker image, Git repository URL, or filesystem path</p>

            {/* Type Selector */}
            <div className="flex justify-center gap-2 mb-4">
              {[
                { value: 'image', label: 'Docker Image' },
                { value: 'repo', label: 'Git Repo' },
                { value: 'fs', label: 'Filesystem' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setScanType(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scanType === t.value ? 'bg-[#1B1F3B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >{t.label}</button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3 mb-6">
              <input
                type="text" value={scanInput} onChange={e => setScanInput(e.target.value)}
                placeholder={
                  scanType === 'image' ? 'e.g., nginx:latest, python:3.11-slim' :
                  scanType === 'repo' ? 'e.g., https://github.com/org/repo' : 'e.g., /path/to/project'
                }
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1F3B]/20 focus:border-[#1B1F3B]/30"
                disabled={scanning}
                onKeyDown={e => e.key === 'Enter' && onScan()}
              />
              <Button onClick={onScan} disabled={scanning || !scanInput.trim()} className="bg-[#E8553A] hover:bg-[#d44a32] text-white px-8 h-[48px]">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Scanning...</> : 'Scan Now'}
              </Button>
            </div>

            {scanning && (
              <div className="space-y-3">
                <Progress value={Math.min(scanProgress, 100)} className="h-2" />
                <p className="text-sm text-gray-500">{getProgressMessage()} {Math.min(Math.round(scanProgress), 100)}%</p>
              </div>
            )}

            {scanError && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6 text-left">
                <p className="font-semibold text-red-800 mb-2">Scan Failed</p>
                <p className="text-sm text-red-600">{scanError}</p>
                <p className="text-xs text-gray-500 mt-2">Tip: For Docker images, ensure the image name is valid (e.g., nginx:latest).</p>
              </div>
            )}

            {scanResult && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="font-semibold text-green-800">Scan Complete — {scanResult.duration}</span>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Critical', value: scanResult.summary?.severity_counts?.CRITICAL || 0, color: 'text-red-600' },
                    { label: 'High', value: scanResult.summary?.severity_counts?.HIGH || 0, color: 'text-orange-600' },
                    { label: 'Medium', value: scanResult.summary?.severity_counts?.MEDIUM || 0, color: 'text-yellow-600' },
                    { label: 'Low', value: scanResult.summary?.severity_counts?.LOW || 0, color: 'text-blue-600' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Found {scanResult.summary?.total_components || 0} components with {scanResult.summary?.total_vulnerabilities || 0} vulnerabilities.{' '}
                  <button className="text-[#E8553A] font-medium hover:underline" onClick={() => onNavigate('vulnerabilities')}>View full report →</button>
                </p>
              </div>
            )}

            {/* Quick Targets */}
            <div className="mt-8 text-left">
              <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Popular targets to try:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TARGETS.map(img => (
                  <button key={img} onClick={() => { setScanInput(img); setScanType('image'); }}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors font-mono">
                    {img}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanTab;
