import React from 'react';
import { InvestmentRequest } from '~/queries/FundParticipationOverview';
import { useEtherscanLink } from '~/hooks/useEtherscanLink';
import { BodyCell, BodyRow } from '~/components/Common/Table/Table.styles';

export const WalletOverviewInvestmentRequest: React.FC<InvestmentRequest> = props => {
  const link = useEtherscanLink({ address: props.address })!;

  return (
    <BodyRow>
      <BodyCell>{props.name}</BodyCell>
      <BodyCell>
        <a href={link}>{props.address}</a>
      </BodyCell>
      <BodyCell>{props.requestCreatedAt}</BodyCell>
      <BodyCell>{props.requestAsset}</BodyCell>
      <BodyCell>{props.requestAmount}</BodyCell>
      <BodyCell>{props.requestShares}</BodyCell>
    </BodyRow>
  );
};
