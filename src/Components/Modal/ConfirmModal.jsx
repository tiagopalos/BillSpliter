import '../../styles/Modal.css';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="presentation">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close" 
            onClick={onCancel}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className={`modal-btn ${isDangerous ? 'modal-btn-danger' : 'modal-btn-confirm'}`}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {isDangerous ? 'Yes, Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
