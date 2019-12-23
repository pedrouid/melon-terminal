import React from 'react';
import { Spinner } from '~/components/Common/Spinner/Spinner';
import { Fund } from '~/queries/FundParticipationOverview';
import { useFundParticipationQuery } from '~/queries/FundParticipation';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { NetworkStatus } from 'apollo-client';
import { BodyCell, BodyRow } from '~/components/Common/Table/Table.styles';

export const WalletOverviewManagedFund: React.FC<Fund> = props => {
  const [result, query] = useFundParticipationQuery(props.address);
  const link = useEtherscanLink({ address: props.address })!;
  const loading = query.networkStatus < NetworkStatus.ready;

  const shutdown = result.shutdown;

  return (
    <BodyRow>
      <BodyCell>{props.name}</BodyCell>
      <BodyCell>
        <a href={link}>{props.address}</a>
      </BodyCell>
      <BodyCell>{props.inception}</BodyCell>
      <BodyCell>{props.version}</BodyCell>
      <BodyCell>
        {loading && <Spinner size="tiny" />}
        {!loading && (shutdown ? 'Inactive' : 'Active')}
      </BodyCell>
    </BodyRow>
  );
};
