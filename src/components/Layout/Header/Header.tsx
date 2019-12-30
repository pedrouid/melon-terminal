import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import { useAccount } from '~/hooks/useAccount';
import { useEnvironment } from '~/hooks/useEnvironment';
import * as S from './Header.styles';

export const Header: React.FC = () => {
  const environment = useEnvironment();
  const location = useLocation();
  const account = useAccount();

  return (
    <S.HeaderPosition>
      <S.Header>
        <S.LogoContainer>
          <Link to="/">
            <S.Logo name="with-text" height={30} width={120} />
          </Link>
        </S.LogoContainer>
        <S.Account>
          <S.AccountInfo>
            {account.fund && (
              <S.AccountFund>
                <Link to={`/fund/${account.fund}`} title={account.fund}>
                  Your fund
                </Link>
              </S.AccountFund>
            )}
            {account.address && (
              <S.AccountAddress>
                <Link to="/wallet" title={account.address}>
                  Your wallet
                </Link>
              </S.AccountAddress>
            )}
            <S.AccountNetwork>
              <Link to={{ pathname: '/connect', state: { redirect: location } }} title="Change connection method">
                {environment ? environment.network : 'OFFLINE'}
              </Link>
            </S.AccountNetwork>
            {account.eth && <S.AccountBalance>{account.eth?.toFixed(4)} ETH</S.AccountBalance>}
          </S.AccountInfo>
        </S.Account>
      </S.Header>
    </S.HeaderPosition>
  );
};
