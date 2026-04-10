import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', quantity: '', pricePerDay: '' });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '', quantity: '', pricePerDay: '' });

  // 1. Fetch data from Spring Boot
  const fetchEquipment = () => {
    axios.get('http://localhost:8080/api/equipment')
      .then(res => setEquipment(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchEquipment(); }, []);

  // e - Handles the Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/equipment', formData)
      .then(() => {
        fetchEquipment(); // Refresh the list after adding
        setFormData({ name: '', description: '', quantity: '', pricePerDay: '' }); // Clear form
      })
      .catch(err => alert("Error adding item: " + err.response.data.message));
  };

  // id - Handles the Table Update
  const handleUpdate = (id) => {
    axios.put(`http://localhost:8080/api/equipment/${id}`, editFormData)
      .then(() => {
        setEditingId(null); // Exit edit mode
        fetchEquipment();   // Refresh list
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this item?")) {
    axios.delete(`http://localhost:8080/api/equipment/${id}`)
      .then(() => {
        fetchEquipment(); 
      })
      .catch(err => console.error("Could not delete:", err));
  }
};

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'system-ui' }}>
      <h1>Equipment Manager</h1>

      {/* Equipment Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', background: '#343333', borderRadius: '8px' }}>
        <h3>Add New Equipment</h3>
        <input
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Price/Day"
          value={formData.pricePerDay}
          onChange={e => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
        />
        <button type="submit">Add to Inventory</button>
      </form>

      {/* DATA TABLE */}
      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#333', color: '#fff' }}>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price/Day</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map(item => (
            <tr key={item.id}>
              {editingId === item.id ? (
                <>
                  {/* EDITING ROW */}
                  <td><input value={editFormData.name} onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} /></td>
                  <td><input value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} /></td>
                  <td><input type="number" value={editFormData.quantity} onChange={e => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) })} /></td>
                  <td><input type="number" value={editFormData.pricePerDay} onChange={e => setEditFormData({ ...editFormData, pricePerDay: parseFloat(e.target.value) })} /></td>
                  <td>
                    <button onClick={() => handleUpdate(item.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  {/* NORMAL ROW */}
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.pricePerDay}</td>
                  <td>
                    <button onClick={() => {
                      setEditingId(item.id);
                      setEditFormData(item);
                    }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App