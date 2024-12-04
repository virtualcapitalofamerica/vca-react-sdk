import React, { useEffect, useState } from 'react';

import { Paper, TextField, Typography, Button } from '@mui/material';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';

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

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'vca', payload, error });
  }
}

const initialState = {
  identity: '',
  card_number: '',
  expiry_date: '',
  cvc: '',
  cardholder_name: '',
  is_default: true,
};

export const VcaCreditCardCreate = ({
  entity,
  onEvent,
  environment = 'production',
  apiKey = '',
  setIsOpen,
  isPopupContext = false,
}) => {
  // UI States
  const [isLoading, setIsLoading] = useState(false);

  // Models
  const [creditCardData, setCreditCardData] = useState(initialState);

  // Hooks
  const { errors: formErrors, getCardImageProps, getCardNumberProps, getExpiryDateProps, getCVCProps, meta } = usePaymentInputs();
  const { erroredInputs, touchedInputs } = meta;

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

    if (!creditCardData.card_number || !creditCardData.expiry_date || !creditCardData.cvc || !creditCardData.cardholder_name) {
      return false;
    }

    if (meta.erroredInputs.cardNumber || meta.erroredInputs.expiryDate || meta.erroredInputs.cvc) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setIsLoading(true);

      const response = await createEntity({ payload: creditCardData, Service: CreditCardManagementService, environment, apiKey });

      if (!entityResponse || !entityResponse.success) {
        emitEvent({ action: 'vca-credit-card::error', error: entityResponse, eventHandler: onEvent });
        return null;
      }

      emitEvent({ action: 'vca-credit-card::created', payload: response, error: null, eventHandler: onEvent });

      if (setIsOpen) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      emitEvent({ action: 'vca-credit-card::error', payload: null, error, eventHandler: onEvent });
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
        <section className="mb-0">
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
                    type="tel"
                    inputMode="numeric"
                    id="card-number-input"
                    label="Card number"
                    value={creditCardData.name}
                    placeholder="0000 0000 0000 0000"
                    InputProps={{
                      endAdornment: (
                        <div className="d-flex align-items-center">
                          {meta.cardType ? (
                            <svg
                              {...getCardImageProps({ images })}
                              style={{ marginRight: '8px', width: '24px', height: '16px' }}
                            />
                          ) : (
                            <>
                              <img src={visaLogo} alt="Visa" className="me-1" style={{ width: '24px' }} />
                              <img src={mastercardLogo} alt="MasterCard" className="me-1" style={{ width: '24px' }} />
                              <img src={amexLogo} alt="Amex" className="me-1" style={{ width: '24px' }} />
                            </>
                          )}
                        </div>
                      ),
                    }}
                    inputRef={getCardNumberProps().ref}
                    {...getCardNumberProps({
                      refKey: 'inputRef',
                      onChange: (e) => handleDataChange('card_number', e.target.value),
                    })}
                    error={(erroredInputs.cardNumber && touchedInputs.cardNumber) || !!formErrors?.payment?.cardnumber?.message}
                    helperText={
                      (erroredInputs.cardNumber && touchedInputs.cardNumber && erroredInputs.cardNumber) ||
                      formErrors?.payment?.cardnumber?.message
                    }
                    required
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
                    value={creditCardData.expiry_date}
                    placeholder="MM/YY"
                    required
                    {...getExpiryDateProps({
                      refKey: 'inputRef',
                      onChange: (e) => handleDataChange('expiry_date', e.target.value),
                    })}
                    inputRef={getExpiryDateProps().ref}
                    error={(erroredInputs.expiryDate && touchedInputs.expiryDate) || !!formErrors?.payment?.expiry?.message}
                    helperText={
                      (erroredInputs.expiryDate && touchedInputs.expiryDate && erroredInputs.expiryDate) ||
                      formErrors?.payment?.expiry?.message
                    }
                  />
                </section>
                <section className="mb-3 col-12 col-md-6">
                  <TextField
                    className="w-100"
                    type="text"
                    inputMode="numeric"
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
                    {...getCVCProps({
                      refKey: 'inputRef',
                      onChange: (e) => handleDataChange('cvc', e.target.value),
                    })}
                    error={(erroredInputs.cvc && touchedInputs.cvc) || !!formErrors?.payment?.ccv?.message}
                    helperText={
                      (erroredInputs.cvc && touchedInputs.cvc && erroredInputs.cvc) || formErrors?.payment?.ccv?.message
                    }
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
                    value={creditCardData.cardholder_name}
                    placeholder="Jhon Doe"
                    required
                    onChange={(event) => handleDataChange('cardholder_name', event.target.value)}
                    error={!!formErrors?.payment?.accountHolderName?.message}
                    helperText={formErrors?.payment?.accountHolderName?.message || `Enter cardholder's full name`}
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
      </VcaLayout>
    </>
  );
};
