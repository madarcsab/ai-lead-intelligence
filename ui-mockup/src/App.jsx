import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Sparkles, 
  Search, 
  Phone, 
  Mail, 
  FileText, 
  ArrowRight, 
  Check, 
  X, 
  Play, 
  Download, 
  Upload,
  Globe, 
  Linkedin, 
  ChevronRight, 
  Layers, 
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Volume2
} from 'lucide-react';

// ==========================================
// High-Fidelity Mock Data
// ==========================================
const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: "HubSpot B2B SaaS CS Target",
    type: "B2B SaaS",
    geo: "United States, Canada",
    size: "50-200 employees",
    goal: "Sourcing heads of Customer Success/Experience at B2B SaaS companies using HubSpot CRM to offer custom integrations.",
    titles: ["VP of Customer Success", "Director of Client Services", "Head of Customer Experience", "VP of Customer Relations"],
    keywords: ["SaaS", "software", "recurring revenue", "subscription", "cloud"],
    exclusions: ["support manager", "helpdesk", "intern", "representative", "assistant"],
    techStack: ["HubSpot", "Intercom", "Stripe"],
    status: "Active",
    sourced: 142,
    verified: 98,
    exceptions: 12
  },
  {
    id: 2,
    name: "Salesforce Enterprise Ops",
    type: "Enterprise",
    geo: "United Kingdom",
    size: "200+ employees",
    goal: "Targeting Operations VPs and Directors at enterprise logistics firms using Salesforce.",
    titles: ["VP of Operations", "Director of Sales Operations", "Head of Business Operations"],
    keywords: ["logistics", "supply chain", "fulfillment", "shipping"],
    exclusions: ["sdr", "representative", "coordinator", "intern"],
    techStack: ["Salesforce", "Marketo"],
    status: "Paused",
    sourced: 310,
    verified: 245,
    exceptions: 0
  }
];

const INITIAL_LEADS = [
  {
    id: 101,
    campaignId: 1,
    name: "Sarah Jenkins",
    title: "VP of Customer Experience & Success",
    company: "Acme Corp",
    email: "s.jenkins@acme.io",
    phone: "+1 (555) 019-2834",
    linkedin: "linkedin.com/in/sarah-jenkins-acme",
    size: 75,
    industry: "B2B SaaS",
    techStack: ["HubSpot", "Intercom", "Stripe"],
    status: "Email Approved",
    fitScore: 95,
    bio: "Over 12 years building customer-centric onboarding frameworks and reducing churn in B2B software.",
    website: "Acme Corp is a B2B SaaS vendor providing customer communication APIs, ticketing boards, and messaging platforms.",
    smtpLog: "HELO leadflow-verify.com\n250 leadflow-verify.com HELO approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 Sender OK\nRCPT TO: <s.jenkins@acme.io>\n250 Recipient OK (Active Mailbox verified)",
    vapiTranscript: null,
    vapiStatus: "Skipped (Direct SMTP Approved)"
  },
  {
    id: 102,
    campaignId: 1,
    name: "David Chen",
    title: "Director of Client Success",
    company: "Vercel Inc.",
    email: "david.chen@vercel.com",
    phone: "+1 (555) 014-9821",
    linkedin: "linkedin.com/in/dchen-vercel",
    size: 180,
    industry: "B2B Cloud Hosting",
    techStack: ["HubSpot", "Stripe"],
    status: "Phone Verified",
    fitScore: 92,
    bio: "Directing developer relations and onboarding teams at Vercel. Focused on enterprise customer health index.",
    website: "Vercel is a developer-centric frontend cloud platform hosting millions of web applications globally.",
    smtpLog: "HELO leadflow-verify.com\n250 leadflow-verify.com HELO approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 Sender OK\nRCPT TO: <david.chen@vercel.com>\n250 Recipient OK (Active Mailbox verified)",
    vapiStatus: "Verified",
    vapiTranscript: [
      { speaker: "Agent (AI)", text: "Hi, I was looking to connect with David Chen in Customer Success. Is he currently active with the team?" },
      { speaker: "Office Operator", text: "Yes, David Chen is our Director of Client Success. One moment, let me transfer you." },
      { speaker: "Agent (AI)", text: "Great, thank you! I just wanted to verify he's still running client success operations before sending the package." },
      { speaker: "Office Operator", text: "Yes, that is his current title. He is in the office today." }
    ]
  },
  {
    id: 103,
    campaignId: 1,
    name: "Marcus Aurelius",
    title: "Head of Fleet Operations & Logistics",
    company: "Rome Logistics",
    email: "marcus@romelogistics.com",
    phone: "+1 (555) 018-8812",
    linkedin: "linkedin.com/in/maurelius-rome",
    size: 45,
    industry: "B2B Supply Chain",
    techStack: ["HubSpot"],
    status: "Review Required",
    fitScore: 74,
    bio: "Managing raw materials sourcing, partner relationships, and local delivery fleets.",
    website: "Rome Logistics provides inventory management tracking and warehousing tools for distributors.",
    smtpLog: "HELO leadflow-verify.com\n250 leadflow-verify.com HELO approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 Sender OK\nRCPT TO: <marcus@romelogistics.com>\n250 Accepted (Warning: Catch-All domain detected. Domain romelogistics.com accepts all email entries.)",
    vapiStatus: "Exception Flagged",
    vapiTranscript: [
      { speaker: "Agent (AI)", text: "Hi, I'm calling to verify if Marcus Aurelius is still the Head of Client Success?" },
      { speaker: "Office Operator", text: "No, Marcus handles our fleet logistics and warehouse operations. We don't have a Client Success desk." },
      { speaker: "Agent (AI)", text: "Understood. Does he deal with client onboarding or customer relationship strategies?" },
      { speaker: "Office Operator", text: "No, he just deals with the delivery trucks and vendor supplies." }
    ]
  },
  {
    id: 104,
    campaignId: 1,
    name: "Jessica Alba",
    title: "Marketing Operations Manager",
    company: "The Honest Co.",
    email: "jessica.alba@honest.com",
    phone: "+1 (555) 012-3456",
    linkedin: "linkedin.com/in/jalba-honest",
    size: 120,
    industry: "D2C Personal Care",
    techStack: ["Stripe"],
    status: "Review Required",
    fitScore: 81,
    bio: "Handling email campaigns, CRM administration, and onboarding marketing flows.",
    website: "The Honest Company manufactures organic, baby, and personal care products sold direct to consumer.",
    smtpLog: "HELO leadflow-verify.com\n250 leadflow-verify.com HELO approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 Sender OK\nRCPT TO: <jessica.alba@honest.com>\n250 Recipient OK",
    vapiStatus: "Pending Call",
    vapiTranscript: []
  },
  {
    id: 105,
    campaignId: 1,
    name: "Thomas Brady",
    title: "Support Assistant to VP of CX",
    company: "Patriots Retail",
    email: "t.brady@patriotsretail.com",
    phone: "+1 (555) 011-1212",
    linkedin: "linkedin.com/in/tbrady-patriots",
    size: 60,
    industry: "Sports Merchandising",
    techStack: ["HubSpot"],
    status: "Disqualified",
    fitScore: 40,
    bio: "Coordinating schedules, meetings, and filing support reports for the customer experience team.",
    website: "Patriots Retail is an online distributor of sports equipment and athletic wear.",
    smtpLog: "HELO leadflow-verify.com\n250 leadflow-verify.com HELO approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 Sender OK\nRCPT TO: <t.brady@patriotsretail.com>\n550 Invalid recipient (Mailbox does not exist)",
    vapiStatus: "Skipped (Disqualified by Title Filter)",
    vapiTranscript: null
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Vapi Call Simulator state
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, dialing, connected, finished
  const [callTranscript, setCallTranscript] = useState([]);
  
  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'B2B SaaS',
    geo: 'United States',
    size: '10-100 employees',
    goal: ''
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [generatedTags, setGeneratedTags] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState(1);

  // Dynamic calculations for "after-update" realism
  const totalSourced = 450 + (leads.length - 5);
  const totalVerified = 340 + leads.filter(l => l.status === 'Email Approved' || l.status === 'Phone Verified').length - 2;
  const exceptionsCount = leads.filter(l => l.status === 'Review Required').length;
  const phoneCallsCount = 40 + leads.filter(l => l.vapiStatus === 'Verified').length - 1;

  // Template Mapper State
  const [clientColumns, setClientColumns] = useState(['First Name', 'Last Name', 'Verified Email', 'Contact Number', 'Target Role', 'Match Weight']);
  const [columnMappings, setColumnMappings] = useState({
    'First Name': 'first_name',
    'Last Name': 'last_name',
    'Verified Email': 'business_email',
    'Contact Number': 'direct_phone',
    'Target Role': 'standardized_title',
    'Match Weight': 'fit_score'
  });
  
  // Custom interactive animations
  const simulateAIOptimization = () => {
    if (!newCampaign.goal) return;
    setIsOptimizing(true);
    
    setTimeout(() => {
      setGeneratedTags({
        titles: ["VP of Customer Success", "Director of Client Operations", "Head of Onboarding", "VP of Customer Support"],
        keywords: ["SaaS", "software", "retention", "subscription", "churn"],
        exclusions: ["assistant", "sdr", "helpdesk", "intern", "representative"],
        techStack: ["HubSpot", "Intercom", "Zendesk"]
      });
      setIsOptimizing(false);
    }, 1800);
  };

  const handleSaveCampaign = () => {
    if (!newCampaign.name || !generatedTags) return;
    const newId = campaigns.length + 1;
    const camp = {
      id: newId,
      name: newCampaign.name,
      type: newCampaign.type,
      geo: newCampaign.geo,
      size: newCampaign.size,
      goal: newCampaign.goal,
      titles: generatedTags.titles,
      keywords: generatedTags.keywords,
      exclusions: generatedTags.exclusions,
      techStack: generatedTags.techStack,
      status: "Active",
      sourced: 0,
      verified: 0,
      exceptions: 0
    };
    setCampaigns([...campaigns, camp]);
    setSelectedCampaignId(newId);
    
    // Simulate S2W Sourcing trigger
    setTimeout(() => {
      // Add fake sourced leads for this campaign
      const fakeLeads = [
        {
          id: 201,
          campaignId: newId,
          name: "John Doe",
          title: generatedTags.titles[0],
          company: "SaaSify Inc.",
          email: "john@saasify.co",
          phone: "+1 (555) 019-1111",
          linkedin: "linkedin.com/in/johndoe-saasify",
          size: 55,
          industry: "B2B SaaS",
          techStack: generatedTags.techStack,
          status: "Review Required",
          fitScore: 82,
          bio: "Managing sales operations and customer lifecycle software.",
          website: "SaaSify offers subscription billing platforms for digital agencies.",
          smtpLog: "HELO leadflow-verify.com\n250 Approved\nMAIL FROM: <verify@leadflow-verify.com>\n250 OK\nRCPT TO: <john@saasify.co>\n250 OK (Warning: Catch-All domain)",
          vapiStatus: "Pending Call",
          vapiTranscript: []
        }
      ];
      setLeads([...leads, ...fakeLeads]);
      
      // Update campaign counts
      setCampaigns(prev => prev.map(c => c.id === newId ? { ...c, sourced: 1, exceptions: 1 } : c));
    }, 1200);

    // Reset form
    setNewCampaign({
      name: '',
      type: 'B2B SaaS',
      geo: 'United States',
      size: '10-100 employees',
      goal: ''
    });
    setGeneratedTags(null);
    setActiveTab('leads');
  };

  const handleApproveException = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Email Approved', fitScore: 90 } : l));
    
    // Update campaign counts
    setLeads(currentLeads => {
      const updatedLead = currentLeads.find(l => l.id === leadId);
      if (updatedLead) {
        setCampaigns(prevCamps => prevCamps.map(c => {
          if (c.id === updatedLead.campaignId) {
            return {
              ...c,
              verified: c.verified + 1,
              exceptions: Math.max(0, c.exceptions - 1)
            };
          }
          return c;
        }));
      }
      return currentLeads;
    });

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: 'Email Approved', fitScore: 90 }));
    }
  };

  const handleDiscardException = (leadId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Disqualified', fitScore: 30 } : l));
    
    setLeads(currentLeads => {
      const updatedLead = currentLeads.find(l => l.id === leadId);
      if (updatedLead) {
        setCampaigns(prevCamps => prevCamps.map(c => {
          if (c.id === updatedLead.campaignId) {
            return {
              ...c,
              exceptions: Math.max(0, c.exceptions - 1)
            };
          }
          return c;
        }));
      }
      return currentLeads;
    });

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: 'Disqualified', fitScore: 30 }));
    }
  };

  const startVapiCallSimulation = (lead) => {
    setIsCalling(true);
    setCallStatus('dialing');
    setCallTranscript([]);
    
    const transcripts = [
      { speaker: "LeadFlow Call Agent (AI)", text: "Connecting to Acme main branch..." },
      { speaker: "LeadFlow Call Agent (AI)", text: "Hi, I was looking to confirm if " + lead.name + " is still serving as the " + lead.title + "?" },
      { speaker: "Office Operator", text: "Yes, she handles our CX division. She is currently away from her desk, but I can transfer you to voicemail." },
      { speaker: "LeadFlow Call Agent (AI)", text: "No voicemail needed, just verifying her active role status. Thank you for your help!" },
      { speaker: "Office Operator", text: "You're welcome. Have a nice day." }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step === 0) {
        setCallStatus('dialing');
      } else if (step === 1) {
        setCallStatus('connected');
        setCallTranscript(prev => [...prev, transcripts[0]]);
      } else if (step < transcripts.length + 1) {
        setCallTranscript(prev => [...prev, transcripts[step - 1]]);
      } else {
        clearInterval(interval);
        setCallStatus('finished');
        setIsCalling(false);
        
        // Update lead status
        setLeads(prev => prev.map(l => l.id === lead.id ? { 
          ...l, 
          status: 'Phone Verified', 
          fitScore: 94,
          vapiStatus: 'Verified',
          vapiTranscript: transcripts.slice(1)
        } : l));
        
        // Update campaigns list separately
        setCampaigns(prevCamps => prevCamps.map(c => {
          if (c.id === lead.campaignId) {
            return {
              ...c,
              verified: c.verified + 1,
              exceptions: Math.max(0, c.exceptions - 1)
            };
          }
          return c;
        }));

        // Update selected lead state if it matches the simulated lead
        setSelectedLead(prev => {
          if (prev && prev.id === lead.id) {
            return {
              ...prev,
              status: 'Phone Verified',
              fitScore: 94,
              vapiStatus: 'Verified',
              vapiTranscript: transcripts.slice(1)
            };
          }
          return prev;
        });
      }
      step++;
    }, 1500);
  };

  // Filter leads based on selected campaign and search input
  const filteredLeads = leads.filter(l => {
    const matchesCampaign = l.campaignId === selectedCampaignId;
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCampaign && matchesSearch;
  });

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans text-zinc-200">
      
      {/* ==========================================
          SIDEBAR NAVIGATION
          ========================================== */}
      <aside className="w-64 border-r border-zinc-800/80 bg-zinc-900/50 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 px-6 border-b border-zinc-800/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-600/10 border border-amber-500/20">
              <Target className="w-4.5 h-4.5 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-wide text-zinc-50">LeadFlow</span>
              <span className="text-3xs block text-amber-500/80 font-semibold tracking-widest uppercase">S2W Media Hub</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => { setActiveTab('dashboard'); setSelectedLead(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>S2W Overview</span>
            </button>

            <button 
              onClick={() => { setActiveTab('campaigns'); setSelectedLead(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'campaigns' 
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Campaign Wizard</span>
            </button>

            <button 
              onClick={() => { setActiveTab('leads'); setSelectedLead(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'leads' 
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Leads Ingest</span>
              </div>
              <span className="text-2xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full border border-zinc-700">
                {leads.filter(l => l.status !== 'Disqualified').length}
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('exceptions'); setSelectedLead(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'exceptions' 
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Exceptions Desk</span>
              </div>
              <span className={`text-2xs px-1.5 py-0.5 rounded-full font-bold border ${
                leads.filter(l => l.status === 'Review Required').length > 0 
                  ? 'bg-amber-950 text-amber-400 border-amber-500/20' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}>
                {leads.filter(l => l.status === 'Review Required').length}
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('mapper'); setSelectedLead(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'mapper' 
                  ? 'bg-amber-600/10 text-amber-500 border border-amber-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Template Mapper</span>
            </button>
          </nav>
        </div>

        {/* User Info / Stack Summary */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
              S2
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-300">CS Delivery Team</p>
              <p className="text-3xs text-zinc-500">S2W Media Account</p>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg flex items-center justify-between text-3xs text-zinc-400">
            <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-amber-500" /> Phone Agents</span>
            <span className="text-zinc-300 font-semibold">Vapi Connected</span>
          </div>
        </div>
      </aside>

      {/* ==========================================
          MAIN AREA CONTENT
          ========================================== */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        
        {/* Header */}
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-zinc-900/10">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-semibold text-lg text-zinc-50">
              {activeTab === 'dashboard' && 'S2W Operations Overview'}
              {activeTab === 'campaigns' && 'AI Campaign Creator Wizard'}
              {activeTab === 'leads' && 'AI Contact Discovery & Ingestion'}
              {activeTab === 'exceptions' && 'Exceptions Review Desk (HITL)'}
              {activeTab === 'mapper' && 'Client Delivery Template Mapper'}
            </h1>
            
            {activeTab === 'leads' && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs">
                <span className="text-zinc-500">Active Campaign:</span>
                <select 
                  value={selectedCampaignId} 
                  onChange={(e) => { setSelectedCampaignId(Number(e.target.value)); setSelectedLead(null); }}
                  className="bg-transparent text-zinc-300 focus:outline-none pr-2 font-medium"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-300">{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-3xs text-zinc-500 block font-semibold uppercase tracking-wider">Bounce Safeguard</span>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1 justify-end">
                <Check className="w-3.5 h-3.5" /> &lt;0.58%
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800"></div>
            <div className="text-right">
              <span className="text-3xs text-zinc-500 block font-semibold uppercase tracking-wider">Daily Token Spend</span>
              <span className="text-xs text-zinc-300 font-medium">$1.14 / $10.00 max</span>
            </div>
          </div>
        </header>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-8">

          {/* ==========================================
              TAB A: S2W OVERVIEW (DASHBOARD)
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-4 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-amber-500/2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-display">Total Sourced Cache</p>
                  <h3 className="text-2xl font-display font-extrabold text-zinc-50 tracking-tight flex items-baseline gap-2">
                    {totalSourced}
                    <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/10 flex items-center">+18%</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-2">since last campaign brief</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-emerald-500/2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-display">QA Verified & Ready</p>
                  <h3 className="text-2xl font-display font-extrabold text-zinc-50 tracking-tight flex items-baseline gap-2">
                    {totalVerified}
                    <span className="text-[10px] text-zinc-400 font-medium bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700 flex items-center">{(totalVerified / totalSourced * 100).toFixed(1)}%</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-2">automation success rate</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-amber-500/2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-600/5 rounded-full blur-xl group-hover:bg-amber-600/10 transition-all"></div>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-display">Pending Exceptions</p>
                  <h3 className="text-2xl font-display font-extrabold text-zinc-50 tracking-tight text-amber-500">
                    {exceptionsCount}
                  </h3>
                  <p className="text-[11px] text-amber-500/70 mt-2 font-medium">Requires manual S2W QA sign-off</p>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-purple-500/2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all"></div>
                  <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase mb-1.5 font-display">Phone verification Calls</p>
                  <h3 className="text-2xl font-display font-extrabold text-zinc-50 tracking-tight text-purple-400">
                    {phoneCallsCount}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-2">Executed via Vapi AI Voice</p>
                </div>
              </div>

              {/* Central S2W Campaigns Status Table */}
              <div className="glass-panel rounded-xl overflow-hidden border border-zinc-800/80">
                <div className="p-5 border-b border-zinc-800/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-semibold text-base text-zinc-50">Active S2W Campaign Briefs</h3>
                    <p className="text-xs text-zinc-500">Overview of target specs and discovery stats</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('campaigns')}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] hover:scale-[1.01] shadow-md shadow-amber-600/10 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer font-display"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Setup Brief
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-zinc-900/60 border-b border-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-display">
                        <th className="p-3.5 pl-6">Campaign Brief Name</th>
                        <th className="p-3.5">Target ICP</th>
                        <th className="p-3.5">Geographic bounds</th>
                        <th className="p-3.5 text-center">Sourced</th>
                        <th className="p-3.5 text-center">QA Approved</th>
                        <th className="p-3.5 text-center">Exceptions</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/60">
                      {campaigns.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-800/20 transition-all">
                          <td className="p-3.5 pl-6 font-semibold text-zinc-100">{c.name}</td>
                          <td className="p-3.5">
                            <span className="text-[11px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                              {c.type} • {c.size}
                            </span>
                          </td>
                          <td className="p-3.5 text-zinc-400">{c.geo}</td>
                          <td className="p-3.5 text-center font-medium">{c.sourced}</td>
                          <td className="p-3.5 text-center text-emerald-500 font-semibold">{c.verified}</td>
                          <td className="p-3.5 text-center text-amber-500 font-semibold">{c.exceptions}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-3xs font-semibold px-2 py-0.5 rounded-full border ${
                              c.status === 'Active' 
                                ? 'bg-emerald-950/50 text-emerald-500 border-emerald-500/20' 
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></span>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB B: AI CAMPAIGN CREATOR (CAMPAIGNS)
              ========================================== */}
          {activeTab === 'campaigns' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-1.5 mb-8">
                <h2 className="text-2xl font-display font-bold tracking-tight text-zinc-50">S2W Campaign Brief Setup</h2>
                <p className="text-xs text-zinc-400 max-w-xl mx-auto">
                  Define your customer profile. Our AI optimization step will suggest granular target parameters to guide our discovery scanners.
                </p>
              </div>

              <div className="glass-panel p-6 rounded-xl space-y-5 border border-zinc-800/80 bg-zinc-900/5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block font-display">Brief Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Vercel VP Engineering Campaign" 
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block font-display">Target Industry Type</label>
                    <select 
                      value={newCampaign.type}
                      onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                      className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-zinc-300 focus:outline-none"
                    >
                      <option className="bg-zinc-900">B2B SaaS</option>
                      <option className="bg-zinc-900">Enterprise Logistics</option>
                      <option className="bg-zinc-900">D2C E-commerce</option>
                      <option className="bg-zinc-900">Local Agencies</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block font-display">Target Geography</label>
                    <input 
                      type="text" 
                      placeholder="e.g. United States, United Kingdom" 
                      value={newCampaign.geo}
                      onChange={(e) => setNewCampaign({ ...newCampaign, geo: e.target.value })}
                      className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block font-display">Company Size (Headcount)</label>
                    <select 
                      value={newCampaign.size}
                      onChange={(e) => setNewCampaign({ ...newCampaign, size: e.target.value })}
                      className="w-full glass-input px-3.5 py-2 rounded-lg text-xs text-zinc-300 focus:outline-none"
                    >
                      <option className="bg-zinc-900">10-100 employees</option>
                      <option className="bg-zinc-900">50-200 employees</option>
                      <option className="bg-zinc-900">200-1000 employees</option>
                      <option className="bg-zinc-900">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block font-display">Campaign Target Persona & Goal (Description)</label>
                  <textarea 
                    rows="3"
                    placeholder="e.g. We want to target VP level customer success stakeholders at B2B tech organizations using Intercom to pitch our integration widgets."
                    value={newCampaign.goal}
                    onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                    className="w-full glass-input p-3.5 rounded-lg text-xs text-zinc-200 focus:outline-none"
                  ></textarea>
                </div>

                {/* AI Tag Generation Wizard */}
                <div className="pt-1.5">
                  {!generatedTags ? (
                    <button 
                      onClick={simulateAIOptimization}
                      disabled={isOptimizing || !newCampaign.goal}
                      className="w-full flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 active:scale-[0.98] hover:scale-[1.005] shadow-md shadow-amber-600/10 disabled:opacity-50 text-zinc-950 font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer font-display"
                    >
                      {isOptimizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Analyzing Persona Rules...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 fill-zinc-950 stroke-none" />
                          <span>Generate Targeting Tags with AI</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-6 border-t border-zinc-800/80 pt-6 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-semibold text-sm text-zinc-50 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> S2W AI Suggested Tags (Review & Adjust)
                        </h4>
                        <span className="text-3xs bg-amber-600/10 text-amber-500 px-2 py-0.5 border border-amber-500/20 rounded font-semibold tracking-wider uppercase">AI Optimized</span>
                      </div>

                      {/* Tag Groups */}
                      <div className="space-y-4">
                        <div>
                          <span className="text-3xs text-zinc-500 font-semibold uppercase block mb-1.5">Target Titles</span>
                          <div className="flex flex-wrap gap-1.5">
                            {generatedTags.titles.map((t, idx) => (
                              <span key={idx} className="text-2xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300 flex items-center gap-1.5">
                                {t}
                                <X 
                                  className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-pointer" 
                                  onClick={() => setGeneratedTags({
                                    ...generatedTags,
                                    titles: generatedTags.titles.filter(x => x !== t)
                                  })}
                                />
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-3xs text-zinc-500 font-semibold uppercase block mb-1.5">ICP Match Keywords</span>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedTags.keywords.map((kw, idx) => (
                                <span key={idx} className="text-2xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300 flex items-center gap-1.5">
                                  {kw}
                                  <X 
                                    className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-pointer" 
                                    onClick={() => setGeneratedTags({
                                      ...generatedTags,
                                      keywords: generatedTags.keywords.filter(x => x !== kw)
                                    })}
                                  />
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-3xs text-zinc-500 font-semibold uppercase block mb-1.5">Exclusion Blacklist</span>
                            <div className="flex flex-wrap gap-1.5">
                              {generatedTags.exclusions.map((ex, idx) => (
                                <span key={idx} className="text-2xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300 flex items-center gap-1.5">
                                  {ex}
                                  <X 
                                    className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-pointer" 
                                    onClick={() => setGeneratedTags({
                                      ...generatedTags,
                                      exclusions: generatedTags.exclusions.filter(x => x !== ex)
                                    })}
                                  />
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-3xs text-zinc-500 font-semibold uppercase block mb-1.5">Required Tech Stack (Apollo Filters)</span>
                          <div className="flex flex-wrap gap-1.5">
                            {generatedTags.techStack.map((tech, idx) => (
                              <span key={idx} className="text-2xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-300 flex items-center gap-1.5">
                                {tech}
                                <X 
                                  className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-pointer" 
                                  onClick={() => setGeneratedTags({
                                    ...generatedTags,
                                    techStack: generatedTags.techStack.filter(x => x !== tech)
                                  })}
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action save */}
                      <button 
                        onClick={handleSaveCampaign}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold py-3 rounded-xl transition-all"
                      >
                        <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                        <span>Launch S2W Discovery Campaign</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB C: LEADS INGEST (LEADS)
              ========================================== */}
          {activeTab === 'leads' && (
            <div className="animate-fade-in">
              {/* Leads Table taking full width */}
              <div className="glass-panel rounded-xl overflow-hidden border border-zinc-800/80">
                {/* Search / Filters Bar */}
                <div className="p-4 border-b border-zinc-800/50 flex gap-4 bg-zinc-900/20">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      placeholder="Search leads by name, company, or title..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 px-10 py-2 rounded-lg text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10"
                    />
                  </div>
                </div>

                {/* Leads Data Table */}
                <div className="overflow-y-auto max-h-[500px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-900/40 border-b border-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-display">
                        <th className="p-3.5 pl-6">Contact Name</th>
                        <th className="p-3.5">Title / Company</th>
                        <th className="p-3.5">Contact Channels</th>
                        <th className="p-3.5 text-center">Fit Score</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850/60">
                      {filteredLeads.map(l => (
                        <tr 
                          key={l.id} 
                          onClick={() => setSelectedLead(l)}
                          className={`hover:bg-zinc-800/20 transition-all cursor-pointer ${
                            selectedLead && selectedLead.id === l.id ? 'bg-zinc-850/30 border-l-2 border-amber-500' : ''
                          }`}
                        >
                          <td className="p-3.5 pl-6 font-semibold text-zinc-200">{l.name}</td>
                          <td className="p-3.5">
                            <p className="text-zinc-350 font-semibold">{l.title}</p>
                            <p className="text-3xs text-zinc-500">{l.company}</p>
                          </td>
                          <td className="p-3.5 space-y-1">
                            <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-3xs"><Mail className="w-3 h-3 text-zinc-505" /> {l.email || 'None'}</span>
                            <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-3xs"><Phone className="w-3 h-3 text-zinc-505" /> {l.phone || 'None'}</span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`inline-block font-bold px-2 py-0.5 rounded font-mono ${
                              l.fitScore >= 85 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/10' : 'bg-amber-950 text-amber-400 border border-amber-500/10'
                            }`}>
                              {l.fitScore}%
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-3xs font-semibold ${
                              l.status === 'Email Approved' || l.status === 'Phone Verified'
                                ? 'bg-emerald-950/60 text-emerald-500 border-emerald-500/20'
                                : l.status === 'Review Required'
                                ? 'bg-amber-950/60 text-amber-500 border-amber-500/20 animate-pulse-border'
                                : 'bg-zinc-855 text-zinc-500 border-zinc-700'
                            }`}>
                              {l.status === 'Phone Verified' && <Phone className="w-2.5 h-2.5" />}
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-zinc-500">No leads match search terms for this campaign.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB D: EXCEPTIONS DESK (EXCEPTIONS)
              ========================================== */}
          {activeTab === 'exceptions' && (
            <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-zinc-50">S2W Exception Validation Stack</h3>
                  <p className="text-xs text-zinc-500">Leads requiring manual validation due to ambiguous titles or Catch-All domains</p>
                </div>
                <span className="text-2xs bg-amber-600/10 text-amber-500 px-3 py-1 border border-amber-500/20 rounded-full font-semibold">
                  {leads.filter(l => l.status === 'Review Required').length} Pending
                </span>
              </div>

              {/* Exception Cards Grid */}
              <div className="grid grid-cols-2 gap-6">
                {leads.filter(l => l.status === 'Review Required').map(lead => (
                  <div 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className="glass-panel rounded-xl p-6 border border-zinc-800/80 hover:border-zinc-750 hover:shadow-lg hover:shadow-amber-500/2 transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-amber-500/2 rounded-full blur-xl group-hover:bg-amber-500/5 transition-all"></div>
                    <div className="space-y-4">
                      {/* Lead Title Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-bold text-sm text-zinc-50">{lead.name}</h4>
                          <p className="text-xs text-zinc-400 font-medium">{lead.title}</p>
                          <p className="text-3xs text-amber-500 font-semibold">{lead.company} • {lead.industry}</p>
                        </div>
                        <span className="text-3xs font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                          {lead.fitScore}% Match
                        </span>
                      </div>

                      {/* Exception Flag Reason */}
                      <div className="bg-zinc-950/80 border border-zinc-900 p-3 rounded-lg flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-3xs font-semibold text-zinc-300">Validation Exception Warning:</p>
                          <p className="text-3xs text-zinc-500 leading-relaxed mt-0.5">
                            {lead.smtpLog.includes("Catch-All") 
                              ? "Catch-All email server detected. Email exists on paper, but mailbox needs direct role/phone checks." 
                              : "Title contains logistics/operations rather than customer success. Borderline fit evaluation."}
                          </p>
                        </div>
                      </div>

                      {/* Inline Editable Inputs */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-3xs text-zinc-500 uppercase font-semibold">Title</label>
                          <input 
                            type="text" 
                            value={lead.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, title: val } : l));
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 px-2 py-1 rounded text-3xs text-zinc-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-3xs text-zinc-500 uppercase font-semibold">Verify Email</label>
                          <input 
                            type="text" 
                            value={lead.email}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, email: val } : l));
                            }}
                            className="w-full bg-zinc-950 border border-zinc-900 px-2 py-1 rounded text-3xs text-zinc-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Approval actions */}
                    <div className="flex gap-2 pt-4 border-t border-zinc-900" onClick={(e) => e.stopPropagation()}>
                      {lead.vapiStatus === 'Pending Call' ? (
                        <button 
                          onClick={() => { setSelectedLead(lead); startVapiCallSimulation(lead); }}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/20 text-3xs font-bold py-2 rounded-lg transition-all cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call to Verify
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApproveException(lead.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-3xs font-bold py-2 rounded-lg transition-all"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Approve Lead
                        </button>
                      )}
                      <button 
                        onClick={() => handleDiscardException(lead.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800 text-3xs font-semibold py-2 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Disqualify
                      </button>
                    </div>
                  </div>
                ))}

                {leads.filter(l => l.status === 'Review Required').length === 0 && (
                  <div className="col-span-2 glass-panel p-12 text-center text-zinc-500 rounded-2xl">
                    <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-zinc-300">All exceptions cleared!</p>
                    <p className="text-xs text-zinc-500 mt-1">S2W QA queue is 100% caught up. All validated leads are ready for CS delivery.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB E: TEMPLATE MAPPER (MAPPER)
              ========================================== */}
          {activeTab === 'mapper' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-zinc-50">S2W Client Sheet Integration</h3>
                  <p className="text-xs text-zinc-500">Map LeadFlow database columns to target client spreadsheet columns to skip copying</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Import Client Template
                  </button>
                </div>
              </div>

              {/* Column Mapping Fields */}
              <div className="glass-panel p-8 rounded-2xl space-y-6">
                <h4 className="font-display font-semibold text-sm text-zinc-50 pb-2 border-b border-zinc-800/50">Field Mapping Matrix</h4>
                
                <div className="space-y-4">
                  {clientColumns.map((col, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-6 items-center bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                        <span className="w-5 h-5 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-3xs text-zinc-500">{idx+1}</span>
                        {col}
                      </div>
                      
                      <div className="flex justify-center text-zinc-600">
                        <ArrowRight className="w-4 h-4" />
                      </div>

                      <div>
                        <select 
                          value={columnMappings[col]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setColumnMappings({ ...columnMappings, [col]: val });
                          }}
                          className="w-full glass-input px-3 py-1.5 rounded-lg text-xs text-zinc-300 focus:outline-none"
                        >
                          <option value="first_name">LeadFlow: First Name</option>
                          <option value="last_name">LeadFlow: Last Name</option>
                          <option value="business_email">LeadFlow: Verified Email</option>
                          <option value="direct_phone">LeadFlow: Phone Number</option>
                          <option value="standardized_title">LeadFlow: Standardized Job Title</option>
                          <option value="fit_score">LeadFlow: Fit Percentage</option>
                          <option value="company_name">LeadFlow: Company Name</option>
                          <option value="linkedin_url">LeadFlow: LinkedIn Profile</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Export Trigger */}
                <div className="pt-4 flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-xs font-bold text-zinc-400">Export Ready Dataset</p>
                    <p className="text-3xs text-zinc-500">Includes {leads.filter(l => l.status === 'Email Approved' || l.status === 'Phone Verified').length} QA approved contacts for campaign</p>
                  </div>

                  <button 
                    onClick={() => alert("S2W Client Delivery Sheet Exported Successfully! 98 Leads formatted into template columns.")}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export S2W Delivery Template
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==========================================
          SLIDE-OUT LEAD DETAILS DRAWER OVERLAY
          ========================================== */}
      {selectedLead && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="w-[460px] h-full bg-zinc-950/98 border-l border-zinc-800 shadow-2xl p-6 overflow-y-auto relative animate-slide-left flex flex-col justify-between scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Body Container */}
            <div className="space-y-6">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-300 p-1.5 hover:bg-zinc-900 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="border-b border-zinc-800/50 pb-4 pr-8">
                <h3 className="font-display font-bold text-lg text-zinc-50 tracking-tight">{selectedLead.name}</h3>
                <p className="text-xs text-zinc-400 font-medium">{selectedLead.title}</p>
                <p className="text-xs text-amber-500 font-semibold mt-0.5">{selectedLead.company}</p>
              </div>

              {/* Grid Metadata Section */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-display block mb-0.5">Industry</span>
                  <span className="text-xs text-zinc-300 font-medium">{selectedLead.industry}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-display block mb-0.5">Company Size</span>
                  <span className="text-xs text-zinc-300 font-medium">{selectedLead.size} staff</span>
                </div>
                <div className="col-span-2 border-t border-zinc-900 pt-3">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-display block mb-1.5">Tech Stack Match</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.techStack.map((tech, idx) => (
                      <span key={idx} className="text-3xs bg-zinc-900/80 text-zinc-400 px-2 py-0.5 border border-zinc-800 rounded font-semibold">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Fit Analysis */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-display block">AI Fit Analysis</span>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/10 border border-zinc-900/50 p-3.5 rounded-xl">
                  {selectedLead.bio}
                </p>
              </div>

              {/* Website Scraped Content */}
              <div className="space-y-1.5 bg-zinc-900/10 border border-zinc-900/50 p-3.5 rounded-xl">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider font-display flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-zinc-400" /> Scraped Website Summary</span>
                <p className="text-xs text-zinc-400 leading-relaxed italic">{selectedLead.website}</p>
              </div>

              {/* Verification Pipeline Console */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-display border-b border-zinc-900 pb-2">Verification Pipeline Logs</h4>
                
                {/* SMTP log */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-3xs font-semibold text-zinc-400"><Mail className="w-3.5 h-3.5 text-zinc-500" /> Port 25 SMTP Handshake</div>
                  <pre className="text-3xs font-mono bg-zinc-950 border border-zinc-900 p-3 rounded-xl max-h-28 overflow-y-auto text-zinc-500 leading-normal scrollbar-none">
                    {selectedLead.smtpLog}
                  </pre>
                </div>

                {/* Vapi Call console */}
                <div className="space-y-2 border-t border-zinc-900 pt-3">
                  <div className="flex justify-between items-center text-3xs font-semibold text-zinc-400">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-zinc-500" /> AI Phone Call Qualification</span>
                    <span className={`px-2 py-0.5 rounded border text-3xs ${
                      selectedLead.vapiStatus === 'Verified' 
                        ? 'bg-emerald-950 text-emerald-500 border-emerald-500/20' 
                        : selectedLead.vapiStatus === 'Pending Call' || selectedLead.vapiStatus === 'Exception Flagged'
                        ? 'bg-amber-950 text-amber-500 border-amber-500/20 animate-pulse-border' 
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}>
                      {selectedLead.vapiStatus}
                    </span>
                  </div>

                  {/* Call action / Player */}
                  {selectedLead.vapiStatus === 'Pending Call' && !isCalling && (
                    <button 
                      onClick={() => startVapiCallSimulation(selectedLead)}
                      className="w-full flex items-center justify-center gap-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 border border-amber-500/20 font-bold py-2 rounded-lg text-2xs transition-all cursor-pointer font-display"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-500 stroke-none" /> Trigger Automated Vapi Call
                    </button>
                  )}

                  {/* Simulation logs */}
                  {isCalling && selectedLead.vapiStatus === 'Pending Call' && (
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 space-y-2.5 font-mono text-3xs">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" /> State: {callStatus.toUpperCase()}</span>
                        <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping"></span>
                      </div>
                      <div className="max-h-24 overflow-y-auto space-y-2 pr-2 scrollbar-none">
                        {callTranscript.map((t, idx) => (
                          <p key={idx} className={t.speaker.startsWith('Agent') ? 'text-amber-500' : 'text-zinc-400'}>
                            <strong>{t.speaker}:</strong> {t.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Realized Log */}
                  {selectedLead.vapiTranscript && selectedLead.vapiTranscript.length > 0 && !isCalling && (
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 space-y-2 font-mono text-3xs max-h-32 overflow-y-auto scrollbar-none">
                      {selectedLead.vapiTranscript.map((t, idx) => (
                        <p key={idx} className={t.speaker.startsWith('Agent') ? 'text-amber-500' : 'text-zinc-400'}>
                          <strong>{t.speaker}:</strong> {t.text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Override Action Footer */}
            {selectedLead.status === 'Review Required' && (
              <div className="flex gap-3 pt-4 border-t border-zinc-900 mt-6 bg-zinc-950 sticky bottom-0" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => handleApproveException(selectedLead.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-2xs font-bold py-2.5 rounded-lg transition-all cursor-pointer font-display"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Approve Fit
                </button>
                <button 
                  onClick={() => handleDiscardException(selectedLead.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800 text-2xs font-semibold py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Disqualify
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
