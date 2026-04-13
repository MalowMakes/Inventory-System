import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [equipmentFormData, setEquipmentFormData] = useState({ name: '', description: '', currQuantity: '', maxQuantity: '', pricePerDay: '' });
  const [equipmentEditingId, setEquipmentEditingId] = useState(null);
  const [equipmentEditFormData, setEquipmentEditFormData] = useState({ name: '', description: '', currQuantity: '', maxQuantity: '', pricePerDay: '' });

  const [reservations, setReservations] = useState([]);
  //const [reservationFormData, setReservationFormData] = useState({ name: '', description: '', quantity: '', pricePerDay: '' });
  //const [reservationEditingId, setReservationEditingId] = useState(null);
  //const [reservationEditFormData, setReservationEditFormData] = useState({ name: '', description: '', quantity: '', pricePerDay: '' });

  // Fetch equipment data from Spring Boot
  const fetchEquipment = () => {
    axios.get('http://localhost:8080/api/equipment')
      .then(res => setEquipment(res.data))
      .catch(err => console.error(err));
  };

  // Initial equipment data fetch
  useEffect(() => { fetchEquipment(); }, []);

  // e - Handles the Form Submission
  const handleEquipmentSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/equipment', equipmentFormData)
      .then(() => {
        fetchEquipment(); // Refresh the list after adding
        setEquipmentFormData({ name: '', description: '', currQuantity: '', maxQuantity: '', pricePerDay: '' }); // Clear form
      })
      .catch(err => alert("Error adding item: " + err.response.data.message));
  };

  // id - Handles the Equipment Table Update
  const handleEquipmentUpdate = (id) => {
    axios.put(`http://localhost:8080/api/equipment/${id}`, equipmentEditFormData)
      .then(() => {
        setEquipmentEditingId(null); // Exit edit mode
        fetchEquipment();   // Refresh list
      })
      .catch(err => console.error(err));
  };

   // int - Handles the quanity modification in the Equipment Table Update
  const modifyEquipmentQuantity = (int) => {
    if (int === -1 && equipmentEditFormData.currQuantity <= 0) {
      Swal.fire("Invalid Operation", "Quantity cannot be negative.", "error");
      return; // Prevent decrementing below 0
    }
    setEquipmentEditFormData(prev => ({
      ...prev,
      currQuantity: Math.max(0, prev.currQuantity + int), 
      maxQuantity: Math.max(prev.maxQuantity + int) // Ensure quantity doesn't go negative
    }));
  };

  // id - Handles the EquipmentTable Delete
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
        axios.delete(`http://localhost:8080/api/equipment/${id}`)
          .then(() => {
            fetchEquipment();
          })
          .catch(err => Swal.fire('Error', err.response?.data?.message || 'Failed to delete equipment', 'error'));
      }
    });

  };

  // Fetch reservation data from Spring Boot
  const fetchReservations = () => {
    axios.get('http://localhost:8080/api/equipment/reservations')
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  }

  // Initial equipment data fetch
  useEffect(() => { fetchReservations(); }, []);

  // id - Handles the Reservation
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
        '<input id="swal-input1" class="swal2-input" placeholder="Your Name">' +
        '<input id="swal-input2" class="swal2-input" type="number" placeholder="Number of Days">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Reservation',
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const days = document.getElementById('swal-input2').value;
        if (!name || !days) {
          Swal.showValidationMessage('Please enter both name and days');
        }
        return { reserverName: name, days: parseInt(days) };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reservationParams = {
          customer: result.value.reserverName,
          days: result.value.days
        };
        axios.post(`http://localhost:8080/api/equipment/${id}/rent`, null, { params: reservationParams })
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
        axios.delete(`http://localhost:8080/api/equipment/reservations/${id}`)
          .then(() => {
            fetchEquipment();
            fetchReservations();
          })
          .catch(err => Swal.fire('Error', err.response?.data?.message || 'Failed to delete reservation', 'error'));
      }
    });
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto', fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: '80px' }}>Equipment Manager</h1>

      {/* EQUIPMENT FORM */}
      <form onSubmit={handleEquipmentSubmit} style={{ marginBottom: '50px', padding: '20px', background: '#343333', borderRadius: '8px' }}>
        <h3>Add New Equipment</h3>
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
      {/* EQUIPMENT TABLE */}
      <h2 style={{ marginBottom: '20px', marginTop: '80px'  }}>Equipment Table</h2>
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
            <tr><td colSpan="5">No equipment found.</td></tr>
          ) : (
            equipment
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(item => (
                <tr key={item.id}>
                  {equipmentEditingId === item.id ? (
                    <>
                      {/* EDITING ROW */}
                      <td><input value={equipmentEditFormData.name} onChange={e => setEquipmentEditFormData({ ...equipmentEditFormData, name: e.target.value })} /></td>
                      <td><input value={equipmentEditFormData.description} onChange={e => setEquipmentEditFormData({ ...equipmentEditFormData, description: e.target.value })} /></td>
                      <td>
                        {equipmentEditFormData.currQuantity} / {equipmentEditFormData.maxQuantity} <br></br>
                        <button onClick={() => modifyEquipmentQuantity(1)} style={{ color: 'green' }}>+1</button>
                        <button onClick={() => modifyEquipmentQuantity(-1)} style={{ color: 'red' }}>-1</button>
                      </td>
                      <td>Status</td>
                      <td><input type="number" value={equipmentEditFormData.pricePerDay} onChange={e => setEquipmentEditFormData({ ...equipmentEditFormData, pricePerDay: parseFloat(e.target.value) })} /></td>
                      <td>
                        <button onClick={() => handleEquipmentUpdate(item.id)}>Save</button>
                        <button onClick={() => setEquipmentEditingId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* NORMAL ROW */}
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.currQuantity} / {item.maxQuantity}</td>
                      <td>Status</td>
                      <td>${item.pricePerDay}</td>
                      <td>
                        <button onClick={() => {
                          setEquipmentEditingId(item.id);
                          setEquipmentEditFormData(item);
                        }}>Edit</button>
                        <button onClick={() => handleEquipmentDelete(item.id)} style={{ color: 'red' }}>Delete</button>
                        <button onClick={() => handleReservation(item.id)} style={{ color: 'blue' }}>Reserve</button>
                      </td>
                    </>
                  )}
                </tr>
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
            <th>Actions</th>
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
                  <td>
                    <button onClick={() => handleReservationDelete(item.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App