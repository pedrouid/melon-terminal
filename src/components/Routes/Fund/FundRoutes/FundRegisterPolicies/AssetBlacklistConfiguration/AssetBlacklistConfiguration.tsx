import React from 'react';
import * as Yup from 'yup';
import * as S from './AssetBlacklistConfiguration.styles';

import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, AssetBlacklist } from '@melonproject/melonjs';

import { AvailablePolicy } from '~/utils/availablePolicies';
import { AssetBlacklistBytecode } from '@melonproject/melonjs/abis/AssetBlacklist.bin';

interface AssetBlacklistConfigurationForm {
  assetBlacklist: string[];
}

export interface AssetBlacklistConfigurationProps {
  policyManager: string;
  policy: AvailablePolicy;
  startTransaction: (tx: Deployment<AssetBlacklist>, name: string) => void;
}

export const AssetBlacklistConfiguration: React.FC<AssetBlacklistConfigurationProps> = props => {
  const environment = useEnvironment()!;

  const tokens = environment.deployment.thirdPartyContracts.tokens;

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
    const tx = AssetBlacklist.deploy(environment, AssetBlacklistBytecode, environment!.account!, data.assetBlacklist);
    props.startTransaction(tx, 'Deploy AssetBlacklist Contract');
  });

  return (
    <>
      <S.Title>Configure AssetBlacklist policy</S.Title>
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
          <SubmitButton label="Add AssetBlacklist policy" />
        </form>
      </FormContext>
    </>
  );
};

export default AssetBlacklistConfiguration;
