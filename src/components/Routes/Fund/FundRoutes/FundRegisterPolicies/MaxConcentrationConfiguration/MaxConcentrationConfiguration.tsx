import React from 'react';
import * as Yup from 'yup';
import * as S from './MaxConcentrationConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { useEnvironment } from '~/hooks/useEnvironment';
import { MaxConcentration, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { MaxConcentrationBytecode } from '@melonproject/melonjs/abis/MaxConcentration.bin';
import { BigNumber } from 'bignumber.js';

interface MaxConcentrationConfigurationForm {
  maxConcentration: number;
}

export interface MaxConcentrationConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<MaxConcentration>, name: string) => void;
}

export const MaxConcentrationConfiguration: React.FC<MaxConcentrationConfigurationProps> = props => {
  const environment = useEnvironment()!;

  const validationSchema = Yup.object().shape({
    maxConcentration: Yup.number()
      .required()
      .positive()
      .max(100),
  });

  const form = useForm<MaxConcentrationConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const tx = MaxConcentration.deploy(
      environment,
      MaxConcentrationBytecode,
      environment!.account!,
      new BigNumber(data.maxConcentration!).times(new BigNumber('1e16'))
    );
    props.startTransaction(tx, 'Deploy MaxConcentration Contract');
  });

  return (
    <>
      <S.Title>Configure MaxConcentration policy</S.Title>

      <FormContext {...form}>
        <form onSubmit={submit}>
          <InputField name="maxConcentration" label="Maximum concentration (%)" type="number" id="maxConcentration" />
          <SubmitButton label="Add MaxConcentration policy" />
        </form>
      </FormContext>
    </>
  );
};

export default MaxConcentrationConfiguration;
