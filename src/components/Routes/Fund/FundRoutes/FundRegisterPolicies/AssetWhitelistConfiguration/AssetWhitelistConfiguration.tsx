import React from 'react';
import * as Yup from 'yup';
import * as S from './AssetWhitelistConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetWhitelist } from '@melonproject/melonjs';
import { AssetWhitelistBytecode } from '@melonproject/melonjs/abis/AssetWhitelist.bin';
import { PolicyDefinition } from '~/types';
import { availableTokens } from '~/utils/availableTokens';

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
    const tx = AssetWhitelist.deploy(environment, AssetWhitelistBytecode, environment!.account!, data.assetWhitelist);
    props.startTransaction(tx, 'Deploy AssetWhitelist Contract');
  });

  return (
    <>
      <S.Title>Configure AssetWhitelist policy</S.Title>
      <ul>
        {tokens.map((token, index) => (
          <li key={token.address}>
            <input
              id={`assetWhitelist[${index}]`}
              type="checkbox"
              name={`assetWhitelist[${index}]`}
              value={token.address}
              key={token.symbol}
              ref={form.register}
            />
            <label htmlFor={`assetWhitelist[${index}]`}>{token.symbol}</label>
          </li>
        ))}
      </ul>
      <p>&nbsp;</p>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <SubmitButton label="Add AssetWhitelist policy" />
        </form>
      </FormContext>
    </>
  );
};

export default AssetWhitelistConfiguration;
