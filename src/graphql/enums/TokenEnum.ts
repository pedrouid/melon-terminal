import * as R from 'ramda';
import gql from 'graphql-tag';
import { TokenDefinition } from '~/types';
import { Environment } from '~/environment';

const defaults = {
  ETH: 'ETH',
};

export function createTokenEnum(environment: Environment) {
  const tokens = R.pathOr<TokenDefinition[]>([], ['thirdPartyContracts', 'tokens'], environment!.deployment!);
  return tokens.reduce((carry, current) => {
    return { ...carry, [current.symbol]: current.address };
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
