import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { SetupStepsProps } from '../../Setup';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';

export interface SetupTermsAndConditionsForm {
  termsAndConditions: boolean;
}

const terms = `
IMPORTANT NOTE: Please read the full version of this disclaimer carefully before using the MELON Protocol. YOUR
USE OF THE MELON PROTOCOL AND/OR THE SOFTWARE MAY BE SUBJECT TO THE FINANCIAL LAWS AND REGULATIONS OF VARIOUS
JURISDICTIONS. PRIOR TO USING THE MELON PROTOCOL, SEEK LEGAL ASSISTANCE TO ASSURE THAT YOU MAY USE THE SOFTWARE
IN COMPLIANCE WITH APPLICABLE LAW. FAILURE TO DO SO MAY SUBJECT YOU TO CRIMINAL AS WELL AS CIVIL PENALTIES IN
ONE OR MORE JURISDICTIONS. BY USING THIS SOFTWARE, YOU CONFIRM THAT YOU HAVE SOUGHT THE ADVICE OF COMPETENT
COUNSEL OR ARE OTHERWISE FAMILIAR WITH THE APPLICABLE LAWS AND REGULATIONS PERTAINING TO YOUR INTENDED USE OF
THE MELON PROTOCOL. BY USING THIS SOFTWARE, YOU UNDERSTAND, ACKNOWLEDGE AND ACCEPT THAT THE MELON PROTOCOL
AND/OR THE UNDERLYING SOFTWARE ARE PROVIDED “AS IS” AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND EITHER
EXPRESSED OR IMPLIED. ANY USE OF THIS OPEN SOURCE SOFTWARE RELEASED UNDER THE GNU GENERAL PUBLIC LICENSE VERSION
3 (GPL 3) IS DONE AT YOUR OWN RISK TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW ANY AND ALL
LIABILITY AS WELL AS ALL WARRANTIES, INCLUDING ANY FITNESS FOR A PARTICULAR PURPOSE WITH RESPECT TO THE MELON
PROTOCOL AND/OR THE UNDERLYING SOFTWARE AND THE USE THEREOF ARE DISCLAIMED.
`;

export const SetupTermsAndConditions: React.FC<SetupStepsProps> = props => {
  const validationSchema = Yup.object().shape({
    termsAndConditions: Yup.boolean(),
  });

  const form = useForm<SetupTermsAndConditionsForm>({
    validationSchema,
    defaultValues: props.state,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  return (
    <>
      <h1>Terms and Conditions</h1>
      <h3>Disclaimer for the use of the Melon Protocol</h3>

      <p>{terms}</p>
      <FormContext {...form}>
        <form onSubmit={form.handleSubmit(data => props.forward(data))}>
          <input id="termsAndConditions" type="checkbox" name="termsAndConditions" ref={form.register} />
          <label htmlFor="termsAndConditions">I accept the terms and conditions</label>
          <ButtonBlock>
            <CancelButton label="Back" onClick={() => props.back()} />
            <SubmitButton label="Next" />
          </ButtonBlock>
        </form>
      </FormContext>
    </>
  );
};
