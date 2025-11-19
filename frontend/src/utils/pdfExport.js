import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from './helpers';

export const exportCaseToPDF = async (caseData, evidenceData = []) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Helper function to add text with automatic line wrapping
    const addText = (text, x, y, maxWidth, fontSize = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.35));
    };

    // Header
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('CASE REPORT', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${formatDate(new Date())}`, pageWidth - 60, 15);
    pdf.text('CLASSIFIED', pageWidth - 60, 30);

    yPosition = 60;

    // Case Information Section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('CASE INFORMATION', 20, yPosition);
    yPosition += 10;

    // Draw a line under the header
    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');

    // Case details
    const caseDetails = [
      ['Case Number:', caseData.caseNumber || `TRM-${caseData.id}`],
      ['Title:', caseData.title],
      ['Status:', caseData.status?.toUpperCase() || 'OPEN'],
      ['Priority:', caseData.priority?.toUpperCase() || 'LOW'],
      ['Lead Investigator:', caseData.leadInvestigator || caseData.lead_investigator || 'Unassigned'],
      ['Evidence Type:', caseData.evidenceType || caseData.evidence_type || 'Digital'],
      ['Created:', formatDate(caseData.created_at)],
      ['Last Updated:', formatDate(caseData.updated_at)],
      ['Created By:', `User #${caseData.uploaded_by}`]
    ];

    caseDetails.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 20, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition = addText(value, 60, yPosition, pageWidth - 80);
      yPosition += 5;
    });

    // Case Description Section
    yPosition += 10;
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('CASE DESCRIPTION', 20, yPosition);
    yPosition += 10;

    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const description = caseData.description || 'No description provided for this case.';
    yPosition = addText(description, 20, yPosition, pageWidth - 40);

    // Evidence Summary Section
    yPosition += 20;
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('EVIDENCE SUMMARY', 20, yPosition);
    yPosition += 10;

    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');

    const evidenceStats = [
      ['Total Evidence Items:', caseData.evidence_count || caseData.evidenceCount || 0],
      ['Blockchain Entries:', evidenceData.filter(e => e.tx_hash && !e.tx_hash.startsWith('fallback_')).length],
      ['Local Verifications:', evidenceData.filter(e => e.tx_hash && e.tx_hash.startsWith('fallback_')).length],
      ['Days Active:', Math.ceil((new Date() - new Date(caseData.created_at)) / (1000 * 60 * 60 * 24))]
    ];

    evidenceStats.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 20, yPosition);
      pdf.setFont(undefined, 'normal');
      pdf.text(value.toString(), 80, yPosition);
      yPosition += 8;
    });

    // Evidence Details Section (if evidence data is provided)
    if (evidenceData && evidenceData.length > 0) {
      yPosition += 15;
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('EVIDENCE DETAILS', 20, yPosition);
      yPosition += 10;

      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;

      evidenceData.forEach((evidence, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Evidence #${index + 1}`, 20, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');

        const evidenceDetails = [
          ['Filename:', evidence.filename],
          ['File Type:', evidence.file_type],
          ['File Size:', `${(evidence.file_size / 1024).toFixed(2)} KB`],
          ['SHA256 Hash:', evidence.sha256_hash],
          ['Uploaded:', formatDate(evidence.created_at)],
          ['Transaction Hash:', evidence.tx_hash || 'N/A'],
          ['Blockchain Status:', evidence.tx_hash?.startsWith('fallback_') ? 'Local Verification' : 'Blockchain Verified']
        ];

        evidenceDetails.forEach(([label, value]) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFont(undefined, 'bold');
          pdf.text(label, 25, yPosition);
          pdf.setFont(undefined, 'normal');
          
          if (label === 'SHA256 Hash:' || label === 'Transaction Hash:') {
            // Handle long hashes with line breaks
            yPosition = addText(value, 25, yPosition + 5, pageWidth - 50, 8);
          } else {
            yPosition = addText(value, 70, yPosition, pageWidth - 90);
          }
          yPosition += 3;
        });

        yPosition += 10;
      });
    }

    // Footer
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
      pdf.text('TRM 2.0 - Evidence Management System', 20, pageHeight - 10);
      pdf.text('CONFIDENTIAL', pageWidth / 2 - 15, pageHeight - 10);
    }

    // Save the PDF
    const filename = `Case_${caseData.caseNumber || caseData.id}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};

export const exportCaseWithScreenshot = async (caseData, elementId = 'case-detail-container') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Case detail container not found');
    }

    // Generate screenshot of the case details
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0f172a'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit the page
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title page
    pdf.setFillColor(30, 41, 59);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('CASE REPORT SNAPSHOT', 20, 25);
    
    pdf.setFontSize(12);
    pdf.text(`Generated: ${formatDate(new Date())}`, 20, 50);
    pdf.text(`Case: ${caseData.title}`, 20, 65);
    pdf.text(`Case Number: ${caseData.caseNumber || `TRM-${caseData.id}`}`, 20, 80);

    // Add the screenshot on next page(s)
    let remainingHeight = imgHeight;
    let sourceY = 0;
    
    while (remainingHeight > 0) {
      pdf.addPage();
      
      const currentPageHeight = Math.min(remainingHeight, pageHeight - 20);
      const currentSourceHeight = (currentPageHeight * canvas.height) / imgHeight;
      
      // Create a cropped canvas for this page
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = canvas.width;
      croppedCanvas.height = currentSourceHeight;
      
      const ctx = croppedCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, sourceY, canvas.width, currentSourceHeight, 0, 0, canvas.width, currentSourceHeight);
      
      const croppedImgData = croppedCanvas.toDataURL('image/png');
      pdf.addImage(croppedImgData, 'PNG', 10, 10, imgWidth, currentPageHeight);
      
      remainingHeight -= currentPageHeight;
      sourceY += currentSourceHeight;
    }

    // Save the PDF
    const filename = `Case_${caseData.caseNumber || caseData.id}_Snapshot_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating PDF with screenshot:', error);
    return { success: false, error: error.message };
  }
};
