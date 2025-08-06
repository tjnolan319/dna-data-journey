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

  // Color constants to match preview
  const colors = {
    primary: [59, 130, 246], // Blue
    text: [15, 23, 42], // Slate-900
    textSecondary: [71, 85, 105], // Slate-600
    background: [248, 250, 252], // Slate-50
    border: [226, 232, 240], // Slate-200
    codeBackground: [15, 23, 42], // Slate-900
    codeText: [203, 213, 225], // Slate-300
  };

  // Helper function to add text with better styling
  const addText = (text: string, fontSize: number, style: 'normal' | 'bold' = 'normal', color = colors.text, maxWidth = contentWidth) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('times', style); // Use Times instead of Helvetica for serif look
    pdf.setTextColor(color[0], color[1], color[2]);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.4; // Better line spacing
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pageHeight - margin - 20) {
      pdf.addPage();
      yPosition = margin + 20; // Leave space for header on new pages
    }
    
    lines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    
    return yPosition;
  };

  // Helper function to add a styled box background
  const addBoxBackground = (x: number, y: number, width: number, height: number, fillColor = colors.background, borderColor = colors.border) => {
    pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    pdf.rect(x, y, width, height, 'F');
    
    pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.setLineWidth(0.5);
    pdf.rect(x, y, width, height);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Enhanced markdown processing for better PDF rendering
  const processMarkdownForPDF = (text: string) => {
    if (!text) return [];
    
    const sections: Array<{type: string, content: string, style?: string}> = [];
    const lines = text.split('\n');
    let currentParagraph = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Headers
      if (line.startsWith('### ')) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        sections.push({type: 'header3', content: line.replace('### ', '')});
      } else if (line.startsWith('## ')) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        sections.push({type: 'header2', content: line.replace('## ', '')});
      } else if (line.startsWith('# ')) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        sections.push({type: 'header1', content: line.replace('# ', '')});
      }
      // Code blocks
      else if (line.startsWith('```')) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        
        const language = line.replace('```', '');
        let codeContent = '';
        i++; // Skip the opening ```
        
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeContent += lines[i] + '\n';
          i++;
        }
        
        sections.push({type: 'code', content: codeContent.trim(), style: language});
      }
      // Custom colored boxes
      else if (line.match(/~box\(([^)]+)\)/)) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        
        const colorMatch = line.match(/~box\(([^)]+)\)/);
        const color = colorMatch ? colorMatch[1] : 'blue';
        let boxContent = '';
        
        // Find content until ~endbox
        const restOfLine = line.replace(/~box\([^)]+\)\s*/, '');
        if (restOfLine) boxContent += restOfLine + '\n';
        
        i++;
        while (i < lines.length && !lines[i].includes('~endbox')) {
          boxContent += lines[i] + '\n';
          i++;
        }
        
        sections.push({type: 'colorbox', content: boxContent.trim(), style: color});
      }
      // Lists
      else if (line.startsWith('* ') || line.startsWith('- ')) {
        if (currentParagraph) {
          sections.push({type: 'paragraph', content: currentParagraph.trim()});
          currentParagraph = '';
        }
        sections.push({type: 'listitem', content: line.replace(/^[*-]\s+/, '')});
      }
      // Regular text
      else if (line.length > 0) {
        currentParagraph += line + ' ';
      }
      // Empty line - end paragraph
      else if (currentParagraph) {
        sections.push({type: 'paragraph', content: currentParagraph.trim()});
        currentParagraph = '';
      }
    }
    
    // Don't forget the last paragraph
    if (currentParagraph) {
      sections.push({type: 'paragraph', content: currentParagraph.trim()});
    }
    
    return sections;
  };

  // Function to render processed markdown sections
  const renderMarkdownSections = (sections: Array<{type: string, content: string, style?: string}>) => {
    sections.forEach(section => {
      const cleanContent = section.content
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`([^`]+)`/g, '$1') // Remove inline code markdown
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove link markdown
      
      switch (section.type) {
        case 'header1':
          yPosition += 8;
          addText(cleanContent, 16, 'bold', colors.text);
          yPosition += 4;
          break;
          
        case 'header2':
          yPosition += 6;
          addText(cleanContent, 14, 'bold', colors.text);
          yPosition += 3;
          break;
          
        case 'header3':
          yPosition += 4;
          addText(cleanContent, 12, 'bold', colors.text);
          yPosition += 2;
          break;
          
        case 'paragraph':
          addText(cleanContent, 10, 'normal', colors.text);
          yPosition += 3;
          break;
          
        case 'code':
          // Add some spacing before code
          yPosition += 3;
          
          // Calculate code block height
          const codeLines = cleanContent.split('\n');
          const codeHeight = (codeLines.length * 4) + 8;
          
          // Check if we need a new page
          if (yPosition + codeHeight > pageHeight - margin - 20) {
            pdf.addPage();
            yPosition = margin + 20;
          }
          
          // Draw code background
          pdf.setFillColor(colors.codeBackground[0], colors.codeBackground[1], colors.codeBackground[2]);
          pdf.rect(margin, yPosition, contentWidth, codeHeight, 'F');
          
          // Add rounded corners effect with border
          pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
          pdf.setLineWidth(0.5);
          pdf.rect(margin, yPosition, contentWidth, codeHeight);
          
          // Add code text
          yPosition += 6;
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(colors.codeText[0], colors.codeText[1], colors.codeText[2]);
          
          codeLines.forEach(line => {
            pdf.text(line, margin + 3, yPosition);
            yPosition += 4;
          });
          
          yPosition += 5;
          break;
          
        case 'colorbox':
          yPosition += 3;
          
          // Get box color (simplified color mapping)
          let boxColor = colors.primary;
          switch (section.style?.toLowerCase()) {
            case 'green': boxColor = [34, 197, 94]; break;
            case 'yellow': boxColor = [234, 179, 8]; break;
            case 'red': boxColor = [239, 68, 68]; break;
            case 'purple': boxColor = [168, 85, 247]; break;
            default: boxColor = colors.primary;
          }
          
          const boxLines = pdf.splitTextToSize(cleanContent, contentWidth - 20);
          const boxHeight = (boxLines.length * 4) + 8;
          
          // Check if we need a new page
          if (yPosition + boxHeight > pageHeight - margin - 20) {
            pdf.addPage();
            yPosition = margin + 20;
          }
          
          // Draw colored left border
          pdf.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
          pdf.rect(margin, yPosition, 3, boxHeight, 'F');
          
          // Draw box background
          pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
          pdf.rect(margin + 3, yPosition, contentWidth - 3, boxHeight, 'F');
          
          // Draw border
          pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
          pdf.setLineWidth(0.5);
          pdf.rect(margin, yPosition, contentWidth, boxHeight);
          
          // Add text
          yPosition += 6;
          pdf.setFont('times', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          
          boxLines.forEach((line: string) => {
            pdf.text(line, margin + 8, yPosition);
            yPosition += 4;
          });
          
          yPosition += 5;
          break;
          
        case 'listitem':
          pdf.setFont('times', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          
          // Add bullet point
          pdf.text('•', margin + 5, yPosition);
          
          // Add list item text
          const listLines = pdf.splitTextToSize(cleanContent, contentWidth - 15);
          listLines.forEach((line: string, index: number) => {
            pdf.text(line, margin + 12, yPosition);
            if (index < listLines.length - 1) yPosition += 4;
          });
          yPosition += 6;
          break;
      }
    });
  };

  try {
    // Header with better styling to match preview
    pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Main title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('times', 'bold');
    const headerText = 'LAB NOTE';
    const headerTextWidth = pdf.getTextWidth(headerText);
    pdf.text(headerText, (pageWidth - headerTextWidth) / 2, 28);
    
    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    const subHeaderText = 'Research & Analysis Document';
    const subHeaderTextWidth = pdf.getTextWidth(subHeaderText);
    pdf.text(subHeaderText, (pageWidth - subHeaderTextWidth) / 2, 38);
    
    yPosition = 65;

    // Title section with better spacing
    pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    pdf.setFontSize(20);
    pdf.setFont('times', 'bold');
    const titleLines = pdf.splitTextToSize(noteData.title || 'Untitled Lab Note', contentWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += 8;
    });
    yPosition += 10;

    // Metadata box with better styling
    const metadataHeight = 45;
    addBoxBackground(margin, yPosition, contentWidth, metadataHeight);
    
    yPosition += 10;
    pdf.setFontSize(11);
    
    // Author info with icon-like formatting
    pdf.setFont('times', 'bold');
    pdf.text('👤 Author:', margin + 8, yPosition);
    pdf.setFont('times', 'normal');
    pdf.text('Tim Nolan', margin + 45, yPosition);
    
    pdf.setFont('times', 'bold');
    pdf.text('📅 Date:', margin + 105, yPosition);
    pdf.setFont('times', 'normal');
    pdf.text(formatDate(noteData.date), margin + 135, yPosition);
    yPosition += 12;
    
    if (noteData.read_time) {
      pdf.setFont('times', 'bold');
      pdf.text('⏱️ Read Time:', margin + 8, yPosition);
      pdf.setFont('times', 'normal');
      pdf.text(noteData.read_time, margin + 55, yPosition);
    }
    
    pdf.setFont('times', 'bold');
    pdf.text('🏷️ Category:', margin + 105, yPosition);
    pdf.setFont('times', 'normal');
    pdf.text(noteData.category.replace('-', ' '), margin + 148, yPosition);
    yPosition += 12;
    
    // Tags
    if (noteData.tags) {
      const tags = noteData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      pdf.setFont('times', 'bold');
      pdf.text('🏷️ Tags:', margin + 8, yPosition);
      pdf.setFont('times', 'normal');
      const tagText = tags.join(', ');
      pdf.text(tagText, margin + 40, yPosition);
    }
    
    yPosition += 20;

    // Executive Summary with better formatting
    if (noteData.excerpt) {
      pdf.setFontSize(16);
      pdf.setFont('times', 'bold');
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.text('Executive Summary', margin, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('times', 'normal');
      pdf.setTextColor(colors.textSecondary[0], colors.textSecondary[1], colors.textSecondary[2]);
      const excerptLines = pdf.splitTextToSize(noteData.excerpt, contentWidth);
      excerptLines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 30) {
          pdf.addPage();
          yPosition = margin + 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5.5;
      });
      yPosition += 15;
    }

    // Content sections with enhanced styling
    const sortedTabs = [...noteData.tab_config].sort((a, b) => a.order - b.order);
    
    sortedTabs.forEach((tab, index) => {
      const content = noteData.content[tab.id];
      if (!content || !content.trim()) return;

      // Check if we need a new page for the section header
      if (yPosition > pageHeight - margin - 40) {
        pdf.addPage();
        yPosition = margin + 20;
      }

      // Section header with improved badge design
      const badgeSize = 18;
      pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.rect(margin, yPosition, badgeSize, 12, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('times', 'bold');
      const badgeText = `${index + 1}`;
      const badgeWidth = pdf.getTextWidth(badgeText);
      pdf.text(badgeText, margin + (badgeSize - badgeWidth) / 2, yPosition + 8);
      
      pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      pdf.setFontSize(16);
      pdf.setFont('times', 'bold');
      pdf.text(tab.name, margin + badgeSize + 8, yPosition + 8);
      
      yPosition += 20;

      // Process and render markdown content
      const sections = processMarkdownForPDF(content);
      renderMarkdownSections(sections);
      
      yPosition += 10;
    });

    // Enhanced footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer background
      pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      
      pdf.setFontSize(8);
      pdf.setFont('times', 'normal');
      pdf.setTextColor(colors.textSecondary[0], colors.textSecondary[1], colors.textSecondary[2]);
      
      const footerY = pageHeight - 8;
      pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY);
      pdf.text(`Lab Note System | Research & Development`, pageWidth - margin - 85, footerY);
      
      const pageText = `Page ${i} of ${totalPages}`;
      const pageTextWidth = pdf.getTextWidth(pageText);
      pdf.text(pageText, (pageWidth - pageTextWidth) / 2, footerY);
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
