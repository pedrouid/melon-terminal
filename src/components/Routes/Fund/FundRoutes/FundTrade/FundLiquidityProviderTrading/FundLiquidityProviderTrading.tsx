import React from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Holding } from '@melonproject/melongql';
import { TokenDefinition, ExchangeDefinition, sameAddress, ExchangeIdentifier } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Input } from '~/storybook/components/Input/Input';
import { FundMelonEngineTrading } from './FundMelonEngineTrading/FundMelonEngineTrading';
import { FundKyberTrading } from './FundKyberTrading/FundKyberTrading';
import { FundUniswapTrading } from './FundUniswapTrading/FundUniswapTrading';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

export interface FundLiquidityProviderTradingProps {
  address: string;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
  asset?: TokenDefinition;
}

interface FundLiquidityProviderTradingFormValues {
  makerAsset: string;
  takerAsset: string;
  takerQuantity: string;
}

export const FundLiquidityProviderTrading: React.FC<FundLiquidityProviderTradingProps> = props => {
  const environment = useEnvironment()!;
  const options = environment.tokens
    .filter(item => !item.historic)
    .map(token => ({
      value: token.address,
      name: token.symbol,
    }));

  const mln = environment.getToken('MLN');
  const weth = environment.getToken('WETH');

  const form = useForm<FundLiquidityProviderTradingFormValues>({
    mode: 'onChange',
    defaultValues: {
      makerAsset: weth.address,
      takerAsset: mln.address,
      takerQuantity: '1',
    },
    validationSchema: Yup.object().shape({
      makerAsset: Yup.string().required(),
      takerAsset: Yup.string().required(),
      // takerQuantity: Yup.string()
      //   .required('Missing sell quantity.')
      //   // tslint:disable-next-line
      //   .test('valid-number', 'The given value is not a valid number.', function(value) {
      //     const bn = new BigNumber(value);
      //     return !bn.isNaN() && bn.isPositive();
      //   })
      //   // tslint:disable-next-line
      //   .test('balance-too-low', 'Your current balance is too low.', function(value) {
      //     const holding = props.holdings.find(item => sameAddress(item.token!.address, this.parent.takerAsset))!;
      //     const divisor = new BigNumber(10).exponentiatedBy(holding.token!.decimals!);
      //     const balance = holding.amount!.dividedBy(divisor);
      //     return new BigNumber(value).isLessThanOrEqualTo(balance);
      //   }),
    }),
  });

  const makerAsset = environment.getToken(form.watch('makerAsset')!);
  const takerAsset = environment.getToken(form.watch('takerAsset')!);
  const takerQuantity = new BigNumber(form.watch('takerQuantity'));
  const ready = form.formState.isValid;

  return (
    <Block>
      <SectionTitle>Liquidity providers</SectionTitle>

      <FormContext {...form}>
        <Dropdown name="takerAsset" label="Sell asset" options={options} />
        <Dropdown name="makerAsset" label="Buy asset" options={options} />
        <Input type="number" step="any" name="takerQuantity" label="Sell quantity" />
      </FormContext>

      {ready &&
        props.exchanges.map(exchange => {
          if (exchange.id === ExchangeIdentifier.KyberNetwork) {
            return (
              <FundKyberTrading
                key={exchange.id}
                address={props.address}
                holdings={props.holdings}
                exchange={exchange}
                maker={makerAsset}
                taker={takerAsset}
                quantity={takerQuantity}
              />
            );
          }

          if (exchange.id === ExchangeIdentifier.MelonEngine) {
            return (
              <FundMelonEngineTrading
                key={exchange.id}
                address={props.address}
                holdings={props.holdings}
                exchange={exchange}
                maker={makerAsset}
                taker={takerAsset}
                quantity={takerQuantity}
              />
            );
          }

          if (exchange.id === ExchangeIdentifier.Uniswap) {
            return (
              <FundUniswapTrading
                key={exchange.id}
                address={props.address}
                holdings={props.holdings}
                exchange={exchange}
                maker={makerAsset}
                taker={takerAsset}
                quantity={takerQuantity}
              />
            );
          }

          return null;
        })}
    </Block>
  );
};
