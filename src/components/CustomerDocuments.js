import React from 'react';
import './CustomerDocuments.css';

function CustomerDocuments({ documents, onUpdateDocument }) {
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'License':
        return 'fa-id-card';
      case 'Insurance':
        return 'fa-shield-alt';
      case 'RC':
        return 'fa-car';
      default:
        return 'fa-file-alt';
    }
  };

  const getStatusMessage = (status, balance) => {
    if (status === 'Completed') {
      return 'Document processing completed';
    }
    if (parseFloat(balance) <= 0) {
      return 'Payment completed, document processing pending';
    }
    return 'Payment pending';
  };

  return (
    <div className="documents-section">
      <h3>Customer Documents</h3>
      <div className="documents-list">
        {documents.map((doc, index) => (
          <div key={index} className="document-card">
            <div className="document-header">
              <div className="document-type">
                <i className={`fas ${getDocumentIcon(doc.documentType)}`}></i>
                {doc.documentType} - {doc.documentSubType}
              </div>
              <span className={`document-status status-${doc.applicationStatus.toLowerCase()}`}>
                {doc.applicationStatus}
              </span>
            </div>
            
            <div className="document-details">
              <div className="detail-item">
                <span className="detail-label">Total Amount</span>
                <span className="detail-value">₹{doc.totalAmount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Advance Payment</span>
                <span className="detail-value">₹{doc.advancePayment}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Balance</span>
                <span className="detail-value">₹{doc.balance}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value status-message">{getStatusMessage(doc.applicationStatus, doc.balance)}</span>
              </div>
            </div>

            <div className="document-actions">
              <button 
                className="edit-button"
                onClick={() => onUpdateDocument(doc)}
              >
                <i className="fas fa-edit"></i>
                Update Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerDocuments; 