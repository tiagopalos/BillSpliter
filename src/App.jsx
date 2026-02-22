
import { useAppLogic } from './hooks/useAppLogic.js'
import { BillDetail, Summary, People, PerPerson, ConfirmModal, ExpenseChart, Header, MostExpensive, ToastContainer } from './Components'

import './App.css'

export default function App() {
  const {
    // State
    billItems,
    people,
    selectedCurrency,
    toasts,
    showClearModal,
    mostExpensiveItem,
    // Set vaule 
    setSelectedCurrency,
    setPeople,
    setShowClearModal,
    // Actions
    handleAddItemWithToast,
    handleRemoveItem,
    handleClearAllWithToast,
    undo,
    redo,
    canUndo,
    canRedo,
    removeToast,
    showToast
  } = useAppLogic();

  return (
    <div className="app-container" >
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmModal 
        isOpen={showClearModal}
        title="Clear All Items?"
        message="This will remove all bill items. You can undo this action."
        isDangerous={true}
        onConfirm={handleClearAllWithToast}
        onCancel={() => setShowClearModal(false)}
      />
      
      <Header />

      <main className="main-grid">
        <div className="card">
          <BillDetail 
            onAddItem={handleAddItemWithToast} 
            selectedCurrency={selectedCurrency} 
            setSelectedCurrency={setSelectedCurrency}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <div className="card">
          <People 
            people={people} 
            setPeople={setPeople}
            billItems={billItems}
            onClearAll={() => setShowClearModal(true)}
          />
        </div>

        <div className="card">
          <Summary 
            items={billItems} 
            selectedCurrency={selectedCurrency} 
            numberOfPeople={people.length}
            onRemoveItem={handleRemoveItem}
            showToast={showToast}
          />
        </div>

        <div className="card">
          <PerPerson 
            items={billItems} 
            numberOfPeople={people.length} 
            selectedCurrency={selectedCurrency}
            showToast={showToast}
          />
        </div>

        <div className="card">
          <ExpenseChart items={billItems} selectedCurrency={selectedCurrency} />
        </div>

        <div className="card">
          <MostExpensive 
            mostExpensiveItem={mostExpensiveItem} 
            selectedCurrency={selectedCurrency}
            billItems={billItems}
          />
        </div>
      </main>
    </div>
  )
}
