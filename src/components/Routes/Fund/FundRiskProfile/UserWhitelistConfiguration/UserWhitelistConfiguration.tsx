import React from 'react';
import * as Yup from 'yup';
import { useForm, FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { Deployment, UserWhitelist, PolicyDefinition, zeroAddress } from '@melonproject/melonjs';
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
    userWhitelist: Yup.string().required(),
    // .test('valid-addresses', 'Invalid address format.', (value: string) => {
    //   const valid = value
    //     .replace(/^\s+|\s+$/g, '')
    //     .split('\n')
    //     .map(user => isAddress(user));

    //   if (valid.some(current => current === false)) {
    //     return false;
    //   }

    //   return true;
    // }),
  });

  const form = useForm<UserWhitelistConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      userWhitelist: '',
    },
  });

  const submit = form.handleSubmit(async data => {
    const whitelistedUsers = data.userWhitelist!.replace(/^\s+|\s+$/g, '').split('\n');
    const tx = UserWhitelist.deploy(environment, UserWhitelistBytecode, account.address!, whitelistedUsers);
    props.startTransaction(tx, 'Deploy UserWhitelist Contract');
  });

  return (
    <>
      <SectionTitle>Configure User Whitelist Policy</SectionTitle>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <Textarea name="userWhitelist" placeholder={`${zeroAddress}\n${zeroAddress}`} id="userWhitelist" />
          <BlockActions>
            <Button type="submit">Add User Whitelist Policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default UserWhitelistConfiguration;
