import jsPDF from 'jspdf';

interface TabConfig {
  id: string;
  name: string;
  icon: string;
  order: number;
}

interface LabNoteData {
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  read_time: string;
  date: string;
  content: Record<string, string>;
  tab_config: TabConfig[];
}

export const generateLabNotePDF = (noteData: LabNoteData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', maxWidth = contentWidth) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', style);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.35;
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    lines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    return yPosition;
  };

  // Helper function to add spacing
  const addSpacing = (space: number) => {
    yPosition += space;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to strip HTML and markdown
  const cleanText = (text: string) => {
    if (!text) return '';
    
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, '');
    
    // Remove markdown formatting
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Italic
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1'); // Inline code
    cleaned = cleaned.replace(/```[\s\S]*?```/g, ''); // Code blocks
    cleaned = cleaned.replace(/~box\([^)]+\)\s*([\s\S]*?)\s*~endbox/g, '$1'); // Custom boxes
    cleaned = cleaned.replace(/#{1,6}\s*(.*)/g, '$1'); // Headers
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    return cleaned.trim();
  };

  try {
    // Header
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LAB NOTE', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Research & Analysis Document', margin, 35);
    
    yPosition = 60;
    pdf.setTextColor(0, 0, 0);

    // Title
    addText(noteData.title || 'Untitled Lab Note', 18, 'bold');
    addSpacing(10);

    // Metadata box
    pdf.setFillColor(248, 250, 252); // Light gray background
    const metadataHeight = 50;
    pdf.rect(margin, yPosition, contentWidth, metadataHeight, 'F');
    
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Author and date on same line
    pdf.text(`Author: Tim Nolan`, margin + 5, yPosition);
    pdf.text(`Date: ${formatDate(noteData.date)}`, margin + 100, yPosition);
    yPosition += 12;
    
    // Read time and category
    if (noteData.read_time) {
      pdf.text(`Read Time: ${noteData.read_time}`, margin + 5, yPosition);
    }
    pdf.text(`Category: ${noteData.category.replace('_', ' ')}`, margin + 100, yPosition);
    yPosition += 12;
    
    // Tags
    if (noteData.tags) {
      const tags = noteData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      pdf.text(`Tags: ${tags.join(', ')}`, margin + 5, yPosition);
    }
    
    yPosition += 25;

    // Executive Summary
    if (noteData.excerpt) {
      addText('Executive Summary', 14, 'bold');
      addSpacing(5);
      addText(noteData.excerpt, 11);
      addSpacing(15);
    }

    // Content sections
    const sortedTabs = [...noteData.tab_config].sort((a, b) => a.order - b.order);
    
    sortedTabs.forEach((tab, index) => {
      const content = noteData.content[tab.id];
      if (!content || !content.trim()) return;

      // Section header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(margin, yPosition, 20, 8, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}`, margin + 8, yPosition + 6);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.text(tab.name, margin + 25, yPosition + 6);
      
      yPosition += 15;

      // Content
      const cleanedContent = cleanText(content);
      if (cleanedContent) {
        addText(cleanedContent, 10);
        addSpacing(15);
      }
    });

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      
      const footerY = pageHeight - 10;
      pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY);
      pdf.text(`Lab Note System | Research & Development`, pageWidth - margin - 80, footerY);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2 - 10, footerY);
    }

    // Download the PDF
    const fileName = `${noteData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};