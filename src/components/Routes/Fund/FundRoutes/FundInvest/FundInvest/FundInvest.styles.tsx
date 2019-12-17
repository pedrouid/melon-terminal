import { PaddedBody } from '~/components/Common/Styles/Styles';
import styled from 'styled-components';

export const FundInvestBody = PaddedBody;

export const FundInvestForm = styled.form``;

export const DropDownWrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: rgb(234, 229, 212);

  &::before {
    content: '';
    position: absolute;
    right: 12px;
    top: 16px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgb(161, 147, 94);
    pointer-events: none;
  }
`;

export const Select = styled.select`
  font-family: 'Source Serif Pro', serif;
  appearance: none;
  border: none;
  width: 100%;
  background: transparent;
  font-size: 0.875rem;
  border-radius: 0;
  padding: 8px 32px 8px 12px;
  line-height: 1.6;
  margin: 0;
`;
