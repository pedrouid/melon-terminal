import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SetupStepNavigationWrapper = styled.div`
  margin-bottom: 16px;
  box-sizing: border-box;
`;

export const SetupStepNavigationList = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: hsl(0, 0%, 95%);
  overflow: hidden;
  counter-reset: a;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
`;

export const SetupStepNavigationItem = styled.li`
  background-color: rgb(249, 242, 219);
  font-weight: 700;
  flex: 1;
  min-width: 1px;
  list-style-type: none;
  text-align: center;
  display: inline-flex;
  position: relative;
`;

export const SetupStepNavigationLink = styled(NavLink)``;
