import React from 'react';
import { Button } from './Button';

export default { title: 'Atoms|Button' };

export const Default = () => <Button>default Button</Button>;

export const Large = () => <Button size="large">Large Button</Button>;

export const Small = () => <Button size="small">Small Button</Button>;

export const Secondary = () => <Button kind="secondary">secondary Button</Button>;

export const Warning = () => <Button kind="warning">warning Button</Button>;

export const Danger = () => <Button kind="danger">danger Button</Button>;

export const Success = () => <Button kind="success">success Button</Button>;

export const Disabled = () => <Button disabled={true}>Disabled Button</Button>;
