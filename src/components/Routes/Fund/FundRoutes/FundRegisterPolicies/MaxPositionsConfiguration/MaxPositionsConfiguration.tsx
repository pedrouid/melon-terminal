import React from 'react';
import * as Yup from 'yup';
import * as S from './MaxPositionsConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { useEnvironment } from '~/hooks/useEnvironment';
import { MaxPositions, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { MaxPositionsBytecode } from '@melonproject/melonjs/abis/MaxPositions.bin';
import { useAccount } from '~/hooks/useAccount';

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
      <S.Title>Configure MaxPositions policy</S.Title>

      <FormContext {...form}>
        <form onSubmit={submit}>
          <InputField name="maxPositions" label="Maximum number of positions" type="number" id="maxPositions" />
          <SubmitButton label="Add MaxPositions policy" />
        </form>
      </FormContext>
    </>
  );
};

export default MaxPositionsConfiguration;
