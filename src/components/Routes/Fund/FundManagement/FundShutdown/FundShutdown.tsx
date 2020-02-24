import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { Button } from '~/storybook/components/Button/Button';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Version, Trading } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundShutdownQuery } from '~/components/Routes/Fund/FundManagement/FundShutdown/FundShutdown.query';

export interface ShutdownProps {
  address: string;
}

export const Shutdown: React.FC<ShutdownProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const [info, query] = useFundShutdownQuery(address);

  const assets = info.routes?.trading?.lockedAssets;
  const transaction = useTransaction(environment, {
    onAcknowledge: async () => {
      if (assets && assets.length) {
        const version = new Version(environment, info.routes?.version?.address!);
        const tx = version.shutDownFund(account.address!, address);
        transaction.start(tx, 'Shutdown fund');
      }
    },
  });

  const submit = async () => {
    if (assets && assets.length) {
      const trading = new Trading(environment, info.routes?.trading?.address!);
      const tx = trading.returnBatchToVault(account.address!, assets.map(asset => asset.address!));
      transaction.start(tx, 'Return assets to vault');
    } else {
      const version = new Version(environment, info.routes?.version?.address!);
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

      <BlockActions>
        <Button type="submit" kind="danger" disabled={query.loading} loading={query.loading} onClick={() => submit()}>
          Shut Down Fund
        </Button>
      </BlockActions>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default Shutdown;
