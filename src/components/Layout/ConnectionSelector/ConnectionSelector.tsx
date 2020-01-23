import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import { Icons, IconName } from '~/storybook/components/Icons/Icons';
import { ConnectionContext } from '~/components/Contexts/Connection/Connection';
import * as S from './ConnectionSelector.styles';

export interface ConnectionButtonProps {
  name: string;
  label: string;
  icon?: IconName;
  connection: ConnectionContext;
  accounts: { name: string; value: string }[];
  active: boolean;
}

export const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  name,
  label,
  icon,
  connection,
  accounts,
  active,
}) => {
  const click = () => (active ? connection.disconnect() : connection.connect(name));

  return (
    <S.ConnectionButtonWrapper>
      <S.ConnectionButton onClick={click}>
        <S.ButtonWrapper>
          {icon && (
            <S.ButtonIcon>
              <Icons name={icon} />
            </S.ButtonIcon>
          )}
          <S.ButtonText>{active ? `Disconnect from ${label}` : `Connect to ${label}`}</S.ButtonText>
        </S.ButtonWrapper>
      </S.ConnectionButton>

      {(accounts && accounts.length > 1 && (
        <Dropdown
          options={accounts}
          value={connection.account}
          onChange={event => connection.switch(event.target.value)}
        />
      )) ||
        null}
    </S.ConnectionButtonWrapper>
  );
};

export const ConnectionSelector = () => {
  const ref = useRef<any>();
  const [open, setOpen] = useState(false);
  const connection = useConnectionState();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current!.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handler, false);

    return () => {
      document.removeEventListener('click', handler, false);
    };
  }, [open]);

  const icon = useMemo(() => {
    switch (connection.method) {
      case 'metamask':
        return 'METAMASK';
      case 'frame':
        return 'FRAME';
      case 'ganache':
        return 'GANACHE';
      default:
        return null;
    }
  }, [connection.method]);

  return (
    <S.ConnectionSelector ref={ref}>
      {icon ? (
        <Icons name={icon} onClick={() => setOpen(!open)} className={open ? 'active' : undefined} />
      ) : (
        <S.ConnectionLabel onClick={() => setOpen(!open)} className={open ? 'active' : undefined}>
          Login
        </S.ConnectionLabel>
      )}

      {open && (
        <S.ConnectionSelectorBox>
          {connection.methods.map(method => {
            const active = method.name === connection.method;
            const accounts = active
              ? (connection.accounts || []).map((address, index) => ({
                  name: `${index}: ${address}`,
                  value: address,
                }))
              : [];

            return (
              <ConnectionButton
                key={method.name}
                name={method.name}
                label={method.label}
                icon={method.icon}
                active={active}
                connection={connection}
                accounts={accounts}
              />
            );
          })}
        </S.ConnectionSelectorBox>
      )}
    </S.ConnectionSelector>
  );
};

export default ConnectionSelector;
