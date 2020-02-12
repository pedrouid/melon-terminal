import React, { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Trading, sameAddress } from '@melonproject/melonjs';
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
  const [addExchanges, setAddExchanges] = useState<string[]>([]);

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => {
      if (addExchanges?.length) {
        setAddExchanges([]);
      }
    },
  });

  const validationSchema = Yup.object().shape({
    exchanges: Yup.array<string>().compact(),
  });

  const form = useForm<ExchangesForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const allowedExchanges = details?.fund?.routes?.trading?.exchanges || [];

  useEffect(() => {
    const tradingAddress = details?.fund?.routes?.trading?.address;
    const trading = new Trading(environment, tradingAddress);

    if (addExchanges.length === 1) {
      form.clearError('exchanges');
      const exchangeDetails = environment.getExchange(addExchanges[0]);
      const tx = trading.addExchange(account.address!, addExchanges[0], exchangeDetails.adapter);
      transaction.start(tx, 'Add exchange');
    }
  }, [addExchanges]);

  const submit = form.handleSubmit(async data => {
    const exchangesToAdd = data.exchanges.filter(
      selected => selected && !allowedExchanges?.some(available => available.exchange === selected)
    );
    setAddExchanges(exchangesToAdd);

    if (exchangesToAdd.length > 1) {
      form.setError('exchanges', 'tooMany', 'You can only add one exchange at a time');
    }

    if (!exchangesToAdd.length) {
      form.setError('exchanges', 'noChanges', 'No changes detected');
    }
  });

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Define allowed exchanges</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  const exchangesOptions = environment.exchanges.map(exchange => ({
    label: `${exchange.name}`,
    value: exchange.exchange,
    checked: !!allowedExchanges?.some(allowed => allowed && sameAddress(allowed.exchange, exchange.exchange)),
    disabled: !!allowedExchanges?.some(allowed => allowed && sameAddress(allowed.exchange, exchange.exchange)),
  }));

  return (
    <Block>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <SectionTitle>Define allowed exchanges</SectionTitle>
          <p>As a fund manager, you can trade on any of the exchanges selected below.</p>

          <Checkboxes options={exchangesOptions} name="exchanges" />

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
