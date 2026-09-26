import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { TermsModal } from './components/TermsModal';
import { MarketplaceCorn } from './components/MarketplaceCorn';
import { MarketplaceEggs } from './components/MarketplaceEggs';
import { FarmerDashboard } from './components/FarmerDashboard';
import { EggFarmerDashboard } from './components/EggFarmerDashboard';
import { UMKMDashboard } from './components/UMKMDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { B2BContractsView } from './components/B2BContractsView';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { ContractDetailsModal } from './components/ContractDetailsModal';
import { AssistedRegisterModal } from './components/AssistedRegisterModal';
import { NotificationModal } from './components/NotificationModal';
import { TransactionOrder, B2BContract } from './types';

const MainApp: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<TransactionOrder | null>(null);
  const [selectedContract, setSelectedContract] = useState<B2BContract | null>(null);
  const [showAssistedRegister, setShowAssistedRegister] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If not logged in, show the comprehensive B2B Landing Page first
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage 
          onOpenAssistedRegister={() => setShowAssistedRegister(true)} 
        />
        <AssistedRegisterModal 
          isOpen={showAssistedRegister}
          onClose={() => setShowAssistedRegister(false)}
        />
      </>
    );
  }

  const isFarmerRole = currentUser.role === 'CORN_FARMER';
  const isEggFarmerRole = currentUser.role === 'EGG_FARMER';
  const isUMKMRole = currentUser.role === 'UMKM_BUYER';
  const isAdminRole = currentUser.role === 'ADMIN';

  return (
    <div className="app-layout-root">
      {/* Enterprise Left Sidebar */}
      <Sidebar 
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAssistedRegister={() => setShowAssistedRegister(true)}
        onOpenTermsModal={() => setShowTermsModal(true)}
      />

      {/* Main Canvas Area */}
      <div className="app-main-canvas">
        {/* Top Header Bar */}
        <TopHeader 
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onOpenNotifications={() => setShowNotifications(true)}
        />

        {/* View Router */}
        <main style={{ flex: 1, minHeight: 'calc(100vh - 64px)' }}>
          {activeTab === 'market_corn' && <MarketplaceCorn />}
          {activeTab === 'market_eggs' && <MarketplaceEggs />}
          
          {(activeTab === 'dashboard_farmer' || (activeTab === 'dashboard' && isFarmerRole)) && (
            <FarmerDashboard onSelectOrder={setSelectedOrder} />
          )}
          
          {(activeTab === 'dashboard_egg_farmer' || (activeTab === 'dashboard' && isEggFarmerRole)) && (
            <EggFarmerDashboard 
              onSelectOrder={setSelectedOrder} 
              onSelectContract={setSelectedContract} 
            />
          )}
          
          {(activeTab === 'dashboard_umkm' || (activeTab === 'dashboard' && isUMKMRole)) && (
            <UMKMDashboard 
              onSelectOrder={setSelectedOrder} 
              onSelectContract={setSelectedContract} 
            />
          )}

          {(activeTab === 'admin' || (activeTab === 'dashboard' && isAdminRole)) && (
            <AdminDashboard onSelectOrder={setSelectedOrder} />
          )}

          {activeTab === 'contracts' && (
            <B2BContractsView onSelectContract={setSelectedContract} />
          )}

          {activeTab === 'history' && (
            <TransactionHistoryView onSelectOrder={setSelectedOrder} />
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <OrderDetailsModal 
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <ContractDetailsModal 
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
      />

      <AssistedRegisterModal 
        isOpen={showAssistedRegister}
        onClose={() => setShowAssistedRegister(false)}
      />

      <NotificationModal 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
