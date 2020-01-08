import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useTransaction } from '~/hooks/useTransaction';
import { useHistory } from 'react-router';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Hub, Version } from '@melonproject/melonjs';
import { useAccount } from '~/hooks/useAccount';
import { useOnChainQueryRefetcher } from '~/hooks/useOnChainQueryRefetcher';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { RequiresFundNotShutDown } from '~/components/Common/Gates/RequiresFundNotShutDown/RequiresFundNotShutDown';

export interface ShutdownProps {
  address: string;
}

export const Shutdown: React.FC<ShutdownProps> = ({ address }) => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const history = useHistory();
  const refetch = useOnChainQueryRefetcher();

  const transaction = useTransaction(environment, {
    onFinish: () => refetch(),
    onAcknowledge: () => {
      history.push(`/fund/${address}`);
    },
  });

  const submit = async () => {
    const hub = new Hub(environment, address);
    const version = new Version(environment, await hub.getFundVersion());
    const tx = version.shutDownFund(account.address!, address);
    transaction.start(tx, 'Shutdown fund');
  };

  return (
    <Block>
      <SectionTitle>Shut down fund</SectionTitle>
      <RequiresFundNotShutDown>
        <ButtonBlock>
          <SubmitButton type="button" label="Shutdown fund" onClick={() => submit()} />
        </ButtonBlock>
      </RequiresFundNotShutDown>

      <TransactionModal transaction={transaction} />
    </Block>
  );
};

export default Shutdown;
