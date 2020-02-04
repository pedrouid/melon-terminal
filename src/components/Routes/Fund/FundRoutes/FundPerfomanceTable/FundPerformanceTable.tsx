import React, { Fragment } from 'react';
import {
  Table,
  HeaderCell,
  HeaderRow,
  BodyCell,
  BodyRow,
  HeaderCellRightAlign,
  BodyCellRightAlign,
} from '~/storybook/components/Table/Table';
import { Spinner } from '~/storybook/components/Spinner/Spinner';
import { Block } from '~/storybook/components/Block/Block';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { useFundPerformanceQuery } from './FundPerformance.query';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';

export interface FundPerformanceTableProps {
  address: string;
}

export const FundPerformanceTable: React.FC<FundPerformanceTableProps> = ({ address }) => {
  const [fund, assets, query] = useFundPerformanceQuery(address, ['WBTC']);

  if (query.loading) {
    return (
      <Block>
        <SectionTitle>Performance History</SectionTitle>
        <Spinner />
      </Block>
    );
  }

  if (!fund) {
    return null;
  }

  return (
    <Block>
      <SectionTitle>Performance History</SectionTitle>
      <Table>
        <thead>
          <HeaderRow>
            <HeaderCell>Investment</HeaderCell>
            <HeaderCellRightAlign>QTD</HeaderCellRightAlign>
            <HeaderCellRightAlign>YTD</HeaderCellRightAlign>
            <HeaderCellRightAlign>1-Month</HeaderCellRightAlign>
            <HeaderCellRightAlign>6-Month</HeaderCellRightAlign>
            <HeaderCellRightAlign>1-Year</HeaderCellRightAlign>
            <HeaderCellRightAlign>Since Fund Inception</HeaderCellRightAlign>
          </HeaderRow>
        </thead>

        <tbody>
          <BodyRow>
            <BodyCell>{fund.name}</BodyCell>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.qtdReturn} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.ytdReturn} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.oneMonthReturn} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.sixMonthReturn} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.oneYearReturn} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
            <BodyCellRightAlign>
              <FormattedNumber value={fund.returnSinceInception} colorize={true} decimals={2} suffix="%" />
            </BodyCellRightAlign>
          </BodyRow>

          {(assets ?? []).map(asset => (
            <Fragment key={asset.symbol}>
              <BodyRow>
                <BodyCell>{asset.symbol}</BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.qtdReturn} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.ytdReturn} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.oneMonthReturn} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.sixMonthReturn} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.oneYearReturn} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber value={asset.returnSinceInception} colorize={true} decimals={2} suffix="%" />
                </BodyCellRightAlign>
              </BodyRow>

              <BodyRow>
                <BodyCell>Relative Performance vs. {asset.symbol}</BodyCell>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.qtdReturn.minus(asset.qtdReturn)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.ytdReturn.minus(asset.ytdReturn)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.oneMonthReturn.minus(asset.oneMonthReturn)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.sixMonthReturn.minus(asset.sixMonthReturn)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.oneYearReturn.minus(asset.oneYearReturn)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
                <BodyCellRightAlign>
                  <FormattedNumber
                    value={fund.returnSinceInception.minus(asset.returnSinceInception)}
                    colorize={true}
                    decimals={2}
                    suffix="%"
                  />
                </BodyCellRightAlign>
              </BodyRow>
            </Fragment>
          ))}
        </tbody>
      </Table>
    </Block>
  );
};
