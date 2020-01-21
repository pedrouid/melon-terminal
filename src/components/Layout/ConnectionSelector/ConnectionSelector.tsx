import React, { useState, useMemo } from 'react';
import ModalContainer from 'styled-react-modal';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { Modal, ModalTitle, ModalContent } from '~/storybook/components/Modal/Modal';
import { Button } from '~/storybook/components/Button/Button';
import { Dropdown } from '~/storybook/components/Dropdown/Dropdown';
import * as S from './ConnectionSelector.styles';
import { Icons } from '~/storybook/components/Icons/Icons';

export const ConnectionSelector = () => {
  const [open, setOpen] = useState(false);
  const connection = useConnectionState();

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
    <S.ConnectionSelector>
      {icon ? (
        <Icons name={icon} onClick={() => setOpen(!open)} className={open ? 'active' : undefined} />
      ) : (
        <S.ConnectionLabel onClick={() => setOpen(!open)} className={open ? 'active' : undefined}>
          Login
        </S.ConnectionLabel>
      )}

      <ModalContainer isOpen={open} onBackgroundClick={() => setOpen(false)}>
        <Modal>
          <ModalTitle>Select your preferred connection method</ModalTitle>
          <ModalContent>
            <Grid>
              {connection.methods.map(method => {
                const Component = method.component;
                const active = method.name === connection.method;
                const connect = () => connection.connect(method.name);
                const accounts = active
                  ? (connection.accounts || []).map((address, index) => ({
                      name: `${index}: ${address}`,
                      value: address,
                    }))
                  : [];

                return (
                  <GridRow key={method.name}>
                    <GridCol>
                      <Block>
                        <Component active={active} connect={connect} disconnect={connection.disconnect} />

                        {(accounts && accounts.length > 1 && (
                          <Dropdown
                            options={accounts}
                            value={connection.account}
                            onChange={event => connection.switch(event.target.value)}
                          />
                        )) ||
                          null}
                      </Block>
                    </GridCol>
                  </GridRow>
                );
              })}
            </Grid>

            <BlockActions>
              <Button type="button" onClick={() => setOpen(false)}>
                Close
              </Button>
            </BlockActions>
          </ModalContent>
        </Modal>
      </ModalContainer>
    </S.ConnectionSelector>
  );
};

export default ConnectionSelector;
