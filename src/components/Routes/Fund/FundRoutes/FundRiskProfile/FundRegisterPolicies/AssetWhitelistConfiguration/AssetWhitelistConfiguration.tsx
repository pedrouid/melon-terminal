import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { Button } from '~/storybook/components/Button/Button';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetWhitelist, availableTokens, PolicyDefinition } from '@melonproject/melonjs';
import { AssetWhitelistBytecode } from '@melonproject/melonjs/abis/AssetWhitelist.bin';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { CheckboxContainer, CheckboxInput, CheckboxMask, CheckboxIcon, CheckboxLabel } from '~/storybook/components/Checkbox/Checkbox';

interface AssetWhitelistConfigurationForm {
  assetWhitelist: string[];
}

export interface AssetWhitelistConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<AssetWhitelist>, name: string) => void;
}

export const AssetWhitelistConfiguration: React.FC<AssetWhitelistConfigurationProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();
  const tokens = availableTokens(environment.deployment);

  const validationSchema = Yup.object().shape({
    assetWhitelist: Yup.array<string>()
      .compact()
      .min(1),
  });

  const form = useForm<AssetWhitelistConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const tx = AssetWhitelist.deploy(environment, AssetWhitelistBytecode, account.address!, data.assetWhitelist);
    props.startTransaction(tx, 'Deploy AssetWhitelist Contract');
  });

  return (
    <>
      <SectionTitle>Configure asset whitelist policy</SectionTitle>
      <ul>
        {tokens.map((token, index) => (
          <li key={token.address}>
            <CheckboxContainer>
              <CheckboxInput
                id={`assetWhitelist[${index}]`}
                type="checkbox"
                name={`assetWhitelist[${index}]`}
                value={token.address}
                key={token.symbol}
                ref={form.register}
              />
              <CheckboxMask>
                <CheckboxIcon>
                </CheckboxIcon>
              </CheckboxMask>
              <CheckboxLabel htmlFor={`assetWhitelist[${index}]`}>{token.symbol}</CheckboxLabel>
            </CheckboxContainer>
          </li>
        ))}
      </ul>
      <p>&nbsp;</p>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Button type="submit">Add asset whitelist policy</Button>
        </form>
      </FormContext>
    </>
  );
};

export default AssetWhitelistConfiguration;
