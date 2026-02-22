import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { calculateTotal, calculatePerPerson } from './calculations';

export const exportBillData = (items, numberOfPeople, selectedCurrency) => {
  const total = calculateTotal(items);
  const perPerson = calculatePerPerson(items, numberOfPeople);

  const billData = {
    date: new Date().toLocaleDateString(),
    items: items.map(item => ({
      name: item.item,
      cost: item.cost,
      currency: item.selectedCurrency || selectedCurrency
    })),
    summary: {
      total: total,
      currency: selectedCurrency,
      numberOfPeople: numberOfPeople,
      perPersonCost: perPerson
    }
  };

  return billData;
};

export const downloadBillAsJSON = (items, numberOfPeople, selectedCurrency) => {
  const billData = exportBillData(items, numberOfPeople, selectedCurrency);
  const jsonString = JSON.stringify(billData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bill-split-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadBillAsCSV = (items, numberOfPeople, selectedCurrency) => {
  const total = calculateTotal(items);
  const perPerson = calculatePerPerson(items, numberOfPeople);

  let csv = 'Item,Cost,Currency\n';
  items.forEach(item => {
    csv += `"${item.item}",${item.cost},"${item.selectedCurrency || selectedCurrency}"\n`;
  });
  csv += `\nTotal,${total},"${selectedCurrency}"\n`;
  csv += `Per Person (${numberOfPeople} people),${perPerson},"${selectedCurrency}"\n`;

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bill-split-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadBillAsPDF = (items, numberOfPeople, selectedCurrency) => {
  const total = calculateTotal(items);
  const perPerson = calculatePerPerson(items, numberOfPeople);
  
  const doc = new jsPDF();
  const margin = 15;
  let yPosition = margin;

  // Title
  doc.setFontSize(18);
  doc.text('Bill Split Summary', margin, yPosition);
  
  // Date
  yPosition += 10;
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);

  // Items
  yPosition += 10;
  doc.setFontSize(12);
  doc.text('Items:', margin, yPosition);

  yPosition += 6;
  doc.setFontSize(10);
  items.forEach(item => {
    const itemText = `${item.item}: ${item.cost} ${item.selectedCurrency || selectedCurrency}`;
    doc.text(itemText, margin + 5, yPosition);
    yPosition += 6;
  });

  // Total
  yPosition += 4;
  doc.setFontSize(11);
  doc.text(`Total: ${total} ${selectedCurrency}`, margin, yPosition);

  // Per Person
  yPosition += 6;
  doc.text(`Per Person (${numberOfPeople}): ${perPerson} ${selectedCurrency}`, margin, yPosition);

  // Save
  doc.save(`bill-split-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const downloadBillAsPNG = async (items, numberOfPeople, selectedCurrency) => {
  // Create a temporary div to capture
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'fixed';
  tempDiv.style.left = '-9999px';
  tempDiv.style.background = 'white';
  tempDiv.style.padding = '20px';
  tempDiv.style.width = '400px';
  tempDiv.style.borderRadius = '8px';

  const total = calculateTotal(items);
  const perPerson = calculatePerPerson(items, numberOfPeople);

  tempDiv.innerHTML = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="margin: 0 0 10px 0;">Bill Split Summary</h2>
      <p style="margin: 0 0 15px 0; color: #666;">Date: ${new Date().toLocaleDateString()}</p>
      
      <h3 style="margin: 10px 0 8px 0; font-size: 14px;">Items:</h3>
      <ul style="margin: 0 0 15px 0; padding-left: 20px;">
        ${items.map(item => `<li>${item.item}: ${item.cost} ${item.selectedCurrency || selectedCurrency}</li>`).join('')}
      </ul>
      
      <div style="border-top: 2px solid #333; padding-top: 10px;">
        <p style="margin: 5px 0;"><strong>Total: ${total} ${selectedCurrency}</strong></p>
        <p style="margin: 5px 0;"><strong>Per Person (${numberOfPeople}): ${perPerson} ${selectedCurrency}</strong></p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, { backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `bill-split-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  } catch (error) {
    console.error('Error generating PNG:', error);
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const handleExport = (format, items, numberOfPeople, selectedCurrency, showToast) => {
  if (!items || items.length === 0) {
    showToast('Please add bill items first', 'warning');
    return;
  }

  try {
    switch (format) {
      case 'json':
        downloadBillAsJSON(items, numberOfPeople, selectedCurrency);
        showToast('Bill exported as JSON', 'success');
        break;
      case 'csv':
        downloadBillAsCSV(items, numberOfPeople, selectedCurrency);
        showToast('Bill exported as CSV', 'success');
        break;
      case 'pdf':
        downloadBillAsPDF(items, numberOfPeople, selectedCurrency);
        showToast('Bill exported as PDF', 'success');
        break;
      case 'png':
        downloadBillAsPNG(items, numberOfPeople, selectedCurrency);
        showToast('Bill exported as PNG', 'success');
        break;
      default:
        console.error('Unknown export format:', format);
    }
  } catch (error) {
    console.error('Export error:', error);
    showToast('Error exporting bill', 'error');
  }
};
