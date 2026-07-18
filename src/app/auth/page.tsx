'use client';

import { CodeStep } from 'modules/auth/ui/code-step';
import { PhoneStep } from 'modules/auth/ui/phone-step';
import { WelcomeStep } from 'modules/auth/ui/welcome-step';
import { JSX, useState } from 'react';

type Step = 1 | 2 | 3;

const RegisterPage = (): JSX.Element => {
  const [step, setStep] = useState<Step>(1);
  const [confirmedPhone, setConfirmedPhone] = useState<string>('');

  const handlePhoneConfirmed = (phone: string): void => {
    setConfirmedPhone(phone);
  };
  const nextStep = (): void => {
    if (step < 3) {
      setStep((step + 1) as Step);
    }
  };

  const resetToWelcome = async (): Promise<void> => {
    setStep(1);
    setConfirmedPhone('');

    try {
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      console.log('Cookies cleared via API route');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  };

  return (
    <>
      {step === 1 && <WelcomeStep next={nextStep} />}
      {step === 2 && <PhoneStep next={nextStep} prev={resetToWelcome} onPhoneConfirmed={handlePhoneConfirmed} />}
      {step === 3 && <CodeStep prev={resetToWelcome} phone={confirmedPhone} />}
    </>
  );
};

export default RegisterPage;
