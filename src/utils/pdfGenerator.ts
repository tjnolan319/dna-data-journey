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
    // Header - centered title
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const headerText = 'LAB NOTE';
    const headerTextWidth = pdf.getTextWidth(headerText);
    pdf.text(headerText, (pageWidth - headerTextWidth) / 2, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const subHeaderText = 'Research & Analysis Document';
    const subHeaderTextWidth = pdf.getTextWidth(subHeaderText);
    pdf.text(subHeaderText, (pageWidth - subHeaderTextWidth) / 2, 35);
    
    yPosition = 60;
    pdf.setTextColor(0, 0, 0);

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(noteData.title || 'Untitled Lab Note', contentWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 7;
    });
    yPosition += 10;

    // Metadata box
    pdf.setFillColor(248, 250, 252); // Light gray background
    const metadataHeight = 60;
    pdf.rect(margin, yPosition, contentWidth, metadataHeight, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition, contentWidth, metadataHeight);
    
    yPosition += 12;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Metadata in a 2x3 grid
    const leftCol = margin + 5;
    const rightCol = margin + 100;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Author:', leftCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Tim Nolan', leftCol + 30, yPosition);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Date:', rightCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatDate(noteData.date), rightCol + 25, yPosition);
    yPosition += 12;
    
    if (noteData.read_time) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Read Time:', leftCol, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(noteData.read_time, leftCol + 35, yPosition);
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category:', rightCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(noteData.category.replace('_', ' '), rightCol + 35, yPosition);
    yPosition += 12;
    
    // Tags
    if (noteData.tags) {
      const tags = noteData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tags:', leftCol, yPosition);
      pdf.setFont('helvetica', 'normal');
      const tagText = tags.join(', ');
      const tagLines = pdf.splitTextToSize(tagText, contentWidth - 50);
      let tagY = yPosition;
      tagLines.forEach((line: string, index: number) => {
        pdf.text(line, leftCol + (index === 0 ? 25 : 0), tagY);
        if (index < tagLines.length - 1) tagY += 10;
      });
    }
    
    yPosition += 25;

    // Executive Summary
    if (noteData.excerpt) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive Summary', margin, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const excerptLines = pdf.splitTextToSize(noteData.excerpt, contentWidth);
      excerptLines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 15;
    }

    // Content sections
    const sortedTabs = [...noteData.tab_config].sort((a, b) => a.order - b.order);
    
    sortedTabs.forEach((tab, index) => {
      const content = noteData.content[tab.id];
      if (!content || !content.trim()) return;

      // Check if we need a new page for the section header
      if (yPosition > pageHeight - margin - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // Section header with number badge
      pdf.setFillColor(59, 130, 246);
      pdf.rect(margin, yPosition, 20, 12, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const badgeText = `${index + 1}`;
      const badgeWidth = pdf.getTextWidth(badgeText);
      pdf.text(badgeText, margin + (20 - badgeWidth) / 2, yPosition + 8);
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(tab.name, margin + 25, yPosition + 8);
      
      yPosition += 20;

      // Content
      const cleanedContent = cleanText(content);
      if (cleanedContent) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Handle code sections differently
        if (tab.id === 'code') {
          pdf.setFont('courier', 'normal');
          pdf.setFillColor(40, 40, 40);
          
          const codeLines = cleanedContent.split('\n');
          const codeHeight = (codeLines.length * 4) + 10;
          
          if (yPosition + codeHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.rect(margin, yPosition, contentWidth, codeHeight, 'F');
          pdf.setTextColor(220, 220, 220);
          
          yPosition += 6;
          codeLines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += 4;
          });
          
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          yPosition += 10;
        } else {
          const contentLines = pdf.splitTextToSize(cleanedContent, contentWidth);
          contentLines.forEach((line: string) => {
            if (yPosition > pageHeight - margin - 10) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += 4.5;
          });
          yPosition += 15;
        }
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