import React from 'react';
import * as Yup from 'yup';
import useForm, { FormContext } from 'react-hook-form';
import { SetupDefinitionProps } from '~/components/Routes/Setup/Setup';
import { InputField } from '~/components/Common/Form/InputField/InputField';
import { SubmitButton } from '~/components/Common/Form/SubmitButton/SubmitButton';
import { ButtonBlock } from '~/components/Common/Form/ButtonBlock/ButtonBlock';
import { CancelButton } from '~/components/Common/Form/CancelButton/CancelButton';
import { useEnvironment } from '~/hooks/useEnvironment';
import { availableExchanges, availableTokens } from '@melonproject/melonjs';

export interface SetupDefineFundForm {
  name: string;
  exchanges: any[];
  assets: any[];
}

export const SetupDefineFund: React.FC<SetupDefinitionProps> = props => {
  const environment = useEnvironment()!;
  const exchanges = availableExchanges(environment.deployment);
  const tokens = availableTokens(environment.deployment);

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1),
    exchanges: Yup.array<string>()
      .compact()
      .min(1),
    assets: Yup.array<string>()
      .compact()
      .min(1),
  });

  const form = useForm<SetupDefineFundForm>({
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
              <li key={exchange.name}>
                <input
                  id={`exchanges[${index}]`}
                  type="checkbox"
                  name={`exchanges[${index}]`}
                  value={exchange.name}
                  ref={form.register}
                />
                <label htmlFor={`exchanges[${index}]`}>{exchange.name}</label>
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