import React from 'react';
import Modal, { ModalProps } from 'styled-react-modal';
import { TransactionHookValues } from '~/hooks/useTransactionNew';
import { TransactionModalProgressBar } from './TransactionModalProgressBar/TransactionModalProgressBar';
import { TransactionModalForm } from './TransactionModalForm/TransactionModalForm';
import * as S from './TransactionModal.styles';

export interface TransactionModalProps extends Omit<Partial<ModalProps>, 'isOpen'> {
  label: string;
  transaction: TransactionHookValues;
  acknowledge?: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ label, transaction, acknowledge, ...rest }) => {
  const close = () => {
    if (acknowledge) {
      acknowledge();
    }

    transaction.reset();
  };

  return (
    <Modal isOpen={transaction.state.progress != null} {...rest}>
      <S.TransactionModal>
        <S.TransactionModalTitle>{label}</S.TransactionModalTitle>
        <S.TransactionModalContent>
          <TransactionModalProgressBar transaction={transaction.state} />
          {transaction.state.error && (
            <S.TransactionModalError>{transaction.state.error.message}</S.TransactionModalError>
          )}
          <TransactionModalForm
            transaction={transaction.state}
            execute={transaction.execute}
            reset={transaction.reset}
            close={close}
          />
        </S.TransactionModalContent>
      </S.TransactionModal>
    </Modal>
  );
};
