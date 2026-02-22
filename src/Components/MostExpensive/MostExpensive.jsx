import { useState } from 'react';
import { formatCurrency } from '../../utils/calculations';
import '../../styles/MostExpensive.css';

export const MostExpensive = ({ mostExpensiveItem, selectedCurrency, billItems }) => {
  const [showItem, setShowItem] = useState(true);
  const isEmpty = !billItems || billItems.length === 0;

  return (
    <div className="most-expensive-container">
      <div className="most-expensive-header-row">
        <h3 className="card-title">Most Expensive</h3>
        {!isEmpty && (
          <button
            type="button"
            className="most-expensive-toggle"
            onClick={() => setShowItem((v) => !v)}
            aria-pressed={showItem}
            aria-label={showItem ? 'Hide item' : 'Show item'}
          >
            {showItem ? 'Hide item' : 'Show item'}
          </button>
        )}
      </div>
      {isEmpty ? (
        <div className="most-expensive-empty">Add items to see most expensive item</div>
      ) : showItem ? (
        <div className="most-expensive-card">
          <span className="most-expensive-display">
            <span className="most-expensive-name">{mostExpensiveItem.item}</span>
            <span className="most-expensive-sep"> : </span>
            <span className="most-expensive-price">
              {formatCurrency(mostExpensiveItem.cost, mostExpensiveItem.selectedCurrency || selectedCurrency)}
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
};
