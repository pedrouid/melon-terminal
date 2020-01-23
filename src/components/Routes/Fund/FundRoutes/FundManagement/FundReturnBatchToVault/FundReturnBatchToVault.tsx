import React, { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/storybook/components/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Hub, Version, Trading } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundShutdownQuery } from '~/queries/FundShutdown';
import { Spinner } from '~/storybook/components/Spinner/Spinner';

export interface ReturnBatchToVaultProps {
  address: string;
}

export const ReturnBatchToVault: React.FC<ReturnBatchToVaultProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const refetch = useOnChainQueryRefetcher();
  const [info, _] = useFundShutdownQuery(address);

  const assetsInTrading = useMemo(() => {
    return info.routes?.trading?.lockedAssets;
  }, [info]);

  const hub = new Hub(environment, address);

  const transaction = useTransaction(environment, {
    onFinish: receipt => refetch(receipt.blockNumber),
  });

  const submit = async () => {
    const assets = (info!.routes!.accounting!.holdings!.map(holding => holding.token?.address) || []) as string[];

    const trading = new Trading(environment, (await hub.getRoutes()).trading);
    const tx = trading.returnBatchToVault(account.address!, assets);
    transaction.start(tx, 'Return assets to vault');
  };

  if (!assetsInTrading) {
    return <></>;
  }

  return (
    <Block>
      <SectionTitle>Move assets to vault</SectionTitle>
      <p>
        Some of your fund's assets have not been returned to the vault contract. This can happen when trading. In order
        to be able to use all your assets for trading, you have to move the assets back to vault
      </p>
      {info?.address ? (
        <BlockActions>
          <Button type="submit" kind="success" onClick={() => submit()}>
            Move assets to vault
          </Button>
        </BlockActions>
      ) : (
        <Spinner />
      )}

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default ReturnBatchToVault;
