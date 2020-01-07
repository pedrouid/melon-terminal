import React, { createContext, useState, useContext, useLayoutEffect } from 'react';

export interface PageTitleContextValueInterface {
  set: (title?: React.ReactNode) => void;
  title: React.ReactNode;
}

const PageTitleContext = createContext({} as PageTitleContextValueInterface);

export const PageTitleProvider: React.FC = (props) => {
  const [title, set] = useState<React.ReactNode>();

  return (
    <PageTitleContext.Provider value={{ title, set }}>
      {props.children}
    </PageTitleContext.Provider>
  );
}

export const PageTitle: React.FC = (props) => {
  const context = useContext(PageTitleContext);
  useLayoutEffect(() => {
    context.set(props.children);
    return () => context.set(undefined);
  }, [props.children]);

  return null;
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  return context.title;
} 