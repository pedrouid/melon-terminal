import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, UserWhitelist, PolicyDefinition } from '@melonproject/melonjs';
import { UserWhitelistBytecode } from '@melonproject/melonjs/abis/UserWhitelist.bin';
import { Textarea } from '~/storybook/components/Textarea/Textarea';
import { useAccount } from '~/hooks/useAccount';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { Button } from '~/storybook/components/Button/Button';
import { BlockActions } from '~/storybook/components/Block/Block';

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
      <SectionTitle>Configure user whitelist policy</SectionTitle>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Textarea name="userWhitelist" placeholder="0x000000000000" id="userWhitelist" />
          <BlockActions>
            <Button type="submit">Add user whitelist policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default UserWhitelistConfiguration;
