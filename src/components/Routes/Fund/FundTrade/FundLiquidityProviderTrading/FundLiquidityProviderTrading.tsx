import React, { useEffect, useRef } from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Holding } from '@melonproject/melongql';
import { ExchangeDefinition, ExchangeIdentifier, sameAddress } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Input } from '~/storybook/components/Input/Input';
import { FundMelonEngineTrading } from '../FundMelonEngineTrading/FundMelonEngineTrading';
import { FundKyberTrading } from '../FundKyberTrading/FundKyberTrading';
import { FundUniswapTrading } from '../FundUniswapTrading/FundUniswapTrading';
import { Block, BlockSection } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';

import * as S from './FundLiquidityProviderTrading.styles';

export interface FundLiquidityProviderTradingProps {
  trading: string;
  exchanges: ExchangeDefinition[];
  holdings: Holding[];
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

  // TODO: These refs are used for validation. Fix this after https://github.com/react-hook-form/react-hook-form/pull/817
  const holdingsRef = useRef(props.holdings);

  const form = useForm<FundLiquidityProviderTradingFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      makerAsset: weth.address,
      takerAsset: mln.address,
      takerQuantity: '1',
    },
    validationSchema: Yup.object().shape({
      makerAsset: Yup.string().required(),
      takerAsset: Yup.string().required(),
      takerQuantity: Yup.string()
        .required('Missing sell quantity.')
        // tslint:disable-next-line
        .test('valid-number', 'The given value is not a valid number.', function(value) {
          const bn = new BigNumber(value);
          return !bn.isNaN() && !bn.isZero() && bn.isPositive();
        })
        // tslint:disable-next-line
        .test('balance-too-low', 'The balance of the is lower than the provided value.', function(value) {
          const holding = holdingsRef.current.find(item => sameAddress(item.token!.address, this.parent.takerAsset))!;
          const divisor = holding ? new BigNumber(10).exponentiatedBy(holding.token!.decimals!) : new BigNumber('NaN');
          const balance = holding ? holding.amount!.dividedBy(divisor) : new BigNumber('NaN');
          return new BigNumber(value).isLessThanOrEqualTo(balance);
        }),
    }),
  });

  useEffect(() => {
    holdingsRef.current = props.holdings;
    form.triggerValidation().catch(() => {});
  }, [props.holdings, form.formState.touched]);

  const makerAsset = environment.getToken(form.watch('makerAsset')!);
  const takerAsset = environment.getToken(form.watch('takerAsset')!);
  const takerQuantity = new BigNumber(form.watch('takerQuantity'));
  const ready = form.formState.isValid;

  const exchanges = props.exchanges
    .map(exchange => {
      if (exchange.id === ExchangeIdentifier.KyberNetwork) {
        return [exchange, FundKyberTrading];
      }

      if (exchange.id === ExchangeIdentifier.Uniswap) {
        return [exchange, FundUniswapTrading];
      }

      if (exchange.id === ExchangeIdentifier.MelonEngine) {
        if (makerAsset === weth && takerAsset === mln) {
          return [exchange, FundMelonEngineTrading];
        }

        return null;
      }

      return null;
    })
    .filter(value => !!value) as [ExchangeDefinition, React.ElementType][];

  return (
    <Block>
      <SectionTitle>Liquidity pools trading</SectionTitle>

      <FormContext {...form}>
        <BlockSection>
          <SectionTitle>Choose the assets to swap:</SectionTitle>

          <S.DropdownContainer>
            <Dropdown name="takerAsset" label="Sell this asset:" options={options} />
          </S.DropdownContainer>

          <S.DropdownContainer>
            <Dropdown name="makerAsset" label="To buy this asset:" options={options} />
          </S.DropdownContainer>
        </BlockSection>

        <S.OptionsContainer>
          <BlockSection>
            <SectionTitle>{`Specify an amount of ${takerAsset.symbol} to sell: `}</SectionTitle>

            <S.DropdownContainer>
              <Input type="number" step="any" name="takerQuantity" label="Quantity" />
            </S.DropdownContainer>
          </BlockSection>
          <BlockSection>
            <SectionTitle>Choose your exchange and swap:</SectionTitle>
            <S.ExchangeContainer>
              {!!(exchanges && exchanges.length) &&
                exchanges.map(([exchange, Component]) => (
                  <Component
                    active={ready}
                    key={exchange.id}
                    holdings={props.holdings}
                    exchange={exchange}
                    maker={makerAsset}
                    taker={takerAsset}
                    quantity={takerQuantity}
                  />
                ))}
            </S.ExchangeContainer>
          </BlockSection>
        </S.OptionsContainer>
      </FormContext>
    </Block>
  );
};
