import jsPDF from 'jspdf';
import { formatDate } from './helpers';

export const exportAuditLogToPDF = async (auditLogs, caseData) => {
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

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Header
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('AUDIT TRAIL REPORT', 20, 25);
    
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
      ['Case Number:', caseData?.caseNumber || caseData?.case_number || `TRM-${caseData?.id}`],
      ['Case Title:', caseData?.title || 'N/A'],
      ['Total Audit Entries:', auditLogs.length.toString()],
      ['Report Period:', `${formatDate(auditLogs[auditLogs.length - 1]?.timestamp)} - ${formatDate(auditLogs[0]?.timestamp)}`]
    ];

    caseDetails.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 20, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition = addText(value, 60, yPosition, pageWidth - 80);
      yPosition += 5;
    });

    // Summary Statistics
    yPosition += 15;
    checkPageBreak(60);
    
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('AUDIT SUMMARY', 20, yPosition);
    yPosition += 10;

    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Count different action types
    const actionCounts = auditLogs.reduce((acc, log) => {
      const action = log.action || 'Unknown';
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    // Count unique users
    const uniqueUsers = new Set(auditLogs.map(log => log.user_id)).size;

    const summaryStats = [
      ['Total Actions:', auditLogs.length],
      ['Unique Users:', uniqueUsers],
      ['Date Range:', `${Math.ceil((new Date(auditLogs[0]?.timestamp) - new Date(auditLogs[auditLogs.length - 1]?.timestamp)) / (1000 * 60 * 60 * 24))} days`],
      ['Most Common Action:', Object.keys(actionCounts).reduce((a, b) => actionCounts[a] > actionCounts[b] ? a : b, 'None')]
    ];

    pdf.setFontSize(10);
    summaryStats.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 20, yPosition);
      pdf.setFont(undefined, 'normal');
      pdf.text(value.toString(), 80, yPosition);
      yPosition += 8;
    });

    // Action Type Breakdown
    yPosition += 15;
    checkPageBreak(40);
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('ACTION BREAKDOWN', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    Object.entries(actionCounts).forEach(([action, count]) => {
      checkPageBreak(8);
      pdf.setFont(undefined, 'normal');
      pdf.text(`${action}:`, 25, yPosition);
      pdf.text(count.toString(), 80, yPosition);
      yPosition += 6;
    });

    // Detailed Audit Entries
    yPosition += 20;
    checkPageBreak(60);
    
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('DETAILED AUDIT ENTRIES', 20, yPosition);
    yPosition += 10;

    pdf.setLineWidth(0.5);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 15;

    // Table headers
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('Date/Time', 20, yPosition);
    pdf.text('User', 50, yPosition);
    pdf.text('Action', 80, yPosition);
    pdf.text('Details', 120, yPosition);
    yPosition += 8;

    // Draw header line
    pdf.setLineWidth(0.3);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;

    // Audit entries
    auditLogs.forEach((log, index) => {
      checkPageBreak(25);
      
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(8);
      
      // Date/Time
      const dateTime = formatDate(log.timestamp);
      pdf.text(dateTime, 20, yPosition);
      
      // User
      const user = `User #${log.user_id}`;
      pdf.text(user, 50, yPosition);
      
      // Action
      const action = log.action || 'Unknown';
      pdf.text(action, 80, yPosition);
      
      // Details (with wrapping for long text)
      const details = log.description || log.details || 'No details';
      const maxDetailsWidth = pageWidth - 125;
      const detailsLines = pdf.splitTextToSize(details, maxDetailsWidth);
      pdf.text(detailsLines, 120, yPosition);
      
      // Additional info if available
      let additionalInfo = [];
      if (log.ip_address) additionalInfo.push(`IP: ${log.ip_address}`);
      if (log.evidence_id) additionalInfo.push(`Evidence ID: ${log.evidence_id}`);
      if (log.file_name) additionalInfo.push(`File: ${log.file_name}`);
      
      yPosition += Math.max(6, detailsLines.length * 3);
      
      if (additionalInfo.length > 0) {
        checkPageBreak(10);
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        pdf.text(additionalInfo.join(' | '), 120, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 5;
      }
      
      yPosition += 3;
      
      // Draw separator line every 5 entries
      if ((index + 1) % 5 === 0) {
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        pdf.setDrawColor(0, 0, 0);
        yPosition += 3;
      }
    });

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
    const filename = `Case_${caseData?.caseNumber || caseData?.id}_AuditLog_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating audit log PDF:', error);
    return { success: false, error: error.message };
  }
};

// Export audit log as CSV
export const exportAuditLogToCSV = (auditLogs, caseData) => {
  try {
    // CSV headers
    const headers = [
      'Timestamp',
      'User ID',
      'Action',
      'Description',
      'Evidence ID',
      'File Name',
      'IP Address',
      'User Agent'
    ];

    // Convert audit logs to CSV rows
    const rows = auditLogs.map(log => [
      formatDate(log.timestamp),
      log.user_id || '',
      log.action || '',
      log.description || log.details || '',
      log.evidence_id || '',
      log.file_name || '',
      log.ip_address || '',
      log.user_agent || ''
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Case_${caseData?.caseNumber || caseData?.id}_AuditLog_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filename: link.getAttribute('download') };
  } catch (error) {
    console.error('Error generating audit log CSV:', error);
    return { success: false, error: error.message };
  }
};

// Export audit log as JSON
export const exportAuditLogToJSON = (auditLogs, caseData) => {
  try {
    const exportData = {
      export_info: {
        case_number: caseData?.caseNumber || caseData?.case_number,
        case_title: caseData?.title,
        case_id: caseData?.id,
        export_date: new Date().toISOString(),
        total_entries: auditLogs.length
      },
      audit_logs: auditLogs
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Case_${caseData?.caseNumber || caseData?.id}_AuditLog_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filename: link.getAttribute('download') };
  } catch (error) {
    console.error('Error generating audit log JSON:', error);
    return { success: false, error: error.message };
  }
};
