import React from 'react';
import { useHistory } from 'react-router';
import { Fund } from '~/queries/FundParticipationOverview';
import { BodyCell, BodyRowHover } from '~/components/Common/Table/Table.styles';

export const WalletOverviewManagedFund: React.FC<Fund> = props => {
  const history = useHistory();

  return (
    <BodyRowHover onClick={() => history.push(`/fund/${props.address}`)}>
      <BodyCell>{props.name}</BodyCell>
      <BodyCell>{props.inception}</BodyCell>
      <BodyCell>{props.gav}</BodyCell>
      <BodyCell>{props.sharePrice}</BodyCell>
      <BodyCell>{props.change?.dailyReturn.toFixed(2)}</BodyCell>
      <BodyCell>{props.shares}</BodyCell>
      <BodyCell>{props.version}</BodyCell>
      <BodyCell>{props.isShutDown ? 'Inactive' : 'Active'}</BodyCell>
    </BodyRowHover>
  );
};
