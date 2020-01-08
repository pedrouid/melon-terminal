import React from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Version } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useTransaction } from '~/hooks/useTransaction';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Input } from '~/storybook/components/Input/Input';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Button } from '~/storybook/components/Button/Button';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Block } from '~/storybook/components/Block/Block';

export interface WalletFundSetupForm {
  name: string;
  exchanges: string[];
  assets: string[];
  managementFee: number;
  performanceFee: number;
  performanceFeePeriod: number;
  termsAndConditions: boolean;
}

export const WalletFundSetup: React.FC = () => {
  const environment = useEnvironment()!;
  const history = useHistory();
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1),
    exchanges: Yup.array<string>()
      .compact()
      .min(1),
    assets: Yup.array<string>()
      .compact()
      .min(1),
    managementFee: Yup.number()
      .min(0)
      .max(100),
    performanceFee: Yup.number()
      .min(0)
      .max(100),
    performanceFeePeriod: Yup.number().min(0),
    termsAndConditions: Yup.boolean().oneOf([true]),
  });

  const form = useForm<WalletFundSetupForm>({
    validationSchema,
    reValidateMode: 'onBlur',
    mode: 'onSubmit',
  });

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
    onAcknowledge: () => {
      if (!account.fund) {
        return;
      }

      history.push(`/wallet/setup/transactions`, {
        start: true,
      });
    },
  });

  const submit = form.handleSubmit((values: WalletFundSetupForm) => {
    const factory = new Version(environment, environment.deployment.melon.addr.Version);

    const wethAddress = environment.getToken('WETH')!.address;
    const assetAddresses = values.assets.map(symbol => environment.getToken(symbol)!.address);
    const selectedExchanges = values.exchanges.map(id => environment.getExchange(id));
    const exchangeAddresses = selectedExchanges.map(exchange => exchange.exchange);
    const adapterAddresses = selectedExchanges.map(exchange => exchange.adapter);

    const managementFeeAddress = environment.deployment.melon.addr.ManagementFee;
    const performanceFeeAddress = environment.deployment.melon.addr.PerformanceFee;
    const managementFeePeriod = new BigNumber(0);
    const performanceFeePeriod = new BigNumber(values.performanceFeePeriod).multipliedBy(60 * 60 * 24);
    const managementFeeRate = new BigNumber(values.managementFee).multipliedBy('1e16');
    const performanceFeeRate = new BigNumber(values.performanceFee).multipliedBy('1e16');

    const tx = factory.beginSetup(account.address!, {
      name: values.name,
      adapters: adapterAddresses,
      exchanges: exchangeAddresses,
      fees: [managementFeeAddress, performanceFeeAddress],
      denominationAsset: wethAddress,
      defaultAssets: assetAddresses,
      feePeriods: [managementFeePeriod, performanceFeePeriod],
      feeRates: [managementFeeRate, performanceFeeRate],
    });

    transaction.start(tx, 'Begin setup');
  });

  return (
    <Grid>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <GridRow>
            <GridCol xs={12} sm={6}>
              <Block>
                <SectionTitle>Fund</SectionTitle>
                <FormField name="name" label="Name">
                  <Input id="name" name="name" type="text" />
                </FormField>
              </Block>
            </GridCol>
            <GridCol xs={12} sm={6}>
              <Block>
                <SectionTitle>Fees</SectionTitle>
                <FormField name="managementFee" label="Management Fee (%)">
                  <Input id="managementFee" name="managementFee" type="number" />
                </FormField>

                <FormField name="performanceFee" label="Performance Fee (%)">
                  <Input id="performanceFee" name="performanceFee" type="number" />
                </FormField>

                <FormField name="performanceFeePeriod" label="Performance Fee Period (days)">
                  <Input id="performanceFeePeriod" name="performanceFeePeriod" type="number" />
                </FormField>
              </Block>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol xs={12} sm={6}>
              <Block>
                <SectionTitle>Supported exchanges</SectionTitle>
                {form.errors.exchanges && <p>{form.errors.exchanges.message}</p>}
                <ul>
                  {environment.exchanges.map((exchange, index) => (
                    <li key={exchange.id}>
                      <input
                        id={`exchanges[${index}]`}
                        type="checkbox"
                        name={`exchanges[${index}]`}
                        value={exchange.id}
                        key={exchange.id}
                        ref={form.register}
                      />
                      <label htmlFor={`exchanges[${index}]`}>{exchange.name}</label>
                    </li>
                  ))}
                </ul>
              </Block>
            </GridCol>
            <GridCol xs={12} sm={6}>
              <Block>
                <SectionTitle>Allowed investment assets</SectionTitle>
                {form.errors.assets && <p>{form.errors.assets.message}</p>}
                <ul>
                  {environment.tokens.map((token, index) => (
                    <li key={token.symbol}>
                      <input
                        id={`assets[${index}]`}
                        type="checkbox"
                        name={`assets[${index}]`}
                        value={token.symbol}
                        key={token.symbol}
                        ref={form.register}
                      />
                      <label htmlFor={`assets[${index}]`}>
                        {token.symbol} ({token.name})
                      </label>
                    </li>
                  ))}
                </ul>
              </Block>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol xs={12} sm={12}>
              <Block>
                <SectionTitle>Disclaimer</SectionTitle>
                <p>
                  IMPORTANT NOTE: PLEASE READ THE FULL VERSION OF THIS DISCLAIMER CAREFULLY BEFORE USING THE MELON
                  PROTOCOL.
                </p>
                <p>
                  YOUR USE OF THE MELON PROTOCOL AND/OR THE SOFTWARE MAY BE SUBJECT TO THE FINANCIAL LAWS AND
                  REGULATIONS OF VARIOUS JURISDICTIONS. PRIOR TO USING THE MELON PROTOCOL, SEEK LEGAL ASSISTANCE TO
                  ASSURE THAT YOU MAY USE THE SOFTWARE IN COMPLIANCE WITH APPLICABLE LAW. FAILURE TO DO SO MAY SUBJECT
                  YOU TO CRIMINAL AS WELL AS CIVIL PENALTIES IN ONE OR MORE JURISDICTIONS. BY USING THIS SOFTWARE, YOU
                  CONFIRM THAT YOU HAVE SOUGHT THE ADVICE OF COMPETENT COUNSEL OR ARE OTHERWISE FAMILIAR WITH THE
                  APPLICABLE LAWS AND REGULATIONS PERTAINING TO YOUR INTENDED USE OF THE MELON PROTOCOL. BY USING THIS
                  SOFTWARE, YOU UNDERSTAND, ACKNOWLEDGE AND ACCEPT THAT THE MELON PROTOCOL AND/OR THE UNDERLYING
                  SOFTWARE ARE PROVIDED “AS IS” AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND EITHER EXPRESSED
                  OR IMPLIED. ANY USE OF THIS OPEN SOURCE SOFTWARE RELEASED UNDER THE GNU GENERAL PUBLIC LICENSE VERSION
                  3 (GPL 3) IS DONE AT YOUR OWN RISK TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW ANY
                  AND ALL LIABILITY AS WELL AS ALL WARRANTIES, INCLUDING ANY FITNESS FOR A PARTICULAR PURPOSE WITH
                  RESPECT TO THE MELON PROTOCOL AND/OR THE UNDERLYING SOFTWARE AND THE USE THEREOF ARE DISCLAIMED.
                </p>

                <input id="termsAndConditions" type="checkbox" name="termsAndConditions" ref={form.register} />
                <label htmlFor="termsAndConditions">I accept the terms and conditions</label>

                <Button type="submit">Create fund</Button>
              </Block>
            </GridCol>
          </GridRow>
        </form>
      </FormContext>
      <TransactionModal transaction={transaction} />
    </Grid>
  );
};

export default WalletFundSetup;
