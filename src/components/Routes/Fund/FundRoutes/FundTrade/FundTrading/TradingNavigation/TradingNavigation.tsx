import React, { createContext, useMemo, useState } from 'react';
import * as S from './TradingNavigation.styles';

const TradingNavigationContext = createContext<string | undefined>(undefined);

export const TradingNavigation: React.FC = ({ children }) => {
  const arrayChildren = useMemo(() => {
    return (React.Children.toArray(children).filter(child => React.isValidElement(child)) as any) as React.Component<
      any
    >[];
  }, [children]);

  const items = arrayChildren.map(item => ({
    identifier: item.props.identifier,
    label: item.props.label,
  }));

  const defaultTab = useMemo(() => {
    const implicitDefaultChild = arrayChildren && arrayChildren[0];
    const explicitDefaultChild = arrayChildren.find(child => !!child.props.default);
    const defaultChild = explicitDefaultChild || implicitDefaultChild;

    return defaultChild && defaultChild.props && defaultChild.props.identifier;
  }, [arrayChildren]);

  const [active, setActive] = useState(defaultTab);
  const activeTab = arrayChildren.find(child => child.props.identifier === active);

  return (
    <TradingNavigationContext.Provider value={active}>
      <S.Menu>
        {items.map(item => (
          <S.MenuItem
            key={item.identifier}
            onClick={() => setActive(item.identifier)}
            active={active === item.identifier}
          >
            {item.label}
          </S.MenuItem>
        ))}
      </S.Menu>

      {activeTab && activeTab.props.children}
    </TradingNavigationContext.Provider>
  );
};
