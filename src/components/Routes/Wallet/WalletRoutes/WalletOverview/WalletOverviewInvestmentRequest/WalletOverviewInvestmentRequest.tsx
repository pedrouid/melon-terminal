import React from 'react';
import { useHistory } from 'react-router';
import { InvestmentRequest } from '~/queries/FundParticipationOverview';
import { BodyCell, BodyRow } from '~/components/Common/Table/Table.styles';

export const WalletOverviewInvestmentRequest: React.FC<InvestmentRequest> = props => {
  const history = useHistory();

  return (
    <BodyRow onClick={() => history.push(`/fund/${props.address}`)}>
      <BodyCell>{props.name}</BodyCell>
      <BodyCell>{props.requestCreatedAt}</BodyCell>
      <BodyCell>{props.requestAsset}</BodyCell>
      <BodyCell>{props.requestAmount}</BodyCell>
      <BodyCell>{props.requestShares}</BodyCell>
    </BodyRow>
  );
};
