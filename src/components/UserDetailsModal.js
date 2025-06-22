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
  const [activeTab, setActiveTab] = useState('overview');

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
      setIsEditing(false);
      // Update the documents list with the new data
      setDocuments(prev => prev.map(doc => 
        doc.documentType === formData.documentType ? formData : doc
      ));
    } catch (error) {
      console.error('Error updating form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDocument = (doc) => {
    setFormData(doc);
    setIsEditing(true);
    setActiveTab('edit');
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
        
        {/* Customer Header Section */}
        <div className="customer-header">
          <div className="customer-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="customer-info">
            <h2>{formData.customerName}</h2>
            <div className="customer-meta">
              <span className="contact-info">
                <i className="fas fa-phone"></i>
                {formData.contactNumber}
              </span>
              <span className="customer-id">
                <i className="fas fa-id-card"></i>
                ID: {formData.contactNumber}
              </span>
            </div>
          </div>
          <div className="customer-status">
            <div className={`status-indicator ${getTotalBalance() <= 0 ? 'paid' : 'pending'}`}>
              <i className={`fas ${getTotalBalance() <= 0 ? 'fa-check-circle' : 'fa-clock'}`}></i>
              {getTotalBalance() <= 0 ? 'Fully Paid' : 'Payment Pending'}
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

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-th-large"></i>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-file-alt"></i>
            Documents ({getTotalDocuments()})
          </button>
          <button 
            className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
            disabled={!isEditing}
          >
            <i className="fas fa-edit"></i>
            Edit
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{formData.customerName}</span>
                  </div>
                  <div className="info-item">
                    <label>Contact Number</label>
                    <span>{formData.contactNumber}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Address</label>
                    <span>{formData.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="overview-section">
                <h3>Payment Summary</h3>
                <div className="payment-summary">
                  <div className="payment-item">
                    <span>Total Amount</span>
                    <span className="amount">₹{getTotalAmount().toLocaleString()}</span>
                  </div>
                  <div className="payment-item">
                    <span>Amount Paid</span>
                    <span className="amount paid">₹{getTotalPaid().toLocaleString()}</span>
                  </div>
                  <div className="payment-item total">
                    <span>Balance Due</span>
                    <span className={`amount ${getTotalBalance() <= 0 ? 'paid' : 'pending'}`}>
                      ₹{getTotalBalance().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && !isEditing && (
            <CustomerDocuments 
              documents={documents}
              onUpdateDocument={handleUpdateDocument}
            />
          )}

          {activeTab === 'edit' && isEditing && (
            <form onSubmit={handleSubmit} className="edit-form">
              <h3>Update Document Details</h3>
              
              <div className="form-section">
                <h4>Document Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Document Type <span className="required">*</span></label>
                    <select
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Document Type</option>
                      <option value="License">License</option>
                      <option value="Insurance">Insurance</option>
                      <option value="RC">RC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Document Sub Type <span className="required">*</span></label>
                    <select
                      name="documentSubType"
                      value={formData.documentSubType}
                      onChange={handleChange}
                      required
                      disabled={!formData.documentType}
                    >
                      <option value="">Select Sub Type</option>
                      {documentSubTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Payment Information</h4>
                <div className="form-row">
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
                    <label>Advance Payment <span className="required">*</span></label>
                    <input
                      type="number"
                      name="advancePayment"
                      value={formData.advancePayment}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Balance</label>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      readOnly
                      className="readonly"
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
              </div>

              <div className="form-section">
                <h4>Additional Information</h4>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter any additional notes..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setActiveTab('overview');
                  }}
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
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal; 