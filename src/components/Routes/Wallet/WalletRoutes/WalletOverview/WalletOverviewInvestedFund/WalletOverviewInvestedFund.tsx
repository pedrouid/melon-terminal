import React from 'react';
import { useHistory } from 'react-router';
import { Fund } from '~/queries/FundParticipationOverview';
import { BodyCell, BodyRowHover } from '~/storybook/components/Table/Table';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';

export interface WalletOverviewInvestedFundProps {
  fund: Fund;
  version: {
    address: string;
    name: string;
  };
}

export const WalletOverviewInvestedFund: React.FC<WalletOverviewInvestedFundProps> = ({ fund, version }) => {
  const history = useHistory();

  return (
    <BodyRowHover onClick={() => history.push(`/fund/${fund.address}`)}>
      <BodyCell>{fund.name}</BodyCell>
      <BodyCell>
        <FormattedDate timestamp={fund.inception} />
      </BodyCell>
      <BodyCell>{fund.gav}</BodyCell>
      <BodyCell>{fund.sharePrice}</BodyCell>
      <BodyCell>{fund.change.toFixed(2)}</BodyCell>
      <BodyCell>{fund.shares}</BodyCell>
      <BodyCell>
        {fund.version} {fund.version === version?.name ? '(current)' : '(old)'}
      </BodyCell>
      <BodyCell>{fund.isShutDown ? 'Inactive' : 'Active'}</BodyCell>
    </BodyRowHover>
  );
};
