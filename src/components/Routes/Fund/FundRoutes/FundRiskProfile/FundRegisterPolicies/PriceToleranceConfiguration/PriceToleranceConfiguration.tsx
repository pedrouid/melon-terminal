import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { useEnvironment } from '~/hooks/useEnvironment';
import { PriceTolerance, Deployment, PolicyDefinition } from '@melonproject/melonjs';
import { PriceToleranceBytecode } from '@melonproject/melonjs/abis/PriceTolerance.bin';
import { useAccount } from '~/hooks/useAccount';
import { FormField } from '~/storybook/components/FormField/FormField';
import { Input } from '~/storybook/components/Input/Input';
import { Button } from '~/storybook/components/Button/Button';
import { SectionTitle } from '~/storybook/components/Title/Title';
import { BlockActions } from '~/storybook/components/Block/Block';

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
      .label('Price tolerance (%)')
      .required()
      .min(0)
      .max(100),
  });

  const defaultValues = {
    priceTolerance: 10,
  };

  const form = useForm<PriceToleranceConfigurationForm>({
    defaultValues,
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
      <SectionTitle>Configure price tolerance policy</SectionTitle>
      <FormContext {...form}>
        <form onSubmit={submit}>
          <FormField name="priceTolerance" label="Price tolerance (%)">
            <Input name="priceTolerance" type="number" step="any" id="priceTolerance" />
          </FormField>
          <BlockActions>
            <Button type="submit">Add price tolerance policy</Button>
          </BlockActions>
        </form>
      </FormContext>
    </>
  );
};

export default PriceToleranceConfiguration;
