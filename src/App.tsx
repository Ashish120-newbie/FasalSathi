import { useMemo, useState } from 'react';
import { AppShell, type View } from '@/components/AppShell';
import { AuthScreen } from '@/screens/AuthScreen';
import { DiagnosisScreen } from '@/screens/DiagnosisScreen';
import { ScanScreen } from '@/screens/ScanScreen';
import { CalculatorScreen } from '@/screens/CalculatorScreen';
import { SchemesScreen } from '@/screens/SchemesScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { HelplineScreen } from '@/screens/HelplineScreen';
import { MarketplaceScreen } from '@/screens/MarketplaceScreen';
import { QueueScreen } from '@/screens/QueueScreen';
import { loadScans, seedScans, updateScan } from '@/data/storage';
import { cropName, stageLabel } from '@/data/crops';
import type { ScanRecord, ChatContext } from '@/data/types';
import { useLang } from '@/lib/lang';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

function App() {
  const [view, setView] = useState<View>('home');
  const [scans, setScans] = useState<ScanRecord[]>(() => seedScans());
  const [activeScan, setActiveScan] = useState<ScanRecord | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext | undefined>(undefined);
  const { lang } = useLang();
  const { session, loading } = useAuth();

  const pendingReviews = useMemo(() => scans.filter((scan) => scan.escalated && scan.officerReview?.status === 'pending').length, [scans]);

  function handleResult(scan: ScanRecord) {
    setScans(loadScans());
    setActiveScan(scan);
  }

  function handleEscalate() {
    if (!activeScan) return;
    const updated = { ...activeScan, escalated: true, officerReview: { status: 'pending' as const, officerName: 'Awaiting review' } };
    setScans(updateScan(activeScan.id, updated));
    setActiveScan(updated);
  }

  function handleUpdate(scan: ScanRecord) {
    setScans(updateScan(scan.id, scan));
  }

  function navigate(nextView: View) {
    setActiveScan(null);
    setView(nextView);
  }

  function openChat(context?: ChatContext) {
    setChatContext(context);
    setChatOpen(true);
  }

  function closeChat() {
    setChatOpen(false);
  }

  function buildChatContextFromScan(scan: ScanRecord): ChatContext {
    return {
      cropType: cropName(scan.cropId, lang),
      growthStage: stageLabel(scan.growthStage, lang),
      diagnosis: scan.result.diseaseName,
      confidence: scan.result.confidence,
      confidenceLevel: scan.result.level,
      recommendation: scan.result.recommendation,
      source: scan.result.source,
    };
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 size={32} className="animate-spin text-forest-500" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const screen = activeScan
    ? <DiagnosisScreen scan={activeScan} onBack={() => setActiveScan(null)} onEscalate={handleEscalate} onAskAI={() => openChat(buildChatContextFromScan(activeScan))} />
    : view === 'home' ? <ScanScreen onResult={handleResult} /> : view === 'calculator' ? <CalculatorScreen /> : view === 'schemes' ? <SchemesScreen /> : view === 'history' ? <HistoryScreen scans={scans} onOpen={setActiveScan} /> : view === 'helpline' ? <HelplineScreen /> : view === 'marketplace' ? <MarketplaceScreen /> : <QueueScreen scans={scans} onBack={() => navigate('home')} onUpdate={handleUpdate} />;

  return <AppShell activeView={view} onNavigate={navigate} pendingReviews={pendingReviews} chatContext={chatContext} chatOpen={chatOpen} onOpenChat={openChat} onCloseChat={closeChat}>{screen}</AppShell>;
}

export default App;
