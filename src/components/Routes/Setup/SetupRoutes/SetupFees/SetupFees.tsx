import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { SetupStepsProps } from '~/components/Routes/Setup/Setup';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';

export interface SetupFeesForm {
  managementFee: number;
  performanceFee: number;
  performanceFeePeriod: number;
}

export const SetupFees: React.FC<SetupStepsProps> = props => {
  const validationSchema = Yup.object().shape({
    managementFee: Yup.number()
      .min(0)
      .max(100),
    performanceFee: Yup.number()
      .min(0)
      .max(100),
    performanceFeePeriod: Yup.number().min(0),
  });

  const form = useForm<SetupFeesForm>({
    validationSchema,
    defaultValues: props.state,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  return (
    <>
      <h1>Fees</h1>
      <FormContext {...form}>
        <form onSubmit={form.handleSubmit(data => props.forward(data))}>
          <InputField name="managementFee" label="Management Fee (%)" type="number" />
          <InputField name="performanceFee" label="Performance Fee (%)" type="number" />
          <InputField name="performanceFeePeriod" label="Performance Fee Period (days)" type="number" />
          <ButtonBlock>
            <CancelButton label="Back" onClick={() => props.back()} />
            <SubmitButton label="Next" />
          </ButtonBlock>
        </form>
      </FormContext>
    </>
  );
};
