import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { SetupStepsProps } from '~/components/Routes/Setup/Setup';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { useEnvironment } from '~/hooks/useEnvironment';

export interface SetupFundForm {
  name: string;
  exchanges: any[];
  assets: any[];
}

export const SetupFund: React.FC<SetupStepsProps> = props => {
  const environment = useEnvironment()!;
  const exchanges = Object.keys(environment.deployment.exchangeConfigs);
  const tokens = environment.deployment.thirdPartyContracts.tokens;

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1),
    exchanges: Yup.array<string>()
      .compact()
      .min(1),
    assets: Yup.array<string>()
      .compact()
      .min(1),
  });

  const form = useForm<SetupFundForm>({
    validationSchema,
    defaultValues: props.state,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  return (
    <>
      <h1>Fund</h1>
      <FormContext {...form}>
        <form onSubmit={form.handleSubmit(data => props.forward(data))}>
          <InputField id="name" name="name" label="Name" type="text" />
          <h3>Exchanges</h3>
          {form.errors.exchanges && <p>{form.errors.exchanges.message}</p>}
          <ul>
            {exchanges.map((exchange, index) => (
              <li key={exchange}>
                <input
                  id={`exchanges[${index}]`}
                  type="checkbox"
                  name={`exchanges[${index}]`}
                  value={exchange}
                  key={exchange}
                  ref={form.register}
                />
                <label htmlFor={`exchanges[${index}]`}>{exchange}</label>
              </li>
            ))}
          </ul>
          <h3>Allowed Tokens</h3>
          {form.errors.assets && <p>{form.errors.assets.message}</p>}
          <ul>
            {tokens.map((token, index) => (
              <li key={token.address}>
                <input
                  id={`assets[${index}]`}
                  type="checkbox"
                  name={`assets[${index}]`}
                  value={token.symbol}
                  key={token.symbol}
                  ref={form.register}
                />
                <label htmlFor={`assets[${index}]`}>{token.symbol}</label>
              </li>
            ))}
          </ul>
          <ButtonBlock>
            <CancelButton label="Cancel" onClick={() => props.back()} />
            <SubmitButton label="Next" />
          </ButtonBlock>
        </form>
      </FormContext>
    </>
  );
};
