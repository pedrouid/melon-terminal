import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import * as S from './Tooltip.styles';

const Trigger = (children: React.ReactNode) => ({ triggerRef, getTriggerProps }: any) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
    })}
  >
    {children}
  </span>
);

const TooltipBase = (tooltip: React.ReactNode) => ({ tooltipRef, getTooltipProps }: any) => (
  <S.Container
    {...getTooltipProps({
      ref: tooltipRef,
    })}
  >
    {tooltip}
  </S.Container>
);

export interface TooltipProps {
  value?: string | number | React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ value, children, ...props }) => (
  <TooltipTrigger {...props} tooltip={TooltipBase(value)}>
    {Trigger(children)}
  </TooltipTrigger>
);
