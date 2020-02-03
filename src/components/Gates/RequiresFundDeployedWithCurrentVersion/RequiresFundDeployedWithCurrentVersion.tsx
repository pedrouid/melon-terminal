import React from 'react';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useFundVersionQuery } from '~/queries/FundVersion';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { useVersionQuery } from '~/queries/Version';

export interface RequiresFundDeployedWithCurrentVersionProps {
  address: string;
  loader?: React.ReactElement;
  fallback?: React.ReactNode;
}

export const RequiresFundDeployedWithCurrentVersion: React.FC<RequiresFundDeployedWithCurrentVersionProps> = ({
  address,
  loader,
  children,
  fallback = true,
}) => {
  const [fundVersion, fundVersionQuery] = useFundVersionQuery(address);
  const [currentVersion, currentVersionQuery] = useVersionQuery(environment.deployment.melon.addr.Version);
  const environment = useEnvironment()!;

  if (fundVersionQuery.loading || currentVersionQuery.loading) {
    return loader || null;
  }

  if (!fundVersion || (fundVersion && fundVersion.address === environment.deployment.melon.addr.Version)) {
    return <>{children}</>;
  }

  const output =
    fallback === true ? (
      <NotificationBar kind="error">
        <NotificationContent>
          This fund is running on a deprecated version ({fundVersion.name}) of the Melon protocol. The current version
          is {currentVersion.name}.
        </NotificationContent>
      </NotificationBar>
    ) : (
      fallback
    );
  return <>{output || null}</>;
};
