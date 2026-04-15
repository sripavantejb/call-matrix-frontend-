import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AgentsProvider } from './context/AgentsProvider'
import { AppShell } from './components/layout/AppShell'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/HomePage'
import { CampaignsPage } from './pages/campaigns/CampaignsPage'
import { KnowledgeBasePage } from './pages/knowledge/KnowledgeBasePage'
import { PhoneNumbersPage } from './pages/phone-numbers/PhoneNumbersPage'
import { CallMatrixPage } from './pages/call-matrix/CallMatrixPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminCustomers } from './pages/admin/AdminCustomers'
import { AdminCredentials } from './pages/admin/AdminCredentials'
import { AdminAgents } from './pages/admin/AdminAgents'
import { AdminCampaigns } from './pages/admin/AdminCampaigns'
import { AdminCalls } from './pages/admin/AdminCalls'
import { AdminAnalytics } from './pages/admin/AdminAnalytics'
import { AdminLogs } from './pages/admin/AdminLogs'
import { AdminSettings } from './pages/admin/AdminSettings'
import { UserManagementPage } from './pages/user-management/UserManagementPage'
import { AgentsListPage } from './pages/agents/AgentsListPage'
import { AgentDetailPage } from './pages/agents/AgentDetailPage'
import {
  AdvancedGate,
  AgentWorkspaceGate,
  CallAnalysisGate,
  MemoryGate,
  SipGate,
} from './pages/agents/AgentTabGates'
import { CallSettingsLayout } from './components/agents/call-settings/CallSettingsLayout'
import { InCallLimitsPanel } from './components/agents/call-settings/InCallLimitsPanel'
import { SilenceHandlingPanel } from './components/agents/call-settings/SilenceHandlingPanel'
import { VoiceAudioPanel } from './components/agents/call-settings/VoiceAudioPanel'
import { InterruptionsPanel } from './components/agents/call-settings/InterruptionsPanel'
import { ResponseTimingPanel } from './components/agents/call-settings/ResponseTimingPanel'
import { SupportingLlmPanel } from './components/agents/call-settings/SupportingLlmPanel'
import { CallSettingsIndexRedirect } from './pages/agents/CallSettingsIndexRedirect'

export default function App() {
  return (
    <AgentsProvider>
      <div className="appViewport">
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="credentials" element={<AdminCredentials />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="calls" element={<AdminCalls />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="knowledge" element={<KnowledgeBasePage />} />
              <Route path="conversations" element={<CallMatrixPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="phone-numbers" element={<PhoneNumbersPage />} />
              <Route path="user-management" element={<UserManagementPage />} />
              <Route path="agents" element={<AgentsListPage />} />
              <Route path="agents/:agentId" element={<AgentDetailPage />}>
                <Route index element={<Navigate to="agent" replace />} />
                <Route path="agent" element={<AgentWorkspaceGate />} />
                <Route path="call-settings" element={<CallSettingsLayout />}>
                  <Route index element={<CallSettingsIndexRedirect />} />
                  <Route path="in-call-limits" element={<InCallLimitsPanel />} />
                  <Route
                    path="silence-handling"
                    element={<SilenceHandlingPanel />}
                  />
                  <Route path="voice-audio" element={<VoiceAudioPanel />} />
                  <Route path="interruptions" element={<InterruptionsPanel />} />
                  <Route
                    path="response-timing"
                    element={<ResponseTimingPanel />}
                  />
                  <Route
                    path="supporting-llm"
                    element={<SupportingLlmPanel />}
                  />
                </Route>
                <Route path="advanced" element={<AdvancedGate />} />
                <Route path="call-analysis" element={<CallAnalysisGate />} />
                <Route path="memory" element={<MemoryGate />} />
                <Route path="sip" element={<SipGate />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AgentsProvider>
  )
}
