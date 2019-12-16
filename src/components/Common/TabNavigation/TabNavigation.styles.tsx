import styled from 'styled-components';

export const Menu = styled.div`
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
`;

export const MenuItem = styled.span`
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: bold;
  margin-right: 12px;
  font-size: 1.125rem;
  font-weight: bold;
  padding-bottom: 3px;
  border-bottom: ${(props: { active?: boolean }) => (props.active ? '1px solid rgba(34,36,38,0.15)' : 'none')};
`;
