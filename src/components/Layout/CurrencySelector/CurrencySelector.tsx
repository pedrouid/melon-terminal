import React from 'react';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { useCurrency } from '~/hooks/useCurrency';

export const CurrencySelector: React.FC = () => {
  const currency = useCurrency();

  const options = currency.list.map(item => {
    return { value: item.symbol, name: item.symbol };
  });

  return <Dropdown options={options} onChange={event => currency.switch(event.target.value)} />;
};

export default CurrencySelector;
