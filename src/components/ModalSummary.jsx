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
            <div className="modal__detailWrapper">
              <div>Jméno:</div>
              <div>{submitData.firstName}</div>
            </div>
            <div className="modal__detailWrapper">
              <div>Příjmení:</div>
              <div>{submitData.lastName}</div>
            </div>
            <div className="modal__detailWrapper">
              <div>E-mail:</div>
              <div>{submitData.email}</div>
            </div>
            <div className="modal__detailWrapper">
              <div>K zaplacení:</div>
              <div>
                {totalPriceWithVAT} {selectedCurrency}
              </div>
            </div>
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
  totalPriceWithVAT: PropTypes.string,
  selectedCurrency: PropTypes.string,
};

export default ModalSummary;
