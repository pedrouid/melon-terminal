import React, { useMemo } from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/storybook/components/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Hub, Version, Trading } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundShutdownQuery } from '~/components/Routes/Fund/FundManagement/FundShutdown/FundShutdown.query';
import { Spinner } from '~/storybook/components/Spinner/Spinner';

export interface ShutdownProps {
  address: string;
}

export const Shutdown: React.FC<ShutdownProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [info, _] = useFundShutdownQuery(address);

  const assetsInTrading = useMemo(() => {
    return info.routes?.trading?.lockedAssets;
  }, [info]);

  const hub = new Hub(environment, address);

  const transaction = useTransaction(environment, {
    onAcknowledge: async () => {
      if (assetsInTrading) {
        const version = new Version(environment, await hub.getVersion());
        const tx = version.shutDownFund(account.address!, address);
        transaction.start(tx, 'Shutdown fund');
      }
    },
  });

  const submit = async () => {
    if (assetsInTrading) {
      const assets = (info!.routes!.accounting!.holdings!.map(holding => holding.token?.address) || []) as string[];

      const trading = new Trading(environment, (await hub.getRoutes()).trading);
      const tx = trading.returnBatchToVault(account.address!, assets);
      transaction.start(tx, 'Return assets to vault');
    } else {
      const version = new Version(environment, await hub.getVersion());
      const tx = version.shutDownFund(account.address!, address);
      transaction.start(tx, 'Shutdown fund');
    }
  };

  return (
    <Block>
      <SectionTitle>Shut Down Fund</SectionTitle>
      <p>
        Shutting down your fund closes the fund for new investors and trades will no longer be possible. Investors can
        still redeem their shares whenever they want.
      </p>
      {info?.address ? (
        <BlockActions>
          <Button type="submit" kind="danger" onClick={() => submit()}>
            Shut Down Fund
          </Button>
        </BlockActions>
      ) : (
        <Spinner />
      )}

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default Shutdown;
