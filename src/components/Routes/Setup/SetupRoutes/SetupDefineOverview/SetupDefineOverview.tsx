import React, { FormEvent } from 'react';
import BigNumber from 'bignumber.js';
import { SetupDefinitionProps } from '~/components/Routes/Setup/Setup';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useTransaction } from '~/hooks/useTransaction';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useHistory } from 'react-router';
import { Version } from '@melonproject/melonjs';

export const SetupDefineOverview: React.FC<Omit<SetupDefinitionProps, 'forward'>> = props => {
  const environment = useEnvironment()!;
  const history = useHistory();
  const transaction = useTransaction(environment, { onAcknowledge: () => history.push('/setup/transactions') });

  const assets = (props.state.assets || []).filter((asset: any) => asset !== false).map((asset: any) => `${asset}`);
  const exchanges = (props.state.exchanges || [])
    .filter((exchange: any) => exchange !== false)
    .map((exchange: any) => `${exchange}`);

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const address = environment.deployment.melonContracts.version;
    const factory = new Version(environment, address);

    const tokens = environment.deployment.thirdPartyContracts.tokens;
    const weth = tokens.find(token => token.symbol && token.symbol === 'WETH');

    const exchangeConfig = environment.deployment.exchangeConfigs;
    const exchangeAddresses = exchanges.map(exchange => exchangeConfig[exchange].exchange);
    const adapterAddresses = exchanges.map(exchange => exchangeConfig[exchange].adapter);

    const managementFeeAddress = environment.deployment.melonContracts.fees.managementFee;
    const performanceFeeAddress = environment.deployment.melonContracts.fees.performanceFee;
    const assetAddresses = assets.map(symbol => tokens.find(token => token.symbol === symbol)!.address);

    const tx = factory.beginSetup(environment.account!, {
      name: props.state.name!,
      adapters: adapterAddresses,
      exchanges: exchangeAddresses,
      fees: [managementFeeAddress, performanceFeeAddress],
      denominationAsset: weth!.address,
      defaultAssets: assetAddresses,
      feePeriods: [new BigNumber(0), new BigNumber(props.state.performanceFeePeriod!).multipliedBy(60 * 60 * 24)],
      feeRates: [
        new BigNumber(props.state.managementFee!).multipliedBy('1e16'),
        new BigNumber(props.state.performanceFee!).multipliedBy('1e16'),
      ],
    });
    transaction.start(tx);
  };

  return (
    <>
      <h1>Overview</h1>
      <p>Name: {props.state.name}</p>
      <p>Exchanges: {exchanges.join(', ')}</p>
      <p>Allowed investment assets: {assets.join(', ')}</p>
      <p>Management Fee: {props.state.managementFee}</p>
      <p>Performance Fee: {props.state.performanceFee}</p>
      <p>Performance Fee Period: {props.state.performanceFeePeriod}</p>
      <p>Terms and Conditions: {props.state.termsAndConditions ? 'acknowledged' : 'not acknowledged'}</p>

      <form onSubmit={submit}>
        <ButtonBlock>
          <CancelButton label="Back" onClick={() => props.back()} />
          <SubmitButton label="Finish" />
        </ButtonBlock>
      </form>

      <TransactionModal transaction={transaction} title="Begin Fund Setup" />
    </>
  );
};
