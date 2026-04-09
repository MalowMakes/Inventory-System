import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: 0, pricePerDay: 0 });

  // 1. Fetch data from Spring Boot
  const fetchEquipment = () => {
    axios.get('http://localhost:8080/api/equipment')
      .then(res => setEquipment(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchEquipment(); }, []);

  // 2. Handle the Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/equipment', formData)
      .then(() => {
        fetchEquipment(); // Refresh the list after adding
        setFormData({ name: '', quantity: 0, pricePerDay: 0 }); // Clear form
      })
      .catch(err => alert("Error adding item: " + err.response.data.message));
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'system-ui' }}>
      <h1>Equipment Manager</h1>

      {/* Equipment Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#f4f4f4', borderRadius: '8px' }}>
        <h3>Add New Equipment</h3>
        <input 
          placeholder="Name" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Qty" 
          value={formData.quantity}
          onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
        />
        <input 
          type="number" 
          placeholder="Price/Day" 
          value={formData.pricePerDay}
          onChange={e => setFormData({...formData, pricePerDay: parseFloat(e.target.value)})} 
        />
        <button type="submit">Add to Inventory</button>
      </form>

      {/* DATA TABLE */}
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price/Day</th>
          </tr>
        </thead>
        <tbody>
          {equipment.length === 0 ? <tr><td colSpan="3">No inventory found.</td></tr> : 
            equipment.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.pricePerDay}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default App