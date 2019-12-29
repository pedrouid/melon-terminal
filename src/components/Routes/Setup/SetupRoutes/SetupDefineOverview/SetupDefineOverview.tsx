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
import { versionContract } from '~/utils/deploymentContracts';
import { findToken } from '~/utils/findToken';
import { findExchange } from '~/utils/findExchange';

export const SetupDefineOverview: React.FC<Omit<SetupDefinitionProps, 'forward'>> = props => {
  const environment = useEnvironment()!;
  const history = useHistory();
  const transaction = useTransaction(environment, {
    onAcknowledge: () => {
      history.push({
        pathname: '/setup/transactions',
        state: {
          start: true,
        },
      });
    },
  });

  const assets = (props.state.assets || []).filter((asset: any) => asset !== false).map((asset: any) => `${asset}`);
  const exchanges = (props.state.exchanges || [])
    .filter((exchange: any) => exchange !== false)
    .map((exchange: any) => `${exchange}`);

  const createTransaction = () => {
    const factory = versionContract(environment);
    const weth = findToken(environment.deployment, 'WETH');
    const exchangeAddresses = exchanges.map(name => findExchange(environment.deployment, name)!.exchange);
    const adapterAddresses = exchanges.map(name => findExchange(environment.deployment, name)!.adapter);
    const managementFeeAddress = environment.deployment.melon.addr.ManagementFee;
    const performanceFeeAddress = environment.deployment.melon.addr.PerformanceFee;
    const assetAddresses = assets.map(symbol => findToken(environment.deployment, symbol)!.address);

    console.log({
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

    return tx;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const tx = createTransaction();
    transaction.start(tx, 'Begin setup');
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

      <TransactionModal transaction={transaction} />
    </>
  );
};
