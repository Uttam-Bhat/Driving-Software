import React, { useState, useEffect } from 'react';
import CustomerDocuments from './CustomerDocuments';
import './NewUserModal.css';

function UserDetailsModal({ isOpen, onClose, userData }) {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    documentType: '',
    documentSubType: '',
    totalAmount: '',
    advancePayment: '',
    balance: '',
    applicationStatus: '',
    notes: '',
    isFullyPaid: false
  });

  const [documents, setDocuments] = useState([]);
  const [documentSubTypes, setDocumentSubTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        ...userData,
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
          applicationStatus: 'Pending'
        },
        {
          documentType: 'Insurance',
          documentSubType: 'New',
          totalAmount: '3000',
          advancePayment: '3000',
          balance: '0',
          applicationStatus: 'Completed'
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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
        
        <div className="customer-info">
          <h2>{formData.customerName}</h2>
          <div className="contact-info">
            <i className="fas fa-phone"></i>
            {formData.contactNumber}
          </div>
        </div>

        {!isEditing ? (
          <CustomerDocuments 
            documents={documents}
            onUpdateDocument={handleUpdateDocument}
          />
        ) : (
          <form onSubmit={handleSubmit} className="new-user-form">
            <h3>Update Document Details</h3>
            
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

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
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
  );
}

export default UserDetailsModal; 