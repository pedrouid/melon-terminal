import gql from 'graphql-tag';
import { Environment } from '~/environment';

const defaults = {
  ETH: 'ETH',
};

export function createTokenEnum(environment: Environment): { [key: string]: string } {
  const addresses = environment.deployment.tokens.addr;
  return Object.keys(addresses).reduce((carry, current) => {
    return { ...carry, [current]: addresses[current] };
  }, defaults);
}

export function createTokenEnumDefinition(values: { [key: string]: string }) {
  const definition = Object.keys(values).join('\n');

  return gql`
    enum TokenEnum {
      ${definition}
    }
  `;
}
