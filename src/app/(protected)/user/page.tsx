'use client';

import { FinalStep } from 'modules/auth/ui/final-step';
import { NameStep } from 'modules/auth/ui/name-step';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';

type Step = 4 | 5;

const RegisterUserPage = (): JSX.Element => {
  const [step, setStep] = useState<Step>(4);
  const router = useRouter();

  const nextStep = (): void => {
    if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      router.push('/contacts');
    }
  };

  const resetToWelcome = async (): Promise<void> => {
    try {
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
    router.push('/auth');
  };

  return (
    <>
      {step === 4 && <NameStep next={nextStep} prev={resetToWelcome} />}
      {step === 5 && <FinalStep next={nextStep} />}
    </>
  );
};

export default RegisterUserPage;
