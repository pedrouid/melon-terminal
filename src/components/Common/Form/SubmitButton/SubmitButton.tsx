import React from 'react';

import { Button } from '~/storybook/components/Button/Button';

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, ...rest }) => {
  return (
    <Button type="submit" {...rest}>
      {label}
    </Button>
  );
};
