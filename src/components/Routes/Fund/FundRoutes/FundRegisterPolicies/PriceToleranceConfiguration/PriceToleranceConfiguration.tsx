import React from 'react';
import * as Yup from 'yup';
import * as S from './PriceToleranceConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { useEnvironment } from '~/hooks/useEnvironment';
import { PriceTolerance, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { PriceToleranceBytecode } from '@melonproject/melonjs/abis/PriceTolerance.bin';

interface PriceToleranceConfigurationForm {
  priceTolerance: number;
}

export interface PriceToleranceConfigurationProps {
  policyManager: string;
  policy: PolicyDefinition;
  startTransaction: (tx: Deployment<PriceTolerance>, name: string) => void;
}

export const PriceToleranceConfiguration: React.FC<PriceToleranceConfigurationProps> = props => {
  const environment = useEnvironment()!;

  const validationSchema = Yup.object().shape({
    priceTolerance: Yup.number()
      .required()
      .positive()
      .max(100),
  });

  const form = useForm<PriceToleranceConfigurationForm>({
    validationSchema,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const submit = form.handleSubmit(async data => {
    const tx = PriceTolerance.deploy(environment, PriceToleranceBytecode, environment!.account!, data.priceTolerance!);
    props.startTransaction(tx, 'Deploy PriceTolerance Contract');
  });

  return (
    <>
      <S.Title>Configure Price Tolerance policy</S.Title>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <InputField name="priceTolerance" label="Price tolerance (%)" type="number" id="priceTolerance" />
          <SubmitButton label="Add PriceTolerance policy" />
        </form>
      </FormContext>
    </>
  );
};

export default PriceToleranceConfiguration;
