import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { PersonaBanner } from './components/PersonaBanner';
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
import { MobileNav } from './components/MobileNav';
import { TransactionOrder, B2BContract } from './types';

const MainApp: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  const [selectedOrder, setSelectedOrder] = useState<TransactionOrder | null>(null);
  const [selectedContract, setSelectedContract] = useState<B2BContract | null>(null);
  const [showAssistedRegister, setShowAssistedRegister] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Navbar 
        onOpenAssistedRegister={() => setShowAssistedRegister(true)}
        onOpenNotifications={() => setShowNotifications(true)}
      />

      {/* Role / Persona Banner */}
      <PersonaBanner />

      {/* Main View Router */}
      <main>
        {activeTab === 'market_corn' && <MarketplaceCorn />}
        {activeTab === 'market_eggs' && <MarketplaceEggs />}
        
        {activeTab === 'dashboard_farmer' && (
          <FarmerDashboard onSelectOrder={setSelectedOrder} />
        )}
        
        {activeTab === 'dashboard_egg_farmer' && (
          <EggFarmerDashboard 
            onSelectOrder={setSelectedOrder} 
            onSelectContract={setSelectedContract} 
          />
        )}
        
        {activeTab === 'dashboard_umkm' && (
          <UMKMDashboard 
            onSelectOrder={setSelectedOrder} 
            onSelectContract={setSelectedContract} 
          />
        )}

        {activeTab === 'contracts' && (
          <B2BContractsView onSelectContract={setSelectedContract} />
        )}

        {activeTab === 'history' && (
          <TransactionHistoryView onSelectOrder={setSelectedOrder} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onSelectOrder={setSelectedOrder} />
        )}
      </main>

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

      {/* Fixed Mobile Navigation */}
      <MobileNav onOpenNotifications={() => setShowNotifications(true)} />
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
