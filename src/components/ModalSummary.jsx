import './ModalSummary.css';
import PropTypes from 'prop-types';

const ModalSummary = ({
  show,
  onConfirm,
  submitData,
  totalPriceWithVAT,
  selectedCurrency,
}) => {
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
          <div className="modal__body">
            <div>{`Jméno: ${submitData.firstName}`}</div>
            <div>{`Příjmení: ${submitData.lastName}`}</div>
            <div>{`E-mail: ${submitData.email}`}</div>
            <div>{`Celkem k zaplacení: ${totalPriceWithVAT} ${selectedCurrency}`}</div>
          </div>
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
  submitData: PropTypes.object,
  totalPriceWithVAT: PropTypes.number,
  selectedCurrency: PropTypes.string,
};

export default ModalSummary;
