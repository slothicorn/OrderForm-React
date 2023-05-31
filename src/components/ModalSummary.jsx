import './ModalSummary.css';
import PropTypes from 'prop-types';

const ModalSummary = ({ show, onConfirm }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <div className="modal">
        <div className="modal__content">
          <div className="modal__header">
            <h2 className="modal__title">Shrnutí objednávky</h2>
          </div>
          <div className="modal__body">modal content</div>
          <div className="modal__footer">
            <button
              className="modal__button btn"
              onClick={onConfirm}>
              Objednat a zaplatit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalSummary.propTypes = {
  show: PropTypes.bool,
  onConfirm: PropTypes.func,
};

export default ModalSummary;
