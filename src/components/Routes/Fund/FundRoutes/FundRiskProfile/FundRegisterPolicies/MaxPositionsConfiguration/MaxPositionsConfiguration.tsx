import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { MaxPositions, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { MaxPositionsBytecode } from '@melonproject/melonjs/abis/MaxPositions.bin';
import { useAccount } from '~/hooks/useAccount';
import { Button } from '~/storybook/components/Button/Button';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { BlockActions } from '~/storybook/components/Block/Block';

interface MaxPositionsConfigurationForm {
  maxPositions: number;
}

export interface MaxPositionsConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<MaxPositions>, name: string) => void;
}

export const MaxPositionsConfiguration: React.FC<MaxPositionsConfigurationProps> = props => {
  const environment = useEnvironment()!;
  const account = useAccount();

  const validationSchema = Yup.object().shape({
    maxPositions: Yup.number()
      .required()
      .positive(),
  });

  const form = useForm<MaxPositionsConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const tx = MaxPositions.deploy(environment, MaxPositionsBytecode, account.address!, data.maxPositions!);
    props.startTransaction(tx, 'Deploy MaxPositions Contract');
  });

  return (
    <>
      <SectionTitle>Configure max positions policy</SectionTitle>

      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="maxPositions" label="Maximum number of positions">
            <Input name="maxPositions" type="number" id="maxPositions" />
          </FormField>
          <BlockActions>
            <Button type="submit">Add max positions policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default MaxPositionsConfiguration;
