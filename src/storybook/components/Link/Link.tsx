import React from 'react';
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom';
import { useColor } from '~/hooks/useColor';

export interface ColoredLinkProps {
  colored?: boolean;
}

function createComponent<T = {}>(Component: React.ComponentType<T>): React.FC<Omit<T, 'colored'> & ColoredLinkProps> {
  return ({ colored = true, ...props }) => {
    const forwards = props as T;
    const context = useColor();

    const handleEnter = colored
      ? () => {
          context.random && context.random();
        }
      : undefined;

    const handleLeave = colored
      ? () => {
          context.reset && context.reset();
        }
      : undefined;

    return <Component onMouseEnter={handleEnter} onMouseLeave={handleLeave} {...forwards} />;
  };
}

export const Link = createComponent(BaseLink);
export const NavLink = createComponent(BaseNavLink);
