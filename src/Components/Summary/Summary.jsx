import { ASSET_PATHS } from '../../constants/assets';
import "../../styles/Summary.css";
import { calculateTotal, formatCurrency } from "../../utils/calculations";
import { handleExport } from "../../utils/exportHandler";

export default function Summary({ items, selectedCurrency, numberOfPeople, onRemoveItem, showToast }) {
    const subtotal = calculateTotal(items);

    return (
        <div className="summary">
            <div className="header">
                <div className="title-group">
                    <h3 className="card-title"><img src={ASSET_PATHS.RECEIPT_ICON} alt="summary" className="logo" />Summary</h3>
                    <p className="card-subtitle">Breakdown of charges</p>
                </div>
                <div className="export-buttons">
                    <button 
                        className="export-btn"
                        onClick={() => handleExport('pdf', items, numberOfPeople, selectedCurrency, showToast)}
                        disabled={items.length === 0}
                        title="Download as PDF"
                    >
                        ↓ PDF
                    </button>
                    <button 
                        className="export-btn"
                        onClick={() => handleExport('csv', items, numberOfPeople, selectedCurrency, showToast)}
                        disabled={items.length === 0}
                        title="Download as CSV"
                    >
                        ↓ CSV
                    </button>
                </div>
            </div>

            {items && items.length > 0 ? (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.item} - {formatCurrency(item.cost, item.selectedCurrency || selectedCurrency)}</span>
                                <button 
                                    onClick={() => {
                                        onRemoveItem(index);
                                        showToast(`${item.item} removed`, 'info');
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#ef4444',
                                        fontSize: '16px'
                                    }}
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-state">No items added yet</div>
            )}

            <p className="total">Total: {formatCurrency(subtotal, selectedCurrency)}</p>
        </div>
    );
}
