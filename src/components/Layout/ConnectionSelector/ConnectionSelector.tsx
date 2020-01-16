import React, { useState } from 'react';
import ModalContainer from 'styled-react-modal';
import { useConnectionState } from '~/hooks/useConnectionState';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { Block, BlockActions } from '~/storybook/components/Block/Block';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Modal, ModalTitle, ModalContent } from '~/storybook/components/Modal/Modal';
import { Button } from '~/storybook/components/Button/Button';
import * as S from './ConnectionSelector.styles';

export const ConnectionSelector = () => {
  const [open, setOpen] = useState(false);
  const connection = useConnectionState();
  const environment = useEnvironment();
  const network = environment?.network ?? 'OFFLINE';

  return (
    <S.ConnectionSelector>
      <S.ConnectionLabel onClick={() => setOpen(!open)}>{network}</S.ConnectionLabel>

      <ModalContainer isOpen={open} onBackgroundClick={() => setOpen(false)}>
        <Modal>
          <ModalTitle>Select your preferred connection method</ModalTitle>
          <ModalContent>
            <Grid>
              {connection.methods.map(method => {
                const Component = method.component;
                const active = method.name === connection.method;
                const select = () => connection.switch(method.name);

                return (
                  <GridRow key={method.name}>
                    <GridCol>
                      <Block>
                        <Component active={active} select={select} disconnect={connection.disconnect} />
                      </Block>
                    </GridCol>
                  </GridRow>
                );
              })}
            </Grid>

            <BlockActions>
              <Button type="button" onClick={() => setOpen(false)}>Close</Button>
            </BlockActions>
          </ModalContent>
        </Modal>
      </ModalContainer>
    </S.ConnectionSelector>
  );
};

export default ConnectionSelector;
