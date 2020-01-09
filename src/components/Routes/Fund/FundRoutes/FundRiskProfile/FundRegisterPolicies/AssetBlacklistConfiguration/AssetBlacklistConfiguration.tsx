import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetBlacklist, PolicyDefinition, availableTokens } from '@melonproject/melonjs';
import { AssetBlacklistBytecode } from '@melonproject/melonjs/abis/AssetBlacklist.bin';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/components/Title/Title';

interface AssetBlacklistConfigurationForm {
  assetBlacklist: string[];
}

export interface AssetBlacklistConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<AssetBlacklist>, name: string) => void;
}

export const AssetBlacklistConfiguration: React.FC<AssetBlacklistConfigurationProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const tokens = availableTokens(environment.deployment);

  const validationSchema = Yup.object().shape({
    assetBlacklist: Yup.array<string>()
      .compact()
      .min(1),
  });

  const form = useForm<AssetBlacklistConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const tx = AssetBlacklist.deploy(environment, AssetBlacklistBytecode, account.address!, data.assetBlacklist);
    props.startTransaction(tx, 'Deploy AssetBlacklist Contract');
  });

  return (
    <>
      <SectionTitle>Configure asset blacklist policy</SectionTitle>
      <ul>
        {tokens.map((token, index) => (
          <li key={token.address}>
            <input
              id={`assetBlacklist[${index}]`}
              type="checkbox"
              name={`assetBlacklist[${index}]`}
              value={token.address}
              key={token.symbol}
              ref={form.register}
            />
            <label htmlFor={`assetBlacklist[${index}]`}>{token.symbol}</label>
          </li>
        ))}
      </ul>
      <p>&nbsp;</p>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <SubmitButton label="Add asset blacklist policy" />
        </form>
      </FormContext>
    </>
  );
};

export default AssetBlacklistConfiguration;
