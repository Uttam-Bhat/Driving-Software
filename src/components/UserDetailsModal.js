import React, { useState, useEffect } from 'react';
import CustomerDocuments from './CustomerDocuments';
import './UserDetailsModal.css';

function UserDetailsModal({ isOpen, onClose, userData }) {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    address: '',
    documentType: '',
    documentSubType: '',
    totalAmount: '',
    advancePayment: '',
    balance: '',
    applicationStatus: '',
    applicationDate: '',
    amountPaidDate: '',
    notes: '',
    isFullyPaid: false
  });

  const [documents, setDocuments] = useState([]);
  const [documentSubTypes, setDocumentSubTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
        address: userData.address || 'Address not provided',
        applicationDate: userData.applicationDate || new Date().toISOString().split('T')[0],
        amountPaidDate: userData.amountPaidDate || new Date().toISOString().split('T')[0],
        isFullyPaid: parseFloat(userData.balance) <= 0
      });
      // Simulate loading documents
      setDocuments([
        {
          documentType: 'License',
          documentSubType: 'New',
          totalAmount: '5000',
          advancePayment: '3000',
          balance: '2000',
          applicationStatus: 'Pending',
          applicationDate: '2024-01-15',
          amountPaidDate: '2024-01-15',
          notes: 'Customer requested urgent processing'
        },
        {
          documentType: 'Insurance',
          documentSubType: 'New',
          totalAmount: '3000',
          advancePayment: '3000',
          balance: '0',
          applicationStatus: 'Completed',
          applicationDate: '2024-01-10',
          amountPaidDate: '2024-01-10',
          notes: 'Insurance policy activated successfully'
        }
      ]);
    }
  }, [userData]);

  useEffect(() => {
    // Update document subtypes based on document type
    switch (formData.documentType) {
      case 'License':
        setDocumentSubTypes(['New', 'Renewal']);
        break;
      case 'Insurance':
        setDocumentSubTypes(['New', 'Renewal']);
        break;
      case 'RC':
        setDocumentSubTypes(['New', 'Transfer', 'Duplicate']);
        break;
      default:
        setDocumentSubTypes([]);
    }
  }, [formData.documentType]);

  useEffect(() => {
    // Calculate balance
    const total = parseFloat(formData.totalAmount) || 0;
    const advance = parseFloat(formData.advancePayment) || 0;
    const balance = total - advance;
    setFormData(prev => ({ 
      ...prev, 
      balance: balance.toFixed(2),
      isFullyPaid: balance <= 0
    }));
  }, [formData.totalAmount, formData.advancePayment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form updated:', formData);
      
      // Update the documents list with the new data
      const updatedDocuments = documents.map(doc => 
        doc.documentType === editingDocument.documentType && 
        doc.documentSubType === editingDocument.documentSubType 
          ? { ...formData } 
          : doc
      );
      setDocuments(updatedDocuments);
      setIsEditing(false);
      setEditingDocument(null);
      // Update formData with customerName and contactNumber from userData if available
      setFormData(prev => ({
        ...prev,
        customerName: userData?.customerName || prev.customerName,
        contactNumber: userData?.contactNumber || prev.contactNumber
      }));
      // Show success message
      alert('Document updated successfully!');
    } catch (error) {
      console.error('Error updating form:', error);
      alert('Error updating document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDocument = (doc) => {
    // Create a copy of the document data to avoid reference issues
    const documentCopy = { ...doc };
    setFormData(documentCopy);
    setEditingDocument(documentCopy);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form data to the original document data
    if (editingDocument) {
      setFormData(editingDocument);
    }
    setIsEditing(false);
    setEditingDocument(null);
  };

  const handleViewDocument = (doc) => {
    setViewingDocument(doc);
  };

  const closeViewModal = () => {
    setViewingDocument(null);
  };

  const handleDeleteDocument = async (doc) => {
    try {
      // Remove the document from the local state
      const updatedDocuments = documents.filter(d => d !== doc);
      setDocuments(updatedDocuments);
      
      // Here you would typically make an API call to delete from the backend
      // For now, we'll just update the local state
      console.log('Document deleted:', doc);
      
      // Show success message
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Pending':
        return 'pending';
      case 'Applied':
        return 'applied';
      default:
        return 'default';
    }
  };

  const getTotalDocuments = () => documents.length;
  const getCompletedDocuments = () => documents.filter(doc => doc.applicationStatus === 'Completed').length;
  const getTotalAmount = () => documents.reduce((sum, doc) => sum + parseFloat(doc.totalAmount || 0), 0);
  const getTotalPaid = () => documents.reduce((sum, doc) => sum + parseFloat(doc.advancePayment || 0), 0);
  const getTotalBalance = () => documents.reduce((sum, doc) => sum + parseFloat(doc.balance || 0), 0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-details-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
        
        {/* Simplified Header */}
        <div className="customer-header">
          <div className="header-content">
            <h2>{formData.customerName}</h2>
            <div className="contact-info">
              <i className="fas fa-phone"></i>
              <span>{formData.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{getTotalDocuments()}</div>
              <div className="stat-label">Total Documents</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{getCompletedDocuments()}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amount">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{getTotalAmount().toLocaleString()}</div>
              <div className="stat-label">Total Amount</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon balance">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">₹{getTotalBalance().toLocaleString()}</div>
              <div className="stat-label">Balance Due</div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="documents-section">
          {!isEditing ? (
            <CustomerDocuments 
              documents={documents}
              onUpdateDocument={handleUpdateDocument}
              onViewDocument={handleViewDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          ) : (
            <div className="edit-document-form">
              <div className="edit-header">
                <h3>Update Document Details</h3>
                <p>Editing: {editingDocument?.documentType} - {editingDocument?.documentSubType}</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Document Type</label>
                    <input
                      type="text"
                      value={formData.documentType}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  <div className="form-group">
                    <label>Document Sub Type</label>
                    <input
                      type="text"
                      value={formData.documentSubType}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Amount <span className="required">*</span></label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Advance Payment</label>
                    <input
                      type="text"
                      value={formData.advancePayment}
                      readOnly
                      className="readonly"
                    />
                  </div>
                  <div className="form-group">
                    <label>Balance</label>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Application Status <span className="required">*</span></label>
                    <select
                      name="applicationStatus"
                      value={formData.applicationStatus}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Applied">Applied</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter any additional notes..."
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
                    {isSubmitting ? 'Updating...' : 'Update Document'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Beautiful Document Details Modal */}
      {viewingDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={closeViewModal}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={closeViewModal}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.1rem',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ef4444';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#ef4444';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '2.5rem',
              paddingBottom: '2rem',
              borderBottom: '2px solid #e2e8f0',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                borderRadius: '1px'
              }}></div>
              
              <h3 style={{
                color: '#1e293b',
                fontSize: '2rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                background: 'linear-gradient(135deg, #1e293b, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Document Details</h3>
              
              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                margin: '0 0 1.5rem 0'
              }}>Complete information about this document application</p>
              
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <i className={`fas ${getDocumentIcon(viewingDocument.documentType)}`} style={{fontSize: '1.2rem'}}></i>
                <span>{viewingDocument.documentType} - {viewingDocument.documentSubType}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              
              {/* Status Overview */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    background: viewingDocument.applicationStatus === 'Completed' ? 'linear-gradient(135deg, #10b981, #059669)' :
                               viewingDocument.applicationStatus === 'Pending' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                               'linear-gradient(135deg, #3b82f6, #2563eb)'
                  }}>
                    <i className={`fas ${
                      viewingDocument.applicationStatus === 'Completed' ? 'fa-check-circle' :
                      viewingDocument.applicationStatus === 'Pending' ? 'fa-clock' :
                      'fa-paper-plane'
                    }`}></i>
                  </div>
                  <div>
                    <h4 style={{
                      color: '#374151',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 0.5rem 0'
                    }}>Current Status</h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem',
                      background: viewingDocument.applicationStatus === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                                 viewingDocument.applicationStatus === 'Pending' ? 'rgba(245, 158, 11, 0.1)' :
                                 'rgba(59, 130, 246, 0.1)',
                      color: viewingDocument.applicationStatus === 'Completed' ? '#059669' :
                             viewingDocument.applicationStatus === 'Pending' ? '#d97706' :
                             '#2563eb',
                      border: viewingDocument.applicationStatus === 'Completed' ? '1px solid rgba(16, 185, 129, 0.2)' :
                              viewingDocument.applicationStatus === 'Pending' ? '1px solid rgba(245, 158, 11, 0.2)' :
                              '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      {viewingDocument.applicationStatus}
                    </div>
                    <p style={{
                      color: '#64748b',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      margin: '0'
                    }}>
                      {viewingDocument.applicationStatus === 'Completed' ? 'Document has been successfully processed and completed' :
                       viewingDocument.applicationStatus === 'Pending' ? 'Document is currently being processed' :
                       'Application has been submitted and is under review'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <i className="fas fa-file-alt" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
                  <h4 style={{
                    color: '#374151',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0'
                  }}>Document Information</h4>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Document Type</label>
                    <span style={{
                      fontSize: '1.1rem',
                      color: '#1e293b',
                      fontWeight: '600',
                      padding: '0.5rem 0.75rem',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      borderLeft: '3px solid #3b82f6',
                      display: 'block'
                    }}>{viewingDocument.documentType}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Document Sub Type</label>
                    <span style={{
                      fontSize: '1.1rem',
                      color: '#1e293b',
                      fontWeight: '600',
                      padding: '0.5rem 0.75rem',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      borderLeft: '3px solid #3b82f6',
                      display: 'block'
                    }}>{viewingDocument.documentSubType}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Processing Priority</label>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      {parseFloat(viewingDocument.balance) <= 0 ? 'High Priority' : 'Standard Priority'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #bae6fd',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <i className="fas fa-rupee-sign" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
                  <h4 style={{
                    color: '#374151',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0'
                  }}>Payment Information</h4>
                </div>
                
                {/* Payment Progress */}
                <div style={{marginBottom: '1.5rem'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      flex: '1',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                        width: `${(parseFloat(viewingDocument.advancePayment) / parseFloat(viewingDocument.totalAmount)) * 100}%`
                      }}></div>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#059669',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}>
                      {Math.round((parseFloat(viewingDocument.advancePayment) / parseFloat(viewingDocument.totalAmount)) * 100)}% Paid
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Total Amount</label>
                    <span style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}>₹{parseFloat(viewingDocument.totalAmount).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Advance Payment</label>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#059669'
                    }}>₹{parseFloat(viewingDocument.advancePayment).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Balance Due</label>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: parseFloat(viewingDocument.balance) <= 0 ? '#059669' : '#d97706'
                    }}>₹{parseFloat(viewingDocument.balance).toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Payment Status</label>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: parseFloat(viewingDocument.balance) <= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: parseFloat(viewingDocument.balance) <= 0 ? '#059669' : '#d97706',
                      border: parseFloat(viewingDocument.balance) <= 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      {parseFloat(viewingDocument.balance) <= 0 ? 'Fully Paid' : 'Partially Paid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <i className="fas fa-calendar-alt" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
                  <h4 style={{
                    color: '#374151',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    margin: '0'
                  }}>Application Details</h4>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Application Date</label>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>{new Date(viewingDocument.applicationDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Payment Date</label>
                    <span style={{
                      fontSize: '1rem',
                      color: '#374151',
                      fontWeight: '500'
                    }}>{new Date(viewingDocument.amountPaidDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Processing Time</label>
                    <span style={{
                      fontSize: '1rem',
                      color: '#3b82f6',
                      fontWeight: '600'
                    }}>
                      {(() => {
                        const appDate = new Date(viewingDocument.applicationDate);
                        const today = new Date();
                        const diffTime = Math.abs(today - appDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
                      })()}
                    </span>
                  </div>
                  
                  <div>
                    <label style={{
                      fontSize: '0.85rem',
                      color: '#64748b',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Estimated Completion</label>
                    <span style={{
                      fontSize: '1rem',
                      color: '#059669',
                      fontWeight: '600'
                    }}>
                      {viewingDocument.applicationStatus === 'Completed' ? 'Completed' : 'Within 7-10 days'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {viewingDocument.notes && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #fbbf24',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <i className="fas fa-sticky-note" style={{color: '#3b82f6', fontSize: '1.2rem'}}></i>
                    <h4 style={{
                      color: '#374151',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      margin: '0'
                    }}>Additional Notes</h4>
                  </div>
                  
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid #fde68a'
                  }}>
                    <p style={{
                      color: '#92400e',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>{viewingDocument.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    color: '#374151',
                    border: '1px solid #d1d5db'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                  onClick={() => {
                    closeViewModal();
                    handleUpdateDocument(viewingDocument);
                  }}
                >
                  <i className="fas fa-edit"></i>
                  Edit Document
                </button>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                  }}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete this ${viewingDocument.documentType} document? This action cannot be undone.`)) {
                      closeViewModal();
                      handleDeleteDocument(viewingDocument);
                    }
                  }}
                >
                  <i className="fas fa-trash"></i>
                  Delete Document
                </button>
                <button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                  }}
                  onClick={closeViewModal}
                >
                  <i className="fas fa-check"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailsModal; 