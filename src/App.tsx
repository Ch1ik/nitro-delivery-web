import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminOverviewPage from './pages/AdminOverviewPage';
import AdminManagementPage from './pages/AdminManagementPage';
import DeliveryListPage from './pages/DeliveryListPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import CreateDeliveryModal from './components/CreateDeliveryModal';
import Notifications, { NotificationService } from './components/Notifications';

const AppContent: React.FC = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const [notifications, setNotifications] = React.useState([]);

  // Initialize notification service
  React.useEffect(() => {
    NotificationService.getInstance().requestBrowserPermission();
    
    const unsubscribe = NotificationService.getInstance().subscribe(setNotifications);
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto animate-pulse">
            <span className="text-white font-black text-3xl italic">N</span>
          </div>
          <p className="text-gray-400 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div className="flex flex-col lg:flex-row min-h-screen">
                <div className="hidden lg:block"><Sidebar /></div>
                <div className="flex-1 flex flex-col min-h-screen">
                  <Header notifications={notifications} />
                  <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-4 lg:mt-20 pb-32 lg:pb-8">
                    <Routes>
                      {userRole === 'business' && (
                        <>
                          <Route path="/dashboard" element={<BusinessDashboard />} />
                          <Route path="/deliveries" element={<DeliveryListPage />} />
                        </>
                      )}
                      {userRole === 'admin' && (
                        <>
                          <Route path="/admin/dashboard" element={<AdminOverviewPage />} />
                          <Route path="/admin/deliveries" element={<DeliveryListPage isAdminView />} />
                          <Route path="/admin/management" element={<AdminManagementPage />} />
                          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />
                        </>
                      )}
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </main>
                  <MobileNav />
                  {userRole === 'business' && <CreateDeliveryModal />}
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  </Router>
);

export default App;
