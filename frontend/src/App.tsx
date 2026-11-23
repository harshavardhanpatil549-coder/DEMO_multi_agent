import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubmitComplaint } from './pages/student/SubmitComplaint';
import { MyComplaints } from './pages/student/MyComplaints';
import { TrackComplaint } from './pages/student/TrackComplaint';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllComplaints } from './pages/admin/AllComplaints';
import { CommandCenter } from './pages/admin/CommandCenter';
import { AgentLogs } from './pages/admin/AgentLogs';
import { DepartmentManagement } from './pages/admin/DepartmentManagement';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { KnowledgeBasePage } from './pages/admin/KnowledgeBasePage';
import { UserManagement } from './pages/admin/UserManagement';
import { SettingsPage } from './pages/admin/SettingsPage';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedTickets } from './pages/staff/AssignedTickets';
import { CompletedTasks } from './pages/staff/CompletedTasks';
import { StaffProfile } from './pages/staff/StaffProfile';

const AppContent: React.FC = () => {
  const { currentRole, switchRole } = useAuth();
  const { activeToast, clearToast } = useSystem();

  const [activePortal, setActivePortal] = useState<'public' | 'student' | 'staff' | 'admin'>('public');
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [navParams, setNavParams] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setNavParams(params);

    // Auto-detect portal based on page
    if (['student-dashboard', 'submit-complaint', 'my-complaints', 'track-complaint', 'student-notifications', 'student-profile'].includes(page)) {
      setActivePortal('student');
    } else if (['admin-dashboard', 'all-complaints', 'command-center', 'agent-logs', 'departments', 'analytics', 'knowledge-base', 'user-management', 'settings'].includes(page)) {
      setActivePortal('admin');
    } else if (['staff-dashboard', 'assigned-tickets', 'completed-tasks', 'staff-profile'].includes(page)) {
      setActivePortal('staff');
    } else if (['landing', 'about', 'how-it-works', 'login'].includes(page)) {
      setActivePortal('public');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePortal = (portal: 'public' | 'student' | 'staff' | 'admin') => {
    setActivePortal(portal);
    if (portal === 'student') {
      switchRole('student');
      setCurrentPage('student-dashboard');
    } else if (portal === 'staff') {
      switchRole('staff');
      setCurrentPage('staff-dashboard');
    } else if (portal === 'admin') {
      switchRole('admin');
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'landing': return 'CampusFix AI Platform';
      case 'about': return 'About CampusFix AI';
      case 'how-it-works': return 'How It Works';
      case 'login': return 'Demo Role & Persona Selection';
      case 'student-dashboard': return 'Student Maintenance Hub';
      case 'submit-complaint': return 'Report a Campus Issue';
      case 'my-complaints': return 'My Complaints';
      case 'track-complaint': return 'Track Complaint Progress';
      case 'student-profile': return 'Student Profile';
      case 'student-notifications': return 'Notifications';
      case 'admin-dashboard': return 'Facilities Director Console';
      case 'all-complaints': return 'Maintenance Work Order Management';
      case 'command-center': return 'AI Agent Command Center';
      case 'agent-logs': return 'Agent Execution Logs';
      case 'departments': return 'Campus Maintenance Divisions';
      case 'analytics': return 'Operations Analytics & Reports';
      case 'knowledge-base': return 'Maintenance Standard Protocols';
      case 'user-management': return 'Campus User Directory';
      case 'settings': return 'System Settings & Verifications';
      case 'staff-dashboard': return 'Field Technician Dashboard';
      case 'assigned-tickets': return 'Active Work Orders Queue';
      case 'completed-tasks': return 'Completed Tasks History';
      case 'staff-profile': return 'Staff Profile';
      default: return 'CampusFix AI';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      // Public
      case 'landing':
        return (
          <LandingPage 
            onNavigate={handleNavigate} 
            onOpenLiveWorkflow={(wfId) => {
              setActiveWorkflowId(wfId);
              setActivePortal('admin');
              setCurrentPage('command-center');
            }} 
          />
        );
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;

      // Student
      case 'student-dashboard':
        return <StudentDashboard onNavigate={handleNavigate} onSelectComplaint={(id) => handleNavigate('track-complaint', { ticketId: id })} />;
      case 'submit-complaint':
        return <SubmitComplaint onNavigate={handleNavigate} onOpenLiveWorkflow={(wfId) => setActiveWorkflowId(wfId)} />;
      case 'my-complaints':
        return <MyComplaints onNavigate={handleNavigate} onSelectComplaint={(id) => handleNavigate('track-complaint', { ticketId: id })} />;
      case 'track-complaint':
        return <TrackComplaint initialTicketId={navParams?.ticketId} onNavigate={handleNavigate} />;
      case 'student-profile':
        return <StudentProfile />;
      case 'student-notifications':
        return <StudentNotifications onNavigate={handleNavigate} />;

      // Admin
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'all-complaints':
        return <AllComplaints initialTicketId={navParams?.ticketId} onNavigate={handleNavigate} />;
      case 'command-center':
        return <CommandCenter onNavigate={handleNavigate} activeWorkflowId={activeWorkflowId} />;
      case 'agent-logs':
        return <AgentLogs />;
      case 'departments':
        return <DepartmentManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'knowledge-base':
        return <KnowledgeBasePage />;
      case 'user-management':
        return <UserManagement />;
      case 'settings':
        return <SettingsPage />;

      // Staff
      case 'staff-dashboard':
        return <StaffDashboard onNavigate={handleNavigate} />;
      case 'assigned-tickets':
        return <AssignedTickets initialTicketId={navParams?.ticketId} onNavigate={handleNavigate} />;
      case 'completed-tasks':
        return <CompletedTasks />;
      case 'staff-profile':
        return <StaffProfile />;

      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePortal={activePortal}
        onChangePortal={handleChangePortal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navigation Bar with Portal Divisions */}
        <Navbar
          pageTitle={getPageTitle()}
          onOpenMobileMenu={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          onOpenLiveWorkflow={(wfId) => {
            setActiveWorkflowId(wfId);
            setActivePortal('admin');
            handleNavigate('command-center');
          }}
          activePortal={activePortal}
          onChangePortal={handleChangePortal}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>

        {/* Global Toast Notification */}
        {activeToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <span>{activeToast}</span>
            <button onClick={clearToast} className="text-slate-400 hover:text-white ml-2">
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SystemProvider>
        <AppContent />
      </SystemProvider>
    </AuthProvider>
  );
}
