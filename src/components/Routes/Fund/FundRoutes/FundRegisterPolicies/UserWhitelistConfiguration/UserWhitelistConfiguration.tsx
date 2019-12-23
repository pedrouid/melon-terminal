import React from 'react';
import * as Yup from 'yup';
import * as S from './UserWhitelistConfiguration.styles';

import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, UserWhitelist } from '@melonproject/melonjs';

import { AvailablePolicy } from '~/utils/availablePolicies';
import { BigNumber } from 'bignumber.js';
import { UserWhitelistBytecode } from '@melonproject/melonjs/abis/UserWhitelist.bin';
import { TextareaField } from '~/components/Common/Form/TextareaField/TextareaField';

interface UserWhitelistConfigurationForm {
  userWhitelist: string;
}

export interface UserWhitelistConfigurationProps {
  policyManager: string;
  policy: AvailablePolicy;
  startTransaction: (tx: Deployment<UserWhitelist>, name: string) => void;
}

export const UserWhitelistConfiguration: React.FC<UserWhitelistConfigurationProps> = props => {
  const environment = useEnvironment()!;

  const validationSchema = Yup.object().shape({
    userWhitelist: Yup.string(),
  });

  const form = useForm<UserWhitelistConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const whitelistedUsers = data.userWhitelist!.replace(/^\s+|\s+$/g, '').split('\n');
    const tx = UserWhitelist.deploy(environment, UserWhitelistBytecode, environment!.account!, whitelistedUsers);
    props.startTransaction(tx, 'Deploy UserWhitelist Contract');
  });

  return (
    <>
      <S.Title>Configure UserWhitelist policy</S.Title>

      <FormContext {...form}>
        <form onSubmit={submit}>
          <TextareaField
            name="userWhitelist"
            label="Add users to whitelist"
            placeholder={`0x000000000000
          0x000000000000`}
            id="userWhitelist"
          />
          <SubmitButton label="Add UserWhitelist policy" />
        </form>
      </FormContext>
    </>
  );
};

export default UserWhitelistConfiguration;
