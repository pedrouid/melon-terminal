import React from 'react';
import { format } from 'date-fns';

export interface FormattedDateProps {
  timestamp?: number;
}

export const FormattedDate: React.FC<FormattedDateProps> = ({ timestamp }) => {
  if (!timestamp) return <>N/A</>;

  return <>{format(new Date(timestamp * 1000), 'yyyy/MM/dd hh:mm a')}</>;
};
