import { calculatePerPerson, formatCurrency} from "../../utils/calculations";
import "../../styles/PerPerson.css";
import { ASSET_PATHS } from "../../constants/assets";
import { handleExport } from "../../utils/exportHandler";

export default function PerPerson({ items, numberOfPeople, selectedCurrency, showToast }) {

    const hasItems = items && items.length > 0;
    const perPersonCost = calculatePerPerson(items, numberOfPeople);

    return (
        <div className="per-person">
            <div className="header">
                <div className="title-group">
                    <h3 className="card-title"><img src={ASSET_PATHS.USER_ICON}alt="user" className="logo" />Per Person</h3>
                    <p className="card-subtitle">Split equally among {numberOfPeople} people</p>
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
                        onClick={() => handleExport('png', items, numberOfPeople, selectedCurrency, showToast)}
                        disabled={items.length === 0}
                        title="Download as PNG"
                    >
                        ↓ PNG
                    </button>
                </div>
            </div>

            {hasItems ? (
                <ul className="person-breakdown-list">
                    {items.map((item, index) => (
                        <li className="person-breakdown-item" key={index}>
                            <div className="person-breakdown-info">
                                <div className="person-breakdown-name">{item.item}</div>
                                <div className="person-breakdown-details">{formatCurrency(item.cost, item.selectedCurrency || selectedCurrency)}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-state">Add bill items to see the split</div>
            )}

            <p className="total">Per Person: {formatCurrency(perPersonCost, selectedCurrency)}</p>
        </div>
    );
}
