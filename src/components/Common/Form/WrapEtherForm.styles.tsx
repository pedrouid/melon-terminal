import styled from 'styled-components';

export const WrapEtherForm = styled.form`
  display: block;
  margin-top: 0;
`;

export const WrapEtherFormBalances = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 0 ${props => props.theme.spaceUnits.xs} ${props => props.theme.spaceUnits.xs} 0;
  color: ${props => props.theme.otherColors.grey};
`;

export const WrapEtherFormBalance = styled.span`
  &:not(:first-child)::after {
    content: '';
    margin-right: ${props => props.theme.spaceUnits.xs};
    padding-right: ${props => props.theme.spaceUnits.xs};
    border-right: 1px solid;
  }
`;
