import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TextField, Typography, Button } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

const Container = styled.article`
  width: ${(props) => (props.$isPopup ? '800px' : '100%')};
  ${(props) => (props.$isPopup ? '' : 'flex-grow: 1;')};

  @media (max-width: 1199px) {
    width: ${(props) => (props.$isPopup ? '700px' : '100%')};
  }

  @media (max-width: 991px) {
    width: ${(props) => (props.$isPopup ? '600px' : '100%')};
  }

  @media (max-width: 767px) {
    width: ${(props) => (props.$isPopup ? '500px' : '100%')};
  }

  @media (max-width: 575px) {
    width: ${(props) => (props.$isPopup ? '100%' : '100%')};
  }
`;

const initialState = {
  identity: '',
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  cardHolderName: '',
};

export const VcaCreditCardForm = ({
  entity,
  itemOnAction,
  onUpdatedEntity,
  debug = false,
  apiKey = '',
  isPopupContext = false,
}) => {
  // UI States
  const [isLoading, setIsLoading] = useState(false);

  // Models
  const [creditCardData, setCreditCardData] = useState(initialState);

  const handleDataChange = (fieldName, data) => {
    setCreditCardData((prevUserData) => ({
      ...prevUserData,
      [fieldName]: data,
    }));
  };

  const canSubmit = () => {
    if (!entity || !entity?.identity) {
      return false;
    }

    // TODO: Add validations

    return true;
  };

  const handleSubmit = () => {
    if (itemOnAction) {
      itemOnAction('vca-credit-card-form-done', null);
    }
  };

  // Update form data with the provided entity on load
  useEffect(() => {
    if (entity) {
      setIsLoading(false);

      handleDataChange('identity', entity?.identity);
    }
  }, [entity]);

  return (
    <>
      <Container $isPopup={isPopupContext} className={!isPopupContext ? 'col-12' : ''}>
        <div className="card mb-0">
          <div className="card-body">
            <header className="d-flex justify-content-center mt-2 mb-3 ">
              <Typography variant="h6" className="text-center">
                Verify your payment method
              </Typography>
            </header>

            <form onSubmit={handleSubmit}>
              <article className="row">
                <section className="mb-3 col-12">
                  <TextField
                    className="w-100"
                    type="text"
                    inputmode="numeric"
                    id="card-number-input"
                    label="Card number"
                    value={creditCardData.name}
                    placeholder="0000 0000 0000 0000"
                    helperText=""
                    InputProps={{
                      endAdornment: (
                        <div className="d-flex align-items-center">
                          <img
                            src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                            alt="Visa"
                            className="me-1"
                          />
                          <img
                            src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                            alt="MasterCard"
                            className="me-1"
                          />
                          <img
                            src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg"
                            alt="Amex"
                            className="me-1"
                          />
                        </div>
                      ),
                    }}
                    required
                    onChange={(event) => {
                      handleDataChange('cardNumber', event.target.value);
                    }}
                    autoComplete="off"
                  />
                </section>
              </article>
              <article className="row">
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="w-100"
                    type="text"
                    id="expiry-date-input"
                    label="Expiry Date (MM/YY)"
                    value={creditCardData.expiryDate}
                    placeholder="MM/YY"
                    required
                    onChange={(event) => handleDataChange('expiryDate', event.target.value)}
                  />
                </section>
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="w-100"
                    type="text"
                    inputmode="numeric"
                    id="cvc-input"
                    label="CVC"
                    value={creditCardData.cvc}
                    placeholder="123"
                    InputProps={{
                      endAdornment: <InfoOutlined />,
                    }}
                    required
                    onChange={(event) => handleDataChange('cvc', event.target.value)}
                  />
                </section>
              </article>
              <article className="row">
                <section className="mb-3 col-12">
                  <TextField
                    className="w-100"
                    type="text"
                    id="card-holder-name-input"
                    label="Card Holder Name"
                    value={creditCardData.cardHolderName}
                    placeholder="Jhon Doe"
                    helperText="Enter cardholder's full name"
                    required
                    onChange={(event) => handleDataChange('cardHolderName', event.target.value)}
                  />
                </section>
              </article>

              {/* Submit button */}
              <footer className="d-flex justify-content-end">
                {isLoading && (
                  <button type="button" disabled className="btn btn-primary">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </button>
                )}

                {!isLoading && (
                  <Button
                    type="button"
                    variant="contained"
                    className="my-2"
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    sx={{
                      backgroundColor: !canSubmit() ? '#a0a0a0' : '#323a46',
                      borderColor: !canSubmit() ? '#a0a0a0' : '#323a46',
                      '&:hover': {
                        backgroundColor: !canSubmit() ? '#a0a0a0' : '#404651',
                        borderColor: !canSubmit() ? '#a0a0a0' : '#404651',
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </footer>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};
