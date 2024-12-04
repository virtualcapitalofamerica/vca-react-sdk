import React, { useEffect, useState } from 'react';

import { Paper, TextField, Typography, Button } from '@mui/material';
import { VcaLayout } from '../../shared/layouts/VcaLayout';

import { CreditCardManagementService } from '@services';

import visaLogo from '@assets/visa-logo.svg';
import mastercardLogo from '@assets/mastercard-logo.svg';
import amexLogo from '@assets/amex-logo.svg';
import cvcLogo from '@assets/cvc-logo.svg';

async function createEntity({ Service, payload, apiKey, environment = 'production' }) {
  const entityService = new Service({ apiKey, settings: { environment } });
  const entityResponse = await entityService.create(payload);

  return entityResponse;
}

async function emitEvent({ payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action: 'credit-card::created', namespace: 'vca', payload, error });
  }
}

const initialState = {
  identity: '',
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  cardHolderName: '',
};

export const VcaCreditCardCreate = ({ entity, onEvent, environment = 'production', apiKey = '', isPopupContext = false }) => {
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

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      const response = await createEntity({ payload: creditCardData, Service: CreditCardManagementService, environment, apiKey });

      // Update parent states
      setIsLoading(false);

      emitEvent({ payload: response, error: null, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      emitEvent({ payload: null, error, eventHandler: onEvent });
      if (setIsOpen) {
        setIsOpen(false);
      }
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
      <VcaLayout isPopupContext={isPopupContext}>
        <Paper className="container-fluid mb-0">
          <section className="p-4">
            <header className="d-flex justify-content-center mt-2 mb-3 ">
              <Typography variant="h6" className="text-center">
                Verify your payment method
              </Typography>
            </header>

            <section>
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
                            <img src={visaLogo} alt="Visa" className="me-1" />
                            <img src={mastercardLogo} alt="MasterCard" className="me-1" />
                            <img src={amexLogo} alt="Amex" className="me-1" />
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
                        endAdornment: (
                          <div className="d-flex align-items-end">
                            <img src={cvcLogo} alt="CVC" className="me-1" />
                          </div>
                        ),
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
                <footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {isLoading && (
                    <button type="button" disabled className="btn btn-primary">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                      Continue
                    </Button>
                  )}
                </footer>
              </form>
            </section>
          </section>
        </Paper>
      </VcaLayout>
    </>
  );
};
