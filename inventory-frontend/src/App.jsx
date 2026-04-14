import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import React from 'react';
import api from './api';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [equipmentFormData, setEquipmentFormData] = useState({ name: '', description: '', currQuantity: '', maxQuantity: '', pricePerDay: '', category: 'Miscellaneous', });
  const [reservations, setReservations] = useState([]);
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || 'User');
  const role = localStorage.getItem('role');

  useEffect(() => {
    // Check if a token exists on refresh
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setFirstName(localStorage.getItem('firstName'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  // Fetch equipment data from Spring Boot
  const fetchEquipment = () => {
    api.get('/equipment')
      .then(res => setEquipment(res.data))
      .catch(err => console.error(err));
  };

  // Initial equipment data fetch
  useEffect(() => { fetchEquipment(); }, []);

  // Fetch reservation data from Spring Boot
  const fetchReservations = () => {
    api.get('/equipment/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  }

  // Initial reservation data fetch
  useEffect(() => { fetchReservations(); }, []);

  // Handles the new equipment form submission
  const handleEquipmentSubmit = (e) => {
    e.preventDefault();
    api.post('/equipment', equipmentFormData)
      .then(() => {
        fetchEquipment(); // Refresh the list after adding
        setEquipmentFormData({ name: '', description: '', currQuantity: '', maxQuantity: '', pricePerDay: '', category: 'Miscellaneous' }); // Clear form
      })
      .catch(err => alert("Error adding item: " + err.response.data.message));
  };

  // Handles the Equipment Table Update
  const handleEquipmentUpdate = (id, data) => {
    api.put(`/equipment/${id}`, data)
      .then(() => {
        fetchEquipment();   // Refresh list
        Swal.fire('Saved!', 'Equipment updated successfully.', 'success');
      })
      .catch(err => console.error(err));
  };

  const equipmentUpdate = (item) => {
    Swal.fire({
      title: `Edit ${item.name}`,
      width: '1200px',
      html: `
        <div style="text-align: left; width: 80%; margin: 0 auto;">
      
        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Equipment Name</label>
          <input id="swal-input1" class="swal2-input" style="width: 100%; margin: 0;" value="${item.name}">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Category</label>
          <input id="swal-input2" class="swal2-input" style="width: 100%; margin: 0;" value="${item.category || ''}" placeholder="e.g. Lighting">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Description</label>
          <input id="swal-input3" class="swal2-input" style="width: 100%; margin: 0;" value="${item.description || ''}">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Maximum Quantity</label>
          <input id="swal-input4" class="swal2-input" style="width: 100%; margin: 0;" value="${item.maxQuantity || ''}">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; font-weight: bold; margin-bottom: 5px;">Price per Day</label>
          <input id="swal-input5" class="swal2-input" style="width: 100%; margin: 0;" value="${item.pricePerDay || ''}">
        </div>

        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Apply Changes',
      preConfirm: () => {
        const maxQuantity = parseInt(document.getElementById('swal-input4').value);
        const quantChange = item.maxQuantity - maxQuantity;
        if (item.currQuantity - quantChange < 0) {
          Swal.showValidationMessage('New maximum quantity would result in negative current quantity.');
          return;
        }
        return {
          id: item.id,
          name: document.getElementById('swal-input1').value,
          category: document.getElementById('swal-input2').value,
          description: document.getElementById('swal-input3').value,
          currQuantity: item.currQuantity - quantChange, // Adjust current quantity based on change to max
          maxQuantity: maxQuantity,
          pricePerDay: document.getElementById('swal-input5').value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleEquipmentUpdate(item.id, result.value);
      }
    });
  }

  // Handles the EquipmentTable Delete
  const handleEquipmentDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This equipment will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef1010',
      cancelButtonColor: 'rgb(129, 120, 120)',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`equipment/${id}`)
          .then(() => {
            fetchEquipment();
          })
          .catch(err => Swal.fire('Error', err.response?.data?.message || 'Failed to delete equipment', 'error'));
      }
    });

  };

  // Handles the Reservation
  const handleReservation = (id) => {
    // Check if the item is in stock before making a reservation
    const item = equipment.find(e => e.id === id);
    if (item.quantity <= 0) {
      Swal.fire("Out of Stock", "There are no units available to reserve.", "error");
      return; // Prevent reservation if out of stock
    }

    // Show a SweetAlert2 form to get reservation details
    Swal.fire({
      title: `Reserve ${item.name}`,
      html:
        //'<input id="swal-input1" class="swal2-input" placeholder="Your Name">' +
        '<input id="swal-input2" class="swal2-input" type="number" placeholder="Number of Days">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Reservation',
      preConfirm: () => {
        const name = firstName
        const days = document.getElementById('swal-input2').value;
        if (!name || !days) {
          Swal.showValidationMessage('Please enter both name and days');
        }
        if (days > 7) {
          Swal.showValidationMessage('You may only reserve for up to 7 days');
        }
        return { reserverName: name, days: parseInt(days) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reservationParams = {
          customer: result.value.reserverName,
          days: result.value.days
        };
        api.post(`equipment/${id}/rent`, null, { params: reservationParams })
          .then(() => {
            Swal.fire('Reserved!', 'Your equipment is reserved.', 'success');
            fetchEquipment(); // Refresh the tables
            fetchReservations();
          })
          .catch(err => Swal.fire('Error', err.response?.data?.message || 'Failed to reserve', 'error'));
      }
    });
  };

  const handleReservationDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This reservation will be deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef1010',
      cancelButtonColor: 'rgb(129, 120, 120)',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`equipment/reservations/${id}`)
          .then(() => {
            fetchEquipment();
            fetchReservations();
          })
          .catch(err => Swal.fire('Error', err.response?.data?.message || 'Failed to delete reservation', 'error'));
      }
    });
  };

  const groupedEquipment = (equipment || []).reduce((groups, item) => {
    const cat = item.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
    return groups;
  }, {});

  const categoryKeys = Object.keys(groupedEquipment).sort();

  return (
    <div className="container">
      {!isAuthenticated ? (
        <Login setAuth={setIsAuthenticated} setFirstName={setFirstName}/>
      ) : (
        <>
          <div className="login-header">
            <h1 style={{ marginBottom: '40px' }}>Welcome, {firstName}!</h1>
            <button onClick={handleLogout} style={{ fontSize: '24px' }}>Logout</button>
          </div>
          <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto', fontFamily: 'system-ui' }}>
             {role === 'ROLE_ADMIN' && (<div className='form-group'>
              {/* EQUIPMENT FORM */}
              <form onSubmit={handleEquipmentSubmit} style={{ marginBottom: '50px', padding: '20px', background: '#343333', borderRadius: '8px' }}>
                <h2>Add New Equipment</h2>
                <input
                  placeholder="Name"
                  value={equipmentFormData.name}
                  onChange={e => setEquipmentFormData({ ...equipmentFormData, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Description"
                  value={equipmentFormData.description}
                  onChange={e => setEquipmentFormData({ ...equipmentFormData, description: e.target.value })}
                />
                <input
                  placeholder="Category"
                  value={equipmentFormData.category}
                  onChange={e => setEquipmentFormData({ ...equipmentFormData, category: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={equipmentFormData.currQuantity}
                  onChange={e =>
                    setEquipmentFormData({ ...equipmentFormData, currQuantity: parseInt(e.target.value), maxQuantity: parseInt(e.target.value) })
                  }
                />
                <input
                  type="number"
                  placeholder="Price/Day"
                  value={equipmentFormData.pricePerDay}
                  onChange={e => setEquipmentFormData({ ...equipmentFormData, pricePerDay: parseFloat(e.target.value) })}
                />
                <button type="submit">Add to Inventory</button>
              </form>
            </div>)}

            {/* EQUIPMENT TABLE */}
            <h2 style={{ marginBottom: '20px', marginTop: '20px' }}>Equipment Table</h2>
            <table border="1" width="100%" style={{ borderCollapse: 'collapse', marginBottom: '30px' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Price/Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.length === 0 ? (
                  <tr><td colSpan="6">No equipment found.</td></tr>
                ) : (
                  categoryKeys.map((category) => (
                    <React.Fragment key={category}>
                      {/* Category Header Row */}
                      <tr style={{ backgroundColor: '#333', color: '#fff' }}>
                        <td colSpan="6"><strong>{category.toUpperCase()}</strong></td>
                      </tr>

                      {/* Items in this category */}
                      {groupedEquipment[category]
                        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                        .map((item) => (
                          <tr key={item.id}>
                            {
                              <>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.currQuantity} / {item.maxQuantity}</td>
                                <td>{item.status}</td>
                                <td>${item.pricePerDay}</td>
                                <td>
                                  {role === 'ROLE_ADMIN' && (<button onClick={() => equipmentUpdate(item)} style={{ color: 'orange' }}>Edit</button>)}
                                  {role === 'ROLE_ADMIN' && (<button onClick={() => handleEquipmentDelete(item.id)} style={{ color: 'red' }}>Delete</button>)}
                                  <button onClick={() => handleReservation(item.id)} style={{ color: 'purple' }}>Reserve</button>
                                </td>
                              </>
                            }
                          </tr>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>

            {/* RESERVATION TABLE */}
            <h2 style={{ marginBottom: '20px', marginTop: '80px' }}>Reservation Table</h2>
            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
                  <th>User</th>
                  <th>Item</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  {role === 'ROLE_ADMIN' && (<th>Actions</th>)}
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr><td colSpan="5">No reservations found.</td></tr>
                ) : (
                  reservations
                    .slice()
                    .sort((a, b) => a.endDate.localeCompare(b.endDate))
                    .map(item => (
                      <tr key={item.id}>
                        <td>{item.customerName}</td>
                        <td>{item.equipment.name}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        {role === 'ROLE_ADMIN' && (<td>
                           <button onClick={() => handleReservationDelete(item.id)} style={{ color: 'red' }}>Delete</button>
                        </td>)}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default App