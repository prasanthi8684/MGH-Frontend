import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface ProposalData {
  id: string;
  name: string;
  date: string;
  amount: number;
  content: {
    products: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    clientName: string;
    clientEmail: string;
    notes?: string;
  };
}

export function generateProposalPDF(proposal: ProposalData): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.text('Proposal', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Proposal #: ${proposal.id}`, 20, 40);
  doc.text(`Date: ${format(new Date(proposal.date), 'dd MMM yyyy')}`, 20, 50);
  
  // Client Information
  doc.setFontSize(14);
  doc.text('Client Information', 20, 70);
  doc.setFontSize(12);
  doc.text(`Name: ${proposal.content.clientName}`, 20, 85);
  doc.text(`Email: ${proposal.content.clientEmail}`, 20, 95);
  
  // Products Table
  doc.setFontSize(14);
  doc.text('Products', 20, 115);
  
  // Table headers
  const headers = ['Product', 'Quantity', 'Price (MYR)', 'Total'];
  let y = 130;
  
  doc.setFontSize(12);
  headers.forEach((header, i) => {
    doc.text(header, 20 + (i * 45), y);
  });
  
  y += 10;
  
  // Table content
  proposal.content.products.forEach(product => {
    const total = product.quantity * product.price;
    
    doc.text(product.name, 20, y);
    doc.text(product.quantity.toString(), 65, y);
    doc.text(product.price.toFixed(2), 110, y);
    doc.text(total.toFixed(2), 155, y);
    
    y += 10;
  });
  
  // Total
  doc.text(`Total Amount: MYR ${proposal.amount.toFixed(2)}`, 20, y + 20);
  
  // Notes
  if (proposal.content.notes) {
    doc.text('Notes:', 20, y + 40);
    doc.setFontSize(10);
    doc.text(proposal.content.notes, 20, y + 50);
  }
  
  return doc.output('datauristring');
}