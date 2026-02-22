import { useState, useCallback } from 'react';

export const useBillSplitter = () => {
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load from localStorage or initialize
  const [billItems, setBillItems] = useState(() => {
    try {
      const saved = localStorage.getItem('billItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem('people');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: "Person 1" },
        { id: 2, name: "Person 2" }
      ];
    } catch {
      return [
        { id: 1, name: "Person 1" },
        { id: 2, name: "Person 2" }
      ];
    }
  });

  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedCurrency');
      return saved ? JSON.parse(saved) : "£";
    } catch {
      return "£";
    }
  });

  // Save to localStorage
  const saveToLocalStorage = useCallback((items, peopleList, currency) => {
    try {
      localStorage.setItem('billItems', JSON.stringify(items));
      localStorage.setItem('people', JSON.stringify(peopleList));
      localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  // Add to history
  const addToHistory = useCallback((items) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(items);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleAddItem = useCallback((newItem) => {
    const updatedItems = [...billItems, newItem];
    setBillItems(updatedItems);
    addToHistory(updatedItems);
    saveToLocalStorage(updatedItems, people, selectedCurrency);
  }, [billItems, addToHistory, saveToLocalStorage, people, selectedCurrency]);

  const handleRemoveItem = useCallback((index) => {
    const updatedItems = billItems.filter((_, i) => i !== index);
    setBillItems(updatedItems);
    addToHistory(updatedItems);
    saveToLocalStorage(updatedItems, people, selectedCurrency);
  }, [billItems, addToHistory, saveToLocalStorage, people, selectedCurrency]);

  const handleUpdatePeople = useCallback((newPeople) => {
    setPeople(newPeople);
    saveToLocalStorage(billItems, newPeople, selectedCurrency);
  }, [billItems, selectedCurrency, saveToLocalStorage]);

  const handleUpdateCurrency = useCallback((newCurrency) => {
    setSelectedCurrency(newCurrency);
    saveToLocalStorage(billItems, people, newCurrency);
  }, [billItems, people, saveToLocalStorage]);

  const handleClearAll = useCallback(() => {
    const empty = [];
    setBillItems(empty);
    addToHistory(empty);
    saveToLocalStorage(empty, people, selectedCurrency);
  }, [addToHistory, saveToLocalStorage, people, selectedCurrency]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBillItems(history[newIndex]);
      saveToLocalStorage(history[newIndex], people, selectedCurrency);
    }
  }, [history, historyIndex, saveToLocalStorage, people, selectedCurrency]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBillItems(history[newIndex]);
      saveToLocalStorage(history[newIndex], people, selectedCurrency);
    }
  }, [history, historyIndex, saveToLocalStorage, people, selectedCurrency]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    billItems,
    setBillItems,
    people,
    setPeople: handleUpdatePeople,
    selectedCurrency,
    setSelectedCurrency: handleUpdateCurrency,
    handleAddItem,
    handleRemoveItem,
    handleClearAll,
    undo,
    redo,
    canUndo,
    canRedo
  };
};
