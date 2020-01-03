import React from 'react';
import * as S from './DataBlock.styles';

export interface DataBlockProps {
  label: React.ReactNode;
  content: React.ReactNode;
}

export const DataBlock: React.FC<DataBlockProps> = props => {
  return (
    <S.DataBlock>
      <S.DataBlockLabel>{props.label}</S.DataBlockLabel>
      <S.DataBlockContent>{props.content}</S.DataBlockContent>
    </S.DataBlock>
  );
};
