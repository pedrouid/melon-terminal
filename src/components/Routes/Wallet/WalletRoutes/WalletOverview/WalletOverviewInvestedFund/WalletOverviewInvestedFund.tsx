import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { Fund } from '~/queries/FundParticipationOverview';
import { useFundParticipationQuery } from '~/queries/FundParticipation';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { NetworkStatus } from 'apollo-client';
import { BodyCell, BodyRow } from '~/components/Common/Table/Table.styles';

export const WalletOverviewInvestedFund: React.FC<Fund> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready;
  const balance = result.balance;

  return (
    <BodyRow>
      <BodyCell>{props.name}</BodyCell>
      <BodyCell>
        <a href={link}>{props.address}</a>
      </BodyCell>
      <BodyCell>{props.sharePrice}</BodyCell>
      <BodyCell>
        {loading && <Spinner size="tiny" />}
        {!loading && balance && balance.toFixed(8)}
      </BodyCell>
    </BodyRow>
  );
};
