import React from 'react';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Button } from '~/storybook/components/Button/Button';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetWhitelist, availableTokens, PolicyDefinition } from '@melonproject/melonjs';
import { AssetWhitelistBytecode } from '@melonproject/melonjs/abis/AssetWhitelist.bin';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Checkboxes } from '~/storybook/components/Checkbox/Checkbox';
import { BlockActions } from '~/storybook/components/Block/Block';

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
  const tokens = availableTokens(environment.deployment).filter(token => !token.historic);

  const validationSchema = Yup.object().shape({
    assetWhitelist: Yup.array<string>()
      .label('Asset whitelist')
      .compact()
      .min(1, 'Select at least one asset'),
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

  const options = tokens.map(item => ({
    label: `${item.symbol} (${item.name})`,
    value: item.address,
  }));

  return (
    <>
      <SectionTitle>Configure Asset Whitelist Policy</SectionTitle>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Checkboxes options={options} name="assetWhitelist" />

          <BlockActions>
            <Button type="submit">Add Asset Whitelist Policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default AssetWhitelistConfiguration;
