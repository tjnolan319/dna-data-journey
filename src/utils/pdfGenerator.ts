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

export const generateLabNotePDF = async (noteData: LabNoteData) => {
  // Create a temporary HTML element that matches the preview exactly
  const tempDiv = document.createElement('div');
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.background = 'white';
  tempDiv.style.fontFamily = 'Georgia, serif';
  tempDiv.style.padding = '32px';
  tempDiv.style.fontSize = '14px';
  tempDiv.style.lineHeight = '1.6';
  tempDiv.style.color = '#1e293b';

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format tags
  const formatTags = (tagsString: string) => {
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  // Enhanced markdown processing to match preview exactly
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    
    let formatted = text;
    
    // Custom colored boxes
    formatted = formatted.replace(/~box\(([^)]+)\)\s*([\s\S]*?)\s*~endbox/g, (match, color, content) => {
      const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
        'blue': { bg: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' },
        'green': { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
        'yellow': { bg: '#fefce8', border: '#eab308', text: '#a16207' },
        'red': { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        'purple': { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8' }
      };
      const colorStyles = colorMap[color.toLowerCase()] || colorMap['blue'];
      return `<div style="background: ${colorStyles.bg}; border-left: 4px solid ${colorStyles.border}; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; color: ${colorStyles.text};">${content.trim()}</div>`;
    });
    
    // Headers
    formatted = formatted.replace(/^### (.*$)/gm, '<h3 style="font-size: 16px; font-weight: 600; margin: 24px 0 12px 0; color: #1e293b;">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gm, '<h2 style="font-size: 18px; font-weight: 600; margin: 32px 0 16px 0; color: #1e293b;">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gm, '<h1 style="font-size: 20px; font-weight: 700; margin: 32px 0 16px 0; color: #1e293b;">$1</h1>');
    
    // Bold and italic
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');
    
    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, 
      '<div style="background: #0f172a; color: #cbd5e1; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; font-family: monospace; font-size: 12px;"><pre style="margin: 0; white-space: pre-wrap;">$2</pre></div>');
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #1e293b;">$1</code>');
    
    // Lists
    formatted = formatted.replace(/^\* (.+)$/gm, '<li style="margin-left: 16px; margin-bottom: 4px;">• $1</li>');
    formatted = formatted.replace(/^\- (.+)$/gm, '<li style="margin-left: 16px; margin-bottom: 4px;">• $1</li>');
    
    // Links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>');
    
    // Paragraphs
    formatted = formatted.replace(/\n\n/g, '</p><p style="margin-bottom: 16px; color: #475569; line-height: 1.7;">');
    formatted = formatted.replace(/\n/g, '<br>');
    
    return `<div><p style="margin-bottom: 16px; color: #475569; line-height: 1.7;">${formatted}</p></div>`;
  };

  // Build the HTML content to match the preview exactly
  tempDiv.innerHTML = `
    <!-- PDF Header -->
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">LAB NOTE</h1>
      <div style="color: #64748b; font-size: 14px;">Research & Analysis Document</div>
    </div>

    <!-- Title Section -->
    <div style="margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 16px;">${noteData.title}</h2>
      
      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b;">👤</span>
            <span>Author: Tim Nolan</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b;">📅</span>
            <span>Date: ${formatDate(noteData.date)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b;">⏱️</span>
            <span>Read Time: ${noteData.read_time}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: #64748b;">🏷️</span>
            <span>Category: ${noteData.category.replace('-', ' ')}</span>
          </div>
        </div>
        ${noteData.tags ? `
          <div style="margin-top: 8px; font-size: 14px;">
            <span style="font-weight: 600;">Tags: </span>
            ${formatTags(noteData.tags).join(', ')}
          </div>
        ` : ''}
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-weight: 600; color: #1e293b; margin-bottom: 8px;">Executive Summary</h3>
        <p style="color: #475569; line-height: 1.7;">${noteData.excerpt}</p>
      </div>
    </div>

    <!-- Content Sections -->
    ${noteData.tab_config
      .sort((a, b) => a.order - b.order)
      .map((tab, index) => {
        const content = noteData.content[tab.id];
        if (!content || !content.trim()) return '';

        return `
          <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0;">
            <h3 style="font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; display: flex; align-items: center;">
              <span style="background: #dbeafe; color: #1e3a8a; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 600; margin-right: 12px;">
                ${index + 1}
              </span>
              ${tab.name}
            </h3>
            
            <div style="max-width: none;">
              ${tab.id === 'code' ? 
                `<div style="background: #0f172a; color: #f1f5f9; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 12px; overflow-x: auto;">
                  <pre style="margin: 0; white-space: pre-wrap;">${content}</pre>
                </div>` :
                `<div style="color: #475569; line-height: 1.7;">
                  ${formatMarkdown(content).replace(/^<div[^>]*>|<\/div>$/g, '')}
                </div>`
              }
            </div>
          </div>
        `;
      }).join('')}

    <!-- Footer -->
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e2e8f0; text-align: center; font-size: 14px; color: #64748b;">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p style="margin-top: 4px;">Lab Note System | Research & Development</p>
    </div>
  `;

  // Add to DOM temporarily (off-screen)
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0px';
  document.body.appendChild(tempDiv);

  try {
    // Use html2canvas to convert the HTML to canvas, then to PDF
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(tempDiv, {
      width: 794, // A4 width in pixels at 96 DPI
      height: tempDiv.scrollHeight,
      scale: 2, // Higher quality
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      allowTaint: true
    });

    // Remove the temporary element
    document.body.removeChild(tempDiv);

    // Create PDF with better page handling
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297; // A4 height in mm
    const margin = 0; // No margin for exact preview match
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      const sourceY = page * pageHeight * (canvas.width / imgWidth);
      const sourceHeight = Math.min(pageHeight * (canvas.width / imgWidth), canvas.height - sourceY);
      
      // Create a canvas for this page section
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeight;
      
      if (pageCtx) {
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(canvas, 0, -sourceY);
      }
      
      const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
      pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, imgWidth, pageImgHeight);
    }

    // Download the PDF
    const fileName = `${noteData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback - remove temp element if it still exists
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
    return false;
  }
};

