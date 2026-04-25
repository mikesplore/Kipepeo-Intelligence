/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CloudUpload, 
  BarChart3, 
  FileText, 
  Search, 
  Bell, 
  Settings, 
  Plus,
  TrendingUp,
  Zap,
  Building2,
  CheckCircle2,
  MessageSquare,
  ArrowUpRight,
  Filter,
  Download,
  Info,
  Globe,
  Printer,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { calculateResilienceScore, getStatusFromScore, type AnalysisResult } from './lib/score';

// --- Types ---
type View = 'dashboard' | 'ingestion' | 'analysis' | 'reports';

const DEFAULT_RESULT: AnalysisResult = {
  total_income: 0,
  total_expenditure: 0,
  fuliza_repayment_speed: 'none',
  utility_consistency: 'medium',
  savings_frequency: 'none',
  top_insights: [],
  behavioral_advice: "Upload or paste raw financial logs to generate insights.",
  resilienceScore: 300,
  status: 'Awaiting Data'
};

// --- Components ---

const Sidebar = ({ activeView, setView }: { activeView: View, setView: (v: View) => void }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingestion', label: 'Ingestion Hub', icon: CloudUpload },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'reports', label: 'Health Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kipepeo</h1>
        </div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">
          Informal Economy<br/>Intelligence
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-slate-50 text-slate-900 border border-slate-200 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-slate-900" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4 group cursor-pointer hover:bg-slate-100 transition-all">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" 
              alt="User" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">Michael Kimani</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">Strategic Entity</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-300 hover:text-slate-900 transition-colors" />
        </div>
        <button 
          onClick={() => setView('ingestion')}
          className="w-full bg-slate-900 text-white py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </button>
      </div>
    </aside>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <div className="flex items-center flex-1 max-w-xl">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search entity or insight..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
      </button>
      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
        <Settings className="w-5 h-5" />
      </button>
      <div 
        onClick={() => alert("Profile settings are coming soon in the next update!")}
        className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden ml-2 cursor-pointer hover:ring-2 hover:ring-slate-900/20 transition-all"
      >
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" 
          alt="User Profile" 
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </header>
);

// --- Sub-Views ---

const DashboardView = ({ data }: { data: AnalysisResult }) => {
  const resilienceData = [
    { name: 'Completed', value: data.resilienceScore },
    { name: 'Remaining', value: 850 - data.resilienceScore },
  ];
  const COLORS = ['#0f172a', '#e2e8f0'];

  const marketReach = [
    { name: 'Retail & Micro-commerce', value: 65 },
    { name: 'Agri-processing', value: 20 },
    { name: 'Service Cooperatives', value: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Humanized Data for Grassroots Financial Ecosystems</h2>
          <p className="text-slate-500 text-sm">Actionable intelligence derived from informal economy participation.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Last sync: Just now
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Resilience Score Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start mb-8">Resilience Score</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resilienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {resilienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-slate-900 leading-none">{data.resilienceScore}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{data.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 w-full mt-8 pt-8 border-t border-slate-100">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Range</p>
              <p className="text-xs font-bold text-slate-900">300-850</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Percentile</p>
              <p className="text-xs font-bold text-slate-900">
                {data.resilienceScore > 700 ? 'Top 12%' : data.resilienceScore > 500 ? 'Average' : 'Below Average'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trend</p>
              <p className="text-xs font-bold text-emerald-600">{data.resilienceScore > 500 ? '+14 pts' : 'Stable'}</p>
            </div>
          </div>
        </div>

        {/* Small Progress Cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                data.utility_consistency === 'high' ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
              )}>
                {data.utility_consistency.toUpperCase()}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Utility Consistency</h4>
            <p className="text-2xl font-bold text-slate-900 mb-4">{data.utility_consistency === 'high' ? '98.4%' : 'Consistency Check'}</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: data.utility_consistency === 'high' ? '98.4%' : '50%' }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full uppercase tracking-widest">
                {data.fuliza_repayment_speed.toUpperCase()}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Repayment Speed</h4>
            <p className="text-2xl font-bold text-slate-900 mb-4">
               {data.fuliza_repayment_speed === 'fast' ? 'Top Efficiency' : 'Velocity Logic'}
            </p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: data.fuliza_repayment_speed === 'fast' ? '95%' : '60%' }}
                className="h-full bg-slate-900 rounded-full"
              />
            </div>
          </div>

          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Financial Sentiment</h4>
                <p className="text font-bold text-slate-900">{data.resilienceScore > 600 ? 'Strong Growth' : 'Steady State'}</p>
              </div>
            </div>
            <div className="text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600">
               Kipepeo Index
            </div>
          </div>
        </div>

        {/* Recent Insights */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Recent AI Insights</h3>
          </div>
          <div className="p-6 space-y-6">
            {data.top_insights.length > 0 ? data.top_insights.map((insight, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{insight}</h4>
                    <span className="text-[10px] font-medium text-slate-400">Analysis Result</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 p-4 border border-dashed border-slate-100 rounded-xl">No insights generated yet. Ingest data to begin.</p>
            )}
          </div>
        </div>

        {/* Market Sector Reach */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Market Sector Reach</h3>
          <div className="space-y-6">
            {marketReach.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.name}</span>
                  <span className="text-sm font-black text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    className={cn(
                      "h-full rounded-full",
                      i === 0 ? "bg-slate-900" : i === 1 ? "bg-slate-400" : "bg-slate-200"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-32 object-cover transition-transform group-hover:scale-105" 
              alt="Market Trends"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-center p-4">
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-1">Market Trends</p>
                <div className="h-px w-8 bg-white/40 mx-auto mb-2"></div>
                <p className="text-xs text-white/80 font-medium">Safe Work Index</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FileData {
  data: string;
  mimeType: string;
  name: string;
}

const IngestionHubView = ({ onAnalyze }: { onAnalyze: (text: string, files: FileData[]) => void }) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: FileData[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const base64 = await fileToBase64(file);
      newFiles.push({
        data: base64.split(',')[1],
        mimeType: file.type,
        name: file.name
      });
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!inputText.trim() && files.length === 0) return;
    setIsLoading(true);
    await onAnalyze(inputText, files);
    setIsLoading(false);
  };

  const sampleLogs = `
MPESA: RZH9XYZ789 Confirmed. KES 4,500.00 sent to Wholesale Traders for account INV-990 on 25/4/26 at 10:15 AM. New M-PESA balance is KES 1,240.00. Use M-PESA to pay for your NHIF today!

(0722123456): Niaje bro, nimesend ile 2k kwa makosa. Nirudishie kwa hii number tafadhali. 

KPLC: Token purchase KES 1,000.00 confirmed. Trans ID: KPLC456. Meter: 37190001234. Token: 5584-9920-3341-0092-1182. Units: 38.4. Value: KES 780.00, VAT: KES 120.00. 

MPESA: RZH2DEF456 Confirmed. KES 850.00 automatically deducted to settle your outstanding Fuliza M-PESA. Balance is KES 390.00. Fuliza limit is 5,000.00.

Safaricom: Get 500MB for only 50/- valid for 24hrs! Dial *544# to buy. 

M-SHWARI: KES 2,000.00 deposited to your M-Shwari account from M-PESA on 25/4/26. New M-Shwari balance is KES 15,500.00. Loan limit: 8,000.00.

MPESA: RZH1ABC123 Confirmed. KES 1,200.00 received from John Doe 0712345678 on 24/4/26 at 2:30 PM. New M-PESA balance is KES 5,740.00.
Receipt No. | Completion Time | Details | Status | Paid In | Paid Out | Balance
-----------------------------------------------------------------------------------
RZH9XYZ789 | 2026-04-25 10:15 | Sent to Wholesale Traders | Completed | - | 4,500.00 | 1,240.00
RZH2DEF456 | 2026-04-25 09:30 | Fuliza M-Pesa Deduction | Completed | - | 850.00 | 390.00
RZH1ABC123 | 2026-04-24 14:30 | Received from 0712***678 | Completed | 1,200.00 | - | 5,740.00
RZH0KPLC456| 2026-04-23 20:00 | Pay Bill to 888880 (KPLC) | Completed | - | 1,000.00 | 4,540.00
RZH8FULZA  | 2026-04-22 11:10 | M-Pesa Overdraw | Completed | 350.00 | - | 0.00
RZH7MSHWARI| 2026-04-20 08:00 | M-Shwari Deposit | Completed | - | 2,000.00 | 5,540.00
  `;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Ingestion Hub</h2>
        <p className="text-slate-500 text-sm mt-1">Bridge the gap between informal ledgers and intelligent insights.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 relative">
            <div className="absolute top-6 right-6">
              <span className="text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">Active Portal</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Ingest Financial Data</h3>
              
              <div className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste M-Pesa statements, Fuliza logs, or KPLC token SMS here..."
                  className="w-full h-48 bg-transparent text-sm text-slate-900 focus:outline-none resize-none"
                />
                
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm group">
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{file.name}</span>
                        <button 
                          onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Plus className="w-3 h-3 rotate-45" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setInputText(sampleLogs)}
                      className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
                    >
                      Load Sample Logs
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      <CloudUpload className="w-3 h-3" />
                      Upload Statements/Photos
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      multiple 
                      className="hidden" 
                      accept="image/*,application/pdf,.csv"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">AI can parse photos of ledgers or CSV statements</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className={cn(
                  "bg-slate-900 text-white px-10 py-3.5 rounded-lg text-sm font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-2",
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-800"
                )}
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 animate-pulse" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Run AI Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Uploads</h3>
              <button className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:gap-2 transition-all">
                View Archive <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">File Name</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Engine</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium text-slate-600">
                  {[
                    { name: 'march_2024_ledger_capture.jpg', source: 'Image Capture', status: 'Analyzed', statusColor: 'bg-emerald-50 text-emerald-600' },
                    { name: 'm_pesa_logs_week42.csv', source: 'SMS Log', status: 'Processing...', statusColor: 'bg-slate-100 text-slate-400' }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-5 text-slate-900 font-bold">{row.name}</td>
                      <td className="px-6 py-5 flex items-center gap-2">
                        {row.source === 'SMS Log' ? <MessageSquare className="w-3 h-3 opacity-50" /> : <FileText className="w-3 h-3 opacity-50" />}
                        {row.source}
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest", row.statusColor)}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1 opacity-50">
                          <Zap className="w-3 h-3" />
                          <span className="font-black italic">GEMINI 1.5</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Analysis Power</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-black text-white">84%</span>
              <span className="text-sm font-medium text-slate-400">Capacity Used</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mb-6">
              <div className="h-full w-[84%] bg-emerald-400 rounded-full"></div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Gemini 1.5 Flash is currently processing your informal data stream with high precision.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Ingestion Tips</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Ensure text in ledgers is legible and well-lit.',
                'Export SMS logs in raw .csv format for best results.',
                'Batch your uploads by week to maintain cleaner timelines.'
              ].map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Supported Formats</p>
              <div className="flex flex-wrap gap-2">
                {['JPG', 'PNG', 'CSV', 'PDF'].map(fmt => (
                  <span key={fmt} className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-black tracking-widest">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bbbda536ad41?auto=format&fit=crop&q=80&w=400" 
              className="w-full h-48 object-cover opacity-60 group-hover:scale-105 transition-transform" 
              alt="Visualization"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-sm mb-1">Real-time Visualization</h4>
              <p className="text-slate-300 text-[10px] font-medium leading-relaxed">
                Transform physical data into live charts instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">Market Intelligence</span>
          <h2 className="text-3xl font-black text-slate-900">Behavioral Transaction Mapping</h2>
          <p className="text-slate-500 text-sm max-w-2xl">
            Visualizing informal economy flows by translating Sheng-nuanced SMS logs into institutional-grade financial intent metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400">Total Volume</span>
            <CloudUpload className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">KES 142,400</p>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 12.4% vs last month
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400">Resilience Score</span>
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">742</p>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Plus className="w-3 h-3" /> +18 points identified
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400">Intent Distribution</span>
            <Globe className="w-4 h-4 text-slate-300" />
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-6 flex">
            <div className="h-full bg-slate-900 w-[65%]" title="Business"></div>
            <div className="h-full bg-emerald-400 w-[20%]" title="Stocking"></div>
            <div className="h-full bg-slate-200 w-[15%]" title="Other"></div>
          </div>
          <div className="flex justify-between mt-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">65% Biz Flow</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-900">Recent Log Analysis</h3>
            <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>
        
        <div className="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
                <th className="px-8 py-4">Date / Time</th>
                <th className="px-8 py-4">Transaction Details (Raw)</th>
                <th className="px-8 py-4">AI Interpretation</th>
                <th className="px-8 py-4">Economic Intent</th>
                <th className="px-8 py-4 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { 
                  date: 'Oct 24, 09:12 AM', 
                  raw: 'M-Shwari loan ya stock "Sent KES 4,500 to Wholesale Traders"',
                  ai: 'Business capital infusion for inventory replacement.',
                  intent: { label: 'BUSINESS STOCKING', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                  impact: { val: '+4.2 pts', color: 'text-emerald-600' }
                },
                { 
                  date: 'Oct 23, 08:45 PM', 
                  raw: 'Kupiga luku - Nairobi CBD "Sent KES 2,200 to MTUMBA HUB"',
                  ai: 'Discretionary spending on personal presentation/apparel.',
                  intent: { label: 'LIFESTYLE CONS.', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
                  impact: { val: '-0.5 pts', color: 'text-slate-400' }
                },
                { 
                  date: 'Oct 23, 11:20 AM', 
                  raw: 'Zuku Internet - Nyumbani "Sent KES 3,500 to Zuku Fiber"',
                  ai: 'Recurring digital infrastructure overhead for home office.',
                  intent: { label: 'OPEX ESSENTIAL', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                  impact: { val: '+1.8 pts', color: 'text-emerald-600' }
                },
                { 
                   date: 'Oct 22, 06:15 PM', 
                   raw: 'Fuliza - Kulipa mama mboga "Fuliza automatic deduction KES 850"',
                   ai: 'Short-term credit bridge for essential food procurement.',
                   warning: true,
                   intent: { label: 'CREDIT STRESS', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
                   impact: { val: '-2.4 pts', color: 'text-rose-600' }
                },
                { 
                   date: 'Oct 21, 02:30 PM', 
                   raw: 'Chama contribution - 4/12 "Sent KES 10,000 to Merry-Go-Round Group"',
                   ai: 'Social capital investment / Scheduled savings deposit.',
                   intent: { label: 'SOCIAL SAVINGS', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                   impact: { val: '+5.5 pts', color: 'text-emerald-600' }
                }
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-xs text-slate-500 font-medium">{row.date}</td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-900 mb-1">{row.raw.split('"')[0]}</p>
                    <p className="text-[10px] text-slate-400 italic">"{row.raw.split('"')[1]}"</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {row.warning ? <Info className="w-4 h-4 text-rose-500" /> : <Plus className="w-4 h-4 text-slate-300" />}
                      </div>
                      <p className={cn("text-xs leading-relaxed font-medium", row.warning ? "text-rose-700" : "text-slate-600")}>
                        {row.ai}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("px-2 py-1 rounded text-[8px] font-black uppercase tracking-[0.1em] transition-all cursor-default", row.intent.color)}>
                      {row.intent.label}
                    </span>
                  </td>
                  <td className={cn("px-8 py-6 text-right font-black text-sm", row.impact.color)}>
                    {row.impact.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 1,240 identified events</span>
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:text-slate-900 hover:bg-white disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                 <button key={p} className={cn("w-8 h-8 rounded-md text-xs font-bold flex items-center justify-center transition-all", p === 1 ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-white hover:border-slate-300")}>
                   {p}
                 </button>
              ))}
            </div>
            <button className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:text-slate-900 hover:bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-[2rem] p-10 relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1 space-y-6">
               <div className="flex items-center gap-2 text-emerald-400">
                 <Zap className="w-5 h-5 fill-emerald-400" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deep Behavioral Analysis</span>
               </div>
               <h3 className="text-3xl font-bold text-white leading-tight">Strategic Inventory Pattern Recognized</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 The user consistently utilizes <span className="text-white font-bold">M-Shwari credit</span> every 15th of the month to "Kupiga stock," followed by high-velocity small receipts over the following 10 days. This indicates a high-frequency trading cycle with consistent repayment capacity.
               </p>
               <div className="flex flex-wrap gap-4 pt-2">
                 <button className="px-6 py-2.5 bg-emerald-400 text-slate-900 rounded-lg text-sm font-black hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20 active:scale-95">
                   Adjust Credit Limit
                 </button>
                 <button className="px-6 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all">
                   View Details
                 </button>
               </div>
             </div>
             <div className="w-48 h-48 rounded-full border-[12px] border-slate-800 border-t-emerald-400 rotate-12 flex items-center justify-center relative shrink-0">
                <span className="text-4xl font-black text-white italic tracking-tighter">742</span>
             </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-[2rem] p-10 text-center flex flex-col items-center justify-center">
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
             <Globe className="w-8 h-8 text-slate-900" />
           </div>
           <h3 className="text-lg font-bold text-slate-900 mb-2">Linguistic Confidence</h3>
           <p className="text-xs text-slate-500 leading-relaxed mb-8">
             The NLP engine is currently operating with <span className="text-emerald-600 font-bold">98.2% accuracy</span> for the current Nairobi/Sheng dialect model.
           </p>
           <div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Model Version</p>
             <div className="bg-slate-50 px-4 py-1.5 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
               v4.2-KEN-SHENG
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const HealthReportsView = ({ data }: { data: AnalysisResult }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Health Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Institutional certificates and summaries of grassroots financial health.</p>
        </div>
        <button 
          onClick={() => window.print()}
          title="Print Health Report"
          className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 fixed bottom-8 right-12 z-20 print:hidden"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[800px] relative">
        {/* Certificate Header */}
        <div className="p-12 pb-0 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Verification Certificate</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kipepeo Financial Health Report</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate ID: KP-{Math.floor(Math.random()*90000)+10000}-X</p>
             <p className="text-[10px] font-medium text-slate-400">Issued: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Big Resilience Circle */}
        <div className="py-20 flex flex-col items-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Resilience Score</p>
           <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                   cx="128" cy="128" r="110" 
                   fill="none" stroke="#f1f5f9" strokeWidth="12"
                />
                <motion.circle 
                   initial={{ strokeDasharray: "0 690" }}
                   animate={{ strokeDasharray: `${(data.resilienceScore / 850) * 690} 690` }}
                   cx="128" cy="128" r="110" 
                   fill="none" stroke="#059669" strokeWidth="12"
                   strokeLinecap="round"
                   transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-7xl font-black text-slate-900 tracking-tighter">{data.resilienceScore}</span>
                 <span className="text-sm font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mt-2">{data.status}</span>
              </div>
           </div>
        </div>

        {/* Natural Language Summary */}
        <div className="px-20 text-center space-y-6">
           <h4 className="text-2xl font-black text-slate-900">Natural Language Summary</h4>
           <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
             <p className="text-xl text-slate-600 leading-relaxed italic max-w-2xl mx-auto font-medium">
               "{data.behavioral_advice}"
             </p>
           </div>
        </div>

        {/* Core Strengths Grid */}
        <div className="p-12 pt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 <h4 className="text-lg font-bold text-slate-900">Core Strengths</h4>
              </div>
              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                       <Zap className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                       <h5 className="text-sm font-bold text-slate-900 mb-1">Utility Consistency</h5>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          Perfect 24-month payment history for essential business utilities.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                       <Building2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                       <h5 className="text-sm font-bold text-slate-900 mb-1">Business Bridge usage</h5>
                       <p className="text-xs text-slate-500 leading-relaxed">
                          Strategic utilization of short-term credit to maintain inventory flow.
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-100 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full -mr-24 -mt-24"></div>
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Capital Efficiency</h4>
                 <p className="text-4xl font-black text-slate-900">8.4x</p>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-6">
                    <div className="h-full w-[85%] bg-slate-900 rounded-full"></div>
                 </div>
                 <p className="text-[10px] text-slate-400 mt-3 font-medium">Inventory turnover relative to credit lines.</p>
              </div>
              <div className="pt-12 relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Social Proof Score</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-indigo-600">92/100</span>
                    <span className="text-[10px] font-medium text-slate-400 italic">via Chama nodes</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Background Letters */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-slate-900 shadow-slate-900/10 pointer-events-none select-none opacity-[0.02] tracking-tighter mix-blend-multiply">
           KIPEPEO
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [analysisData, setAnalysisData] = useState<AnalysisResult>(DEFAULT_RESULT);

  const handleAnalyze = async (rawText: string, files: FileData[] = []) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please set it in AI Studio Secrets.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const fileParts = files.map(f => ({
        inlineData: {
          data: f.data,
          mimeType: f.mimeType
        }
      }));

      const textPart = {
        text: `Analyze these Kenyan financial logs (M-Pesa, Fuliza, KPLC), statements, or ledger photos: \n\n ${rawText}`
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [...fileParts, textPart]
        },
        config: {
          systemInstruction: `
            As a 'Kenyan Financial Data Parser', extract data from the provided logs, photos of ledger books, or PDF statements.
            If images or PDFs are provided, perform OCR and semantic parsing to understand the transactions.
            
            Strictly extract:
            1. total_income (number)
            2. total_expenditure (number)
            3. fuliza_repayment_speed (enum: 'fast', 'medium', 'slow', 'none')
            4. utility_consistency (enum: 'high', 'medium', 'low')
            5. savings_frequency (enum: 'regular', 'occasional', 'none')
            6. top_insights (array of strings, Sheng/English mix)
            7. behavioral_advice (string, Sheng/English mix)
          `,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              total_income: { type: Type.NUMBER },
              total_expenditure: { type: Type.NUMBER },
              fuliza_repayment_speed: { type: Type.STRING, enum: ['fast', 'medium', 'slow', 'none'] },
              utility_consistency: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
              savings_frequency: { type: Type.STRING, enum: ['regular', 'occasional', 'none'] },
              top_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
              behavioral_advice: { type: Type.STRING }
            },
            required: ['total_income', 'total_expenditure', 'fuliza_repayment_speed', 'utility_consistency', 'savings_frequency', 'top_insights', 'behavioral_advice']
          }
        },
      });

      const extractedData = JSON.parse(response.text || "{}");
      const score = calculateResilienceScore(extractedData);
      
      const result: AnalysisResult = {
        ...extractedData,
        resilienceScore: score,
        status: getStatusFromScore(score)
      };

      setAnalysisData(result);
      setActiveView('dashboard');
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Trace: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView data={analysisData} />;
      case 'ingestion': return <IngestionHubView onAnalyze={handleAnalyze} />;
      case 'analysis': return <AnalysisView />;
      case 'reports': return <HealthReportsView data={analysisData} />;
      default: return <DashboardView data={analysisData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <Sidebar activeView={activeView} setView={setActiveView} />
      
      <main className="pl-64 flex flex-col min-h-screen">
        <Header title={activeView.charAt(0).toUpperCase() + activeView.slice(1)} />
        
        <div className="p-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="px-10 py-6 text-center">
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
             &copy; 2024 Kipepeo Intelligence &bull; AI Powered Financial Governance
           </p>
        </footer>
      </main>
    </div>
  );
}
