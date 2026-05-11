import "../assets/css/confirmModal.css";

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn secondary" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn primary" onClick={onConfirm}>
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;