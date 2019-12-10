import styled from 'styled-components';
import { animated } from 'react-spring';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0 10px 0;
  padding-left: 10px;
  padding-right: 10px;
`;

export const ProgressBar = styled.div`
  background-color: rgba(211, 211, 211, 0.6);
  position: absolute;
  width: calc(100% - 20px);
  border-radius: 10px;
  height: 10px;
`;

export const Progress = styled(animated.div)`
  height: 10px;
  width: 0;
  background-color: rgb(0, 116, 217, 0.8);
  border-radius: 10px;
`;

export const BadgeContainer = styled.div`
  width: 100%;
  display: flex;
  z-index: 1;
  justify-content: space-between;
`;

export const Badge = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  background-color: rgba(${(props: { selected?: boolean }) => (props.selected ? '0, 116, 217' : '211, 211, 211')});
  z-index: 1;
  &:first-child {
    transform: translateX(-50%);
  }

  &:last-child {
    transform: translateX(50%);
  }
`;
