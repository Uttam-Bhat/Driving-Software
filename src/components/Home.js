import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NewUserModal from './NewUserModal';
import UserDetailsModal from './UserDetailsModal';
import './Home.css';

function Home() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    // Simulate API call to search for user
    try {
      // This would be your actual API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          customerName: 'John Doe',
          contactNumber: mobileNumber,
          documentType: 'License',
          documentSubType: 'New',
          totalAmount: '5000',
          advancePayment: '3000',
          balance: '2000',
          applicationStatus: 'Pending',
          notes: 'Customer requested urgent processing'
        }), 1000)
      );
      
      setUserData(response);
      setIsUserDetailsModalOpen(true);
    } catch (error) {
      console.error('Error searching for user:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div className="home-container">
      <Header />
      <main className="main-content">
        <div className="search-container">
          <h2>Search by Mobile Number</h2>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <i className="fas fa-search"></i>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="new-user-container">
          <div className="new-user-box">
            <button 
              className="new-user-button"
              onClick={() => setIsNewUserModalOpen(true)}
            >
              <i className="fas fa-plus"></i>
              Add New User
            </button>
          </div>
        </div>
      </main>
      <Footer />
      
      <NewUserModal 
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
      />

      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        userData={userData}
      />
    </div>
  );
}

export default Home; 