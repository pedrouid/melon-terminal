import React, { useEffect, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Trading } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/storybook/components/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { Checkboxes } from '~/storybook/components/Checkbox/Checkbox';
import { useAccount } from '~/hooks/useAccount';
import { useFundExchangesQuery } from './FundExchanges.query';

export interface ExchangesProps {
  address: string;
}

export interface ExchangesForm {
  exchanges: string[];
}

export const FundExchanges: React.FC<ExchangesProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const [details, query] = useFundExchangesQuery(address);

  const transaction = useTransaction(environment);

  const exchanges = useMemo(() => {
    const exchanges = details?.fund?.routes?.trading?.exchanges || [];
    return exchanges.map(exchange => environment.getExchange(exchange.exchange!)).filter(exchange => !!exchange);
  }, [details?.fund?.routes?.trading?.exchanges]);

  const exchangesRef = useRef(exchanges);
  useEffect(() => {
    exchangesRef.current = exchanges;
  }, [exchanges]);

  const form = useForm<ExchangesForm>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    validationSchema: Yup.object().shape({
      exchanges: Yup.array<string>()
        .compact()
        .test('at-least-one', "You didn't select a new exchange.", value => {
          return value.length > exchangesRef.current.length;
        })
        .test('only-one', 'You can only add one exchange at a time.', value => {
          return value.length === exchangesRef.current.length + 1;
        }),
    }),
  });

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Define allowed exchanges</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const options = environment.exchanges
    .filter(exchange => {
      return !exchange.historic || exchanges?.some(allowed => allowed.id === exchange.id);
    })
    .map(exchange => ({
      label: exchange.name,
      value: exchange.id,
      checked: !!exchanges?.some(allowed => allowed.id === exchange.id),
      disabled: !!exchanges?.some(allowed => allowed.id === exchange.id) || exchange.historic,
    }));

  const submit = form.handleSubmit(async data => {
    const add = data.exchanges.find(selected => selected && !exchanges.some(available => available.id === selected))!;
    const exchange = environment.getExchange(add);
    const address = details?.fund?.routes?.trading?.address;
    const trading = new Trading(environment, address!);
    const tx = trading.addExchange(account.address!, exchange.exchange, exchange.adapter);
    transaction.start(tx, 'Add exchange');
  });

  return (
    <Block>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <SectionTitle>Define allowed exchanges</SectionTitle>
          <p>As a fund manager, you can trade on any of the exchanges selected below.</p>

          <Checkboxes options={options} name="exchanges" />

          <BlockActions>
            <Button type="button" onClick={submit}>
              Set allowed exchanges
            </Button>
          </BlockActions>
        </form>
      </FormContext>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};
