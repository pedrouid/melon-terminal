import React from 'react';
import * as Yup from 'yup';
import * as S from './UserWhitelistConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, UserWhitelist, PolicyDefinition } from '@melonproject/melonjs';
import { UserWhitelistBytecode } from '@melonproject/melonjs/abis/UserWhitelist.bin';
import { TextareaField } from '~/components/Common/Form/TextareaField/TextareaField';
import { useAccount } from '~/hooks/useAccount';

interface UserWhitelistConfigurationForm {
  userWhitelist: string;
}

export interface UserWhitelistConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<UserWhitelist>, name: string) => void;
}

export const UserWhitelistConfiguration: React.FC<UserWhitelistConfigurationProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();

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
    const tx = UserWhitelist.deploy(environment, UserWhitelistBytecode, account.address!, whitelistedUsers);
    props.startTransaction(tx, 'Deploy UserWhitelist Contract');
  });

  return (
    <>
      <S.Title>Configure user whitelist policy</S.Title>

      <FormContext {...form}>
        <form onSubmit={submit}>
          <TextareaField
            name="userWhitelist"
            label="Add users to whitelist"
            placeholder={`0x000000000000
          0x000000000000`}
            id="userWhitelist"
          />

          <SubmitButton label="Add user whitelist policy" />
        </form>
      </FormContext>
    </>
  );
};

export default UserWhitelistConfiguration;
