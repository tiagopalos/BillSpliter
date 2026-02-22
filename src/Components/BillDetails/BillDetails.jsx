import { useState, useRef } from "react";
import { ASSET_PATHS } from "../../constants/assets";
import '../../styles/BillDetails.css'

export default function BillDetail({ 
    onAddItem, 
    selectedCurrency, 
    setSelectedCurrency,
    undo,
    redo,
    canUndo,
    canRedo,
}) {

    const [item, setItem] = useState("");
    const [cost, setCost] = useState("");
    const [errors, setErrors] = useState({});
    const itemInputRef = useRef(null);

    const isFormValid = Boolean(item.trim() && cost && Number(cost) > 0);

    const validateForm = () => {
      const newErrors = {};
      if (!item.trim()) newErrors.item = "Item name is required";
      if (!cost || Number(cost) <= 0) newErrors.cost = "Cost must be greater than 0";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    function handleClick(e) {
        e.preventDefault();
        if (!validateForm()) return;

        onAddItem({ 
            item: item.trim(),
            cost: Number(cost),
            selectedCurrency: selectedCurrency
        });

        setItem("");
        setCost("");
        setErrors({});
        itemInputRef.current?.focus();
    }

    const currencies = [
        { symbol: "$", label: "USD - US Dollar" },
        { symbol: "€", label: "EUR - Euro" },
        { symbol: "£", label: "GBP - British Pound" },
        { symbol: "¥", label: "JPY - Japanese Yen" },
        { symbol: "₹", label: "INR - Indian Rupee" },
        { symbol: "₽", label: "RUB - Russian Ruble" },
        { symbol: "¢", label: "CNY - Chinese Yuan" },
        { symbol: "د.إ", label: "AED - UAE Dirham" }
    ];

    return (
        <div className="bill-details">
            <div>
                <h3 className="card-title"><img src={ASSET_PATHS.RECEIPT_ICON} alt="receipt" className="logo"/>Bill Details</h3>
            </div>
            <p className="card-subtitle">Add items to your bill</p>

            <form onSubmit={handleClick}>
                <div>
                    <label className="form-label">Currency {selectedCurrency}</label>
                    <select 
                      className="form-select" 
                      name="currency" 
                      onChange={e => setSelectedCurrency(e.target.value)} 
                      id="currency" 
                      value={selectedCurrency}
                      aria-label="Select currency"
                    >
                        {currencies.map((currency) => <option key={currency.symbol} value={currency.symbol}>{currency.label}</option>)}
                    </select>
                </div>

                <div className="add-item-group">
                    <label className="form-label">Add Bill Item</label>
                    <input 
                      ref={itemInputRef}
                      className={`inputfield ${errors.item ? 'input-error' : ''}`}
                      type="text" 
                      placeholder="Item name (e.g., Pizza)" 
                      value={item} 
                      onChange={e => {
                        setItem(e.target.value);
                        if (errors.item) setErrors(prev => ({ ...prev, item: '' }));
                      }}
                      aria-label="Item name"
                      aria-describedby={errors.item ? "item-error" : undefined}
                    />
                    {errors.item && <span className="error-message" id="item-error">{errors.item}</span>}

                    <div className="add-item-group">
                        <input 
                          className={`inputfieldNumber ${errors.cost ? 'input-error' : ''}`}
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="0.00" 
                          value={cost} 
                          onChange={e => {
                            setCost(e.target.value);
                            if (errors.cost) setErrors(prev => ({ ...prev, cost: '' }));
                          }}
                          aria-label="Item cost"
                          aria-describedby={errors.cost ? "cost-error" : undefined}
                        />
                        {errors.cost && <span className="error-message" id="cost-error">{errors.cost}</span>}
                    </div>

                    <div className="add-item-actions">
                        <button 
                          className="btn-primary" 
                          type="submit" 
                          disabled={!isFormValid}
                          title={!isFormValid ? "Enter item name and cost to add" : "Add item to bill"}
                        >
                          + Add
                        </button>
                    </div>
                </div>
            </form>

            <div className="undo-redo-buttons">
              <button 
                className="btn-undo"
                onClick={undo}
                disabled={!canUndo}
                title="Undo last action (Ctrl+Z)"
                aria-label="Undo last action"
              >
                <img src={ASSET_PATHS.UNDO_ICON} alt="" className="btn-icon" aria-hidden />
                Undo
              </button>
              <button 
                className="btn-redo"
                onClick={redo}
                disabled={!canRedo}
                title="Redo last action (Ctrl+Y)"
                aria-label="Redo last action"
              >
                <img src={ASSET_PATHS.REDO_iCON} alt="" className="btn-icon" aria-hidden />
                Redo
              </button>
            </div>
        </div>
    )
};

