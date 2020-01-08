import React from 'react';
import * as Yup from 'yup';
import * as S from './PriceToleranceConfiguration.styles';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { PriceTolerance, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { PriceToleranceBytecode } from '@melonproject/melonjs/abis/PriceTolerance.bin';
import { useAccount } from '~/hooks/useAccount';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';

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
  const account = useAccount();

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
    const tx = PriceTolerance.deploy(environment, PriceToleranceBytecode, account.address!, data.priceTolerance!);
    props.startTransaction(tx, 'Deploy PriceTolerance Contract');
  });

  return (
    <>
      <S.Title>Configure Price Tolerance policy</S.Title>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="priceTolerance" label="Price tolerance (%)">
            <Input name="priceTolerance" type="number" id="priceTolerance" />
          </FormField>
          <Button type="submit">Add PriceTolerance policy</Button>
        </form>
      </FormContext>
    </>
  );
};

export default PriceToleranceConfiguration;
