import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../../styles/ExpenseChart.css';

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export const ExpenseChart = ({ items, selectedCurrency }) => {
  const [showItems, setShowItems] = useState(true);
  const isEmpty = !items || items.length === 0;

  const data = isEmpty ? [] : items.map((item, index) => ({
    name: item.item,
    value: Number(item.cost),
    color: COLORS[index % COLORS.length]
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="expense-chart-container">
      <div className="chart-header-row">
        <h3 className="chart-title">Expense Breakdown</h3>
        {!isEmpty && (
          <button
            type="button"
            className="chart-toggle-items"
            onClick={() => setShowItems((v) => !v)}
            aria-pressed={showItems}
            aria-label={showItems ? 'Hide item list' : 'Show item list'}
          >
            {showItems ? 'Hide items' : 'Show items'}
          </button>
        )}
      </div>
      {isEmpty ? (
        <div className="chart-empty">Add items to see expense breakdown</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={0}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                fill="#8884d8"
                label={false}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${selectedCurrency} ${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                labelStyle={{ fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {showItems && (
            <ul className="chart-legend-list" aria-label="Expense breakdown by item">
              {data.map((entry, index) => {
                const percent = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <li key={`legend-${index}`} className="chart-legend-item">
                    <span className="chart-legend-swatch" style={{ backgroundColor: entry.color }} aria-hidden />
                    <span className="chart-legend-label">{entry.name}</span>
                    <span className="chart-legend-percent">({percent.toFixed(0)}%)</span>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="chart-total">
            <strong>Total: {selectedCurrency} {total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};
