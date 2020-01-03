import React from 'react';
import * as G from 'react-awesome-styled-grid';
import { Block } from '../Block/Block';
import styled from 'styled-components';

export const Col = styled(G.Col)`
  margin-bottom: ${props => props.theme.spaceUnits.m};
`;

export interface GridProps {
  layout: 'default' | 'fund' | 'small-center' | 'medium-center';
}

export const Grid: React.FC<GridProps> = props => {
  return (
    <G.Container>
      {props.layout === 'default' && (
        <G.Row>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Block>
              xs={12} sm={6} md={4} lg={3}
            </Block>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Block>
              xs={12} sm={6} md={4} lg={3}
            </Block>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Block>
              xs={12} sm={6} md={4} lg={3}
            </Block>
          </Col>
        </G.Row>
      )}
      {props.layout === 'fund' && (
        <G.Row>
          <Col xs={12} sm={6} md={3} lg={3}>
            <Block>
              xs={12} sm={6} md={3} lg={3}
            </Block>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <Block>
              xs={12} sm={6} md={6} lg={6}
            </Block>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <Block>
              xs={12} sm={6} md={3} lg={3}
            </Block>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Block>
              xs={6} sm={6} md={6} lg={6}
            </Block>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Block>
              xs={6} sm={6} md={6} lg={6}
            </Block>
          </Col>
        </G.Row>
      )}
      {props.layout === 'small-center' && (
        <G.Row justify="center">
          <Col xs={12} sm={8} md={5} lg={4}>
            <Block>
              xs={12} sm={8} md={5} lg={4}{' '}
            </Block>
          </Col>
        </G.Row>
      )}
      {props.layout === 'medium-center' && (
        <G.Row justify="center">
          <Col xs={12} sm={10} md={8} lg={8}>
            <Block>
              xs={12} sm={10} md={8} lg={8}{' '}
            </Block>
          </Col>
        </G.Row>
      )}
    </G.Container>
  );
};
