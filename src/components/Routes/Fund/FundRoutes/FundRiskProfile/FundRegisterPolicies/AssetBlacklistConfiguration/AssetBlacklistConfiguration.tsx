import React from 'react';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { Button } from '~/storybook/components/Button/Button';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetBlacklist, PolicyDefinition, availableTokens } from '@melonproject/melonjs';
import { AssetBlacklistBytecode } from '@melonproject/melonjs/abis/AssetBlacklist.bin';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { BlockActions } from '~/storybook/components/Block/Block';
import {
  CheckboxContainer,
  CheckboxInput,
  CheckboxMask,
  CheckboxIcon,
  CheckboxLabel,
} from '~/storybook/components/Checkbox/Checkbox';
import { Grid, GridRow, GridCol } from '~/storybook/components/Grid/Grid';
import { FormField } from '~/storybook/components/FormField/FormField';

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
      .label('Asset blacklist')
      .compact()
      .min(1, 'Select at least one asset'),
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
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Grid>
            <GridRow>
              {tokens.map((token, index) => (
                <GridCol xs={4} sm={3} md={2.4} key={token.address}>
                  <FormField name="assetBlacklist">
                    <CheckboxContainer>
                      <CheckboxInput
                        id={`assetBlacklist[${index}]`}
                        type="checkbox"
                        name={`assetBlacklist[${index}]`}
                        value={token.address}
                        key={token.symbol}
                        ref={form.register}
                      />
                      <CheckboxMask>
                        <CheckboxIcon />
                      </CheckboxMask>
                      <CheckboxLabel htmlFor={`assetBlacklist[${index}]`}>{token.symbol}</CheckboxLabel>
                    </CheckboxContainer>
                  </FormField>
                </GridCol>
              ))}
            </GridRow>
          </Grid>

          <BlockActions>
            <Button type="submit">Add asset blacklist policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default AssetBlacklistConfiguration;
