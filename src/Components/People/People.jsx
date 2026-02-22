import { useState, useEffect } from "react"
import { ASSET_PATHS } from '../../constants/assets';
import "../../styles/People.css";

export default function People({ people, setPeople, billItems, onClearAll }) {
  const [newPerson, setNewPerson] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingId && !event.target.closest('.edit-input')) {
        setEditingId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId]);

  function validatePersonName(name) {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError("Person name cannot be empty");
      return false;
    }
    
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    
    if (people.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError("This person already exists");
      return false;
    }
    
    return true;
  }

  function handleAddPeople(e) {
    e.preventDefault();
    setError("");

    if (!validatePersonName(newPerson)) {
      return;
    }

    const newPersonObj = {
      id: Date.now(),
      name: newPerson.trim()
    };

    setPeople([...people, newPersonObj])
    setNewPerson("");

  }

  function handleEditPerson(id, newName) {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError("Person name cannot be empty");
      return;
    }
    
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    
    if (people.some(p => p.id !== id && p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError("This person already exists");
      return;
    }
    
    setError("");
    setPeople(people.map(person =>
      person.id === id ? { ...person, name: trimmedName } : person
    ));
  }

  function handleRemovePerson(id) {
    setPeople(people.filter(person => person.id !== id));
  }

  return (
    <div className="people-card">
      <div>
        <h3 className="card-title"><img src={ASSET_PATHS.USERS_ICON} alt="user" className="logo" /> People <span className="text-muted">({people.length})</span> </h3>
      </div>
      <p className="card-subtitle">Add people to split the bill</p>

      <form onSubmit={handleAddPeople} className="people-form">
        <input
          className={`inputfield ${error ? 'input-error' : ''}`}
          type="text"
          placeholder="Enter person's name"
          value={newPerson}
          onChange={(e) => {
            setNewPerson(e.target.value);
            if (error) setError("");
          }}
        />
        <button className="btn-add-person" type="submit">+ Add Person</button>
      </form>
      {error && <div className="error-message" role="alert">{error}</div>}

      <button 
        className="btn-clear"
        onClick={onClearAll}
        disabled={billItems?.length === 0}
        title="Clear all items"
        aria-label="Clear all bill items"
      >
       <img src={ASSET_PATHS.TRASH_ICON} alt="remove" className="btn-icon" /> Clear All
      </button>

      <div className="people-list">
        {people.length > 0 ? (
          people.map((person) => (
            <div className="person-item" key={person.id}>
              {editingId === person.id ? (
                <input
                  className="inputfield edit-input"
                  type="text"
                  defaultValue={person.name}
                  onBlur={(e) => { handleEditPerson(person.id, e.target.value); setEditingId(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleEditPerson(person.id, e.target.value); setEditingId(null); } }}
                  autoFocus
                />
              ) : (
                <div style={{ flex: 1 }} onClick={() => setEditingId(person.id)}>
                  <span className="font-medium">{person.name}</span>
                </div>
              )}

              <button className="btn-delete" onClick={() => handleRemovePerson(person.id)} aria-label="Remove person"><img src={ASSET_PATHS.TRASH_ICON} alt="remove" className="btn-icon" /></button>
            </div>
          ))
        ) : (
          <div className="empty-state-people">
            <img src={ASSET_PATHS.USERS_ICON} alt="no people" className="empty-icon" />
            <p>No people added yet.</p>
            <p className="empty-state-hint">Add people above to start splitting bills</p>
          </div>
        )}
      </div>
    </div>
  )
}