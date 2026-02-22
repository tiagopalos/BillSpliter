
import { useCallback } from "react";
import {useBillSplitter, useToast, useLocalStorage} from './index.js'
import { getMostExpensiveItem } from "../utils/calculations.js"



export function useAppLogic() {
  // 1. Initialize  hooks
  const { 
    billItems, 
    people, 
    selectedCurrency, 
    setSelectedCurrency, 
    setPeople, 
    handleAddItem,
    handleRemoveItem,
    handleClearAll,
    undo,
    redo,
    canUndo,
    canRedo
  } = useBillSplitter();
  
  const { toasts, showToast, removeToast } = useToast();
  
  const { showClearModal, setShowClearModal } = useLocalStorage();
  
  // 2. Derived State
  const mostExpensiveItem = getMostExpensiveItem(billItems);

  // 3. Wrapped Handlers
  const handleAddItemWithToast = useCallback((item) => {
    handleAddItem(item);
    showToast(`${item.item} added to bill`, 'success');
  }, [handleAddItem, showToast]);

  const handleClearAllWithToast = useCallback(() => {
    handleClearAll();
    showToast('All items cleared', 'info');
  }, [handleClearAll, showToast]);

  // 4. Return everything needed by the UI
  return {
    // State
    billItems,
    people,
    selectedCurrency,
    toasts,
    showClearModal,
    mostExpensiveItem,
    
    // Setters
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
  };
}
