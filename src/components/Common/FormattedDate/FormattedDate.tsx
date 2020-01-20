import React from 'react';
import { format } from 'date-fns';

export interface FormattedDateProps {
  timestamp?: Date | number | null;
  format?: string;
}

export const FormattedDate: React.FC<FormattedDateProps> = props => {
  if (!props.timestamp) {
    return <>N/A</>;
  }

  const date = props.timestamp instanceof Date ? props.timestamp : new Date(props.timestamp * 1000);
  return <>{format(date, props.format || 'yyyy/MM/dd hh:mm a')}</>;
};
