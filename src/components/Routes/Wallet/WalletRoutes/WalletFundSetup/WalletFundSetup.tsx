import React from 'react';
import BigNumber from 'bignumber.js';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Registry, Version } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { useTransaction } from '~/hooks/useTransaction';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Block, BlockSection, BlockActions } from '~/storybook/components/Block/Block';
import { Checkboxes, Checkbox } from '~/storybook/components/Checkbox/Checkbox';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { RequiresFundSetupNotStarted } from '~/components/Gates/RequiresFundSetupNotStarted/RequiresFundSetupNotStarted';
import { Fallback } from '~/components/Common/Fallback/Fallback';
import { Link } from '~/storybook/components/Link/Link';

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
    name: Yup.string()
      .min(1, 'The fund name must be at least one character.')
      // tslint:disable-next-line
      .test('nameTest', 'The fund name contains invalid characters.', async function(value) {
        const registry = new Registry(environment, environment.deployment.melon.addr.Registry);
        return await registry.isValidFundName(value);
      })
      // tslint:disable-next-line
      .test('nameTest', 'The fund name is reserved by another manager.', async function(value) {
        const registry = new Registry(environment, environment.deployment.melon.addr.Registry);
        return await registry.canUseFundName(account.address!, value);
      }),

    exchanges: Yup.array<string>()
      .compact()
      .min(1, 'Select at least one exchange.'),
    assets: Yup.array<string>().compact(),
    managementFee: Yup.number()
      .min(0, 'Management Fee must be greater or equal to zero.')
      .max(100),
    performanceFee: Yup.number()
      .min(0)
      .max(100),
    performanceFeePeriod: Yup.number().min(0),
    termsAndConditions: Yup.boolean().oneOf(
      [true],
      'You need to accept the Terms and conditions before you can continue.'
    ),
  });

  const defaultValues: WalletFundSetupForm = {
    name: '',
    exchanges: [],
    assets: [],
    managementFee: 1,
    performanceFee: 10,
    performanceFeePeriod: 90,
    termsAndConditions: false,
  };

  const form = useForm<WalletFundSetupForm>({
    defaultValues,
    validationSchema,
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
    onAcknowledge: () => {
      if (!account.fund) {
        history.push('/wallet');
      }

      history.push(`/fund/${account.fund}`, {
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

    transaction.start(tx, 'Begin setup (Step 1 of 9)');
  });

  const fallback = (
    <Fallback kind="error">
      You have already started a fund setup. Go to <Link to={`/fund/${account.fund}`}>your fund</Link> to complete the
      setup
    </Fallback>
  );

  const exchangeOptions = environment.exchanges
    .filter(exchange => !exchange.historic)
    .map(exchange => ({
      label: exchange.name,
      value: exchange.id,
    }));

  const tokensOptions = environment.tokens
    .filter(token => !token.historic)
    .map(token => ({
      label: `${token.symbol} (${token.name})`,
      value: token.address,
    }));

  return (
    <>
      <RequiresFundSetupNotStarted fallback={fallback}>
        <Grid>
          <GridRow justify="center">
            <GridCol sm={12} md={10} lg={8}>
              <Block>
                <FormContext {...form}>
                  <form onSubmit={submit}>
                    <BlockSection>
                      <SectionTitle>Fund</SectionTitle>
                      <Input id="name" name="name" label="Name" type="text" />
                    </BlockSection>
                    <BlockSection>
                      <SectionTitle>Fees</SectionTitle>
                      <Input
                        id="managementFee"
                        name="managementFee"
                        label="Management Fee (%)"
                        type="number"
                        step="any"
                      />
                      <Input
                        id="performanceFee"
                        name="performanceFee"
                        label="Performance Fee (%)"
                        type="number"
                        step="any"
                      />
                      <Input
                        id="performanceFeePeriod"
                        name="performanceFeePeriod"
                        label="Performance Fee Period (days)"
                        type="number"
                        step="any"
                      />
                    </BlockSection>
                    <BlockSection>
                      <SectionTitle>Supported exchanges</SectionTitle>
                      <NotificationBar kind="neutral">
                        <NotificationContent>
                          Exchanges can only be set up now and they cannot be changed later.
                        </NotificationContent>
                      </NotificationBar>
                      <Checkboxes options={exchangeOptions} name="exchanges" />
                    </BlockSection>
                    <BlockSection>
                      <SectionTitle>Allowed investment assets</SectionTitle>
                      <NotificationBar kind="neutral">
                        <NotificationContent>
                          Investment assets can be set up now and they can be changed later.
                        </NotificationContent>
                      </NotificationBar>
                      <Checkboxes options={tokensOptions} name="assets" />
                    </BlockSection>
                    <BlockSection>
                      <SectionTitle>Disclaimer</SectionTitle>
                      <p>
                        IMPORTANT NOTE: PLEASE READ THE FULL VERSION OF THIS DISCLAIMER CAREFULLY BEFORE USING THE MELON
                        PROTOCOL.
                      </p>
                      <p>
                        YOUR USE OF THE MELON PROTOCOL AND/OR THE SOFTWARE MAY BE SUBJECT TO THE FINANCIAL LAWS AND
                        REGULATIONS OF VARIOUS JURISDICTIONS. PRIOR TO USING THE MELON PROTOCOL, SEEK LEGAL ASSISTANCE
                        TO ASSURE THAT YOU MAY USE THE SOFTWARE IN COMPLIANCE WITH APPLICABLE LAW. FAILURE TO DO SO MAY
                        SUBJECT YOU TO CRIMINAL AS WELL AS CIVIL PENALTIES IN ONE OR MORE JURISDICTIONS. BY USING THIS
                        SOFTWARE, YOU CONFIRM THAT YOU HAVE SOUGHT THE ADVICE OF COMPETENT COUNSEL OR ARE OTHERWISE
                        FAMILIAR WITH THE APPLICABLE LAWS AND REGULATIONS PERTAINING TO YOUR INTENDED USE OF THE MELON
                        PROTOCOL. BY USING THIS SOFTWARE, YOU UNDERSTAND, ACKNOWLEDGE AND ACCEPT THAT THE MELON PROTOCOL
                        AND/OR THE UNDERLYING SOFTWARE ARE PROVIDED “AS IS” AND WITHOUT WARRANTIES OR REPRESENTATIONS OF
                        ANY KIND EITHER EXPRESSED OR IMPLIED. ANY USE OF THIS OPEN SOURCE SOFTWARE RELEASED UNDER THE
                        GNU GENERAL PUBLIC LICENSE VERSION 3 (GPL 3) IS DONE AT YOUR OWN RISK TO THE FULLEST EXTENT
                        PERMISSIBLE PURSUANT TO APPLICABLE LAW ANY AND ALL LIABILITY AS WELL AS ALL WARRANTIES,
                        INCLUDING ANY FITNESS FOR A PARTICULAR PURPOSE WITH RESPECT TO THE MELON PROTOCOL AND/OR THE
                        UNDERLYING SOFTWARE AND THE USE THEREOF ARE DISCLAIMED.
                      </p>
                      <Checkbox name="termsAndConditions" label="I accept the terms and conditions" />
                      <BlockActions>
                        <Button type="submit">Create fund</Button>
                      </BlockActions>
                    </BlockSection>
                  </form>
                </FormContext>
              </Block>
            </GridCol>
          </GridRow>
        </Grid>
      </RequiresFundSetupNotStarted>
      <TransactionModal transaction={transaction} />
    </>
  );
};

export default WalletFundSetup;
