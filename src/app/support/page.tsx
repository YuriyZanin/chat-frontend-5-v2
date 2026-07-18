'use client';

import { SendSupportMessageStep } from 'modules/support/ui/send-support-message';
import { SupportMessageSentStep } from 'modules/support/ui/support-message-sent';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';

type Step = 1 | 2;

const SupportPage = (): JSX.Element => {
  const [step, setStep] = useState<Step>(1);
  const router = useRouter();

  const nextStep = (): void => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      router.push('/contacts');
    }
  };

  const resetToWelcome = async (): Promise<void> => {
    try {
      await fetch('/api/auth/remove-tokens', {
        method: 'POST',
      });
      console.log('Cookies cleared via API route');
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
    router.push('/auth');
  };

  return (
    <>
      {step === 1 && <SendSupportMessageStep next={nextStep} prev={resetToWelcome} />}
      {step === 2 && <SupportMessageSentStep next={nextStep} prev={resetToWelcome} />}
    </>
  );
};

export default SupportPage;
