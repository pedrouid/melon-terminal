import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Holding } from '@melonproject/melongql';
import { ExchangeDefinition, sameAddress, TokenDefinition } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Input } from '~/storybook/components/Input/Input';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Icons } from '~/storybook/components/Icons/Icons';
import * as S from './FundRequestForQuoteTrading.styles';
import { Spinner } from '~/storybook/components/Spinner/Spinner';

export interface FundRequestForQuoteTradingProps {
  address: string;
  exchange: ExchangeDefinition;
  holdings: Holding[];
}

interface FundRequestForQuoteTradingFormValues {
  makerAsset: string;
  takerAsset: string;
  takerQuantity: string;
}

interface Asset {
  address: string;
  decimals: string;
  type: string;
}

interface Market {
  id: string;
  base: Asset;
  quote: Asset;
  status: string;
}

function useMarkets() {
  const environment = useEnvironment()!;
  const [state, setState] = useState({
    loading: true,
    markets: [] as Market[],
  });

  useEffect(() => {
    (async () => {
      const result = await (await fetch('https://gateway.avantgarde.finance/rfq/markets')).json();

      setState({
        loading: false,
        markets: result?.items ?? [],
      });
    })();
  }, []);

  const markets = useMemo(() => {
    return state.markets.filter((item) => item.status === 'available').reduce((carry, current) => {
      const baseToken = environment.getToken(current.base.address);
      const quoteToken = environment.getToken(current.quote.address);
      if (!baseToken || !quoteToken || baseToken.historic || quoteToken.historic) {
        return carry;
      }

      const baseEntries = carry.get(baseToken) ?? new Map();
      baseEntries.set(quoteToken, current.id);

      const quoteEntries = carry.get(quoteToken) ?? new Map();
      quoteEntries.set(baseToken, current.id);

      return carry.set(baseToken, baseEntries).set(quoteToken, quoteEntries);
    }, new Map<TokenDefinition, Map<TokenDefinition, string>>());
  }, [environment.tokens, state.markets])

  return [markets, state.loading] as [typeof markets, typeof state.loading];
}

export const FundRequestForQuoteTrading: React.FC<FundRequestForQuoteTradingProps> = props => {
  const [markets, loading] = useMarkets();
  const environment = useEnvironment()!;

  // TODO: These refs are used for validation. Fix this after https://github.com/react-hook-form/react-hook-form/pull/817
  const holdingsRef = useRef(props.holdings);

  const form = useForm<FundRequestForQuoteTradingFormValues>({
    mode: 'onChange',
    defaultValues: {
      takerQuantity: '1',
    },
    validationSchema: Yup.object().shape({
      makerAsset: Yup.string().required(),
      takerAsset: Yup.string().required(),
      takerQuantity: Yup.string()
        .required('Missing sell quantity.')
        // tslint:disable-next-line
        .test('valid-number', 'The given value is not a valid number.', function (value) {
          const bn = new BigNumber(value);
          return !bn.isNaN() && !bn.isZero() && bn.isPositive();
        })
        // tslint:disable-next-line
        .test('balance-too-low', 'Your current balance is too low.', function (value) {
          const holding = holdingsRef.current.find(item => sameAddress(item.token!.address, this.parent.takerAsset))!;
          const divisor = holding ? new BigNumber(10).exponentiatedBy(holding.token!.decimals!) : new BigNumber('NaN');
          const balance = holding ? holding.amount!.dividedBy(divisor) : new BigNumber('NaN');
          return new BigNumber(value).isLessThanOrEqualTo(balance);
        }),
    }),
  });

  useEffect(() => {
    holdingsRef.current = props.holdings;
    form.triggerValidation().catch(() => { });
  }, [props.holdings]);

  const takerAsset = environment.getToken(form.watch('takerAsset') ?? '');
  const makerAsset = environment.getToken(form.watch('makerAsset') ?? '');

  const takerCandidates = useMemo(() => Array.from(markets.keys()), [markets]);
  const makerCandidates = useMemo(() => {
    if (!takerAsset) {
      return [] as TokenDefinition[];
    }

    return markets.has(takerAsset) ? Array.from(markets.get(takerAsset)!.keys()) : [] as TokenDefinition[];
  }, [markets, takerAsset]);

  useEffect(() => {
    if (!takerAsset || !takerCandidates.includes(takerAsset)) {
      form.setValue('takerAsset', takerCandidates[0]?.address, true);
    }
  }, [takerCandidates, takerAsset]);

  useEffect(() => {
    if (!makerAsset || !makerCandidates.includes(makerAsset)) {
      form.setValue('makerAsset', makerCandidates[0]?.address, true);
    }
  }, [makerCandidates, makerAsset]);

  const takerQuantity = new BigNumber(form.watch('takerQuantity'));
  const ready = form.formState.isValid;

  const switchDirection = () => {
    const values = form.getValues();

    form.setValue('makerAsset', values.takerAsset);
    form.setValue('takerAsset', values.makerAsset);
    form.triggerValidation().catch(() => { });
  };

  const takerOptions = takerCandidates.map(token => ({
    value: token.address,
    name: token.symbol,
  }));

  const makerOptions = makerCandidates.map(token => ({
    value: token.address,
    name: token.symbol,
  }));

  const handleTakerAssetChange = (value: string) => {
    const token = environment.getToken(value)!;
    const candidates = (token && markets.has(token) ? Array.from(markets.get(token)!.keys()) : [] as TokenDefinition[]);
    if (!makerAsset || !candidates.includes(makerAsset)) {
      form.setValue('makerAsset', candidates[0]?.address);
    }
  };

  return (
    <Block>
      <SectionTitle>Private market maker</SectionTitle>
      {loading && <Spinner />}

      <FormContext {...form}>
        <GridRow justify="space-between">
          <GridCol xs={12} sm={4}>
            <Dropdown name="takerAsset" label="Sell asset" options={takerOptions} onChange={event => handleTakerAssetChange(event.target.value)} />
          </GridCol>

          <GridCol xs={12} sm={6} justify="flex-end">
            <Input type="number" step="any" name="takerQuantity" label="Sell quantity" />
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol xs={12} sm={4}>
            <S.SwitchButton onClick={switchDirection}>
              <Icons name="EXCHANGE" />
            </S.SwitchButton>
          </GridCol>
        </GridRow>

        <GridRow justify="space-between">
          <GridCol xs={12} sm={4}>
            <Dropdown name="makerAsset" label="Buy asset" options={makerOptions} />
          </GridCol>
        </GridRow>
      </FormContext>
    </Block>
  );
};
