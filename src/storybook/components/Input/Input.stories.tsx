import React from 'react';
import { Input } from './Input';

export default { title: 'Atoms|Input' };

export const Default = () => <Input />;

export const Disabled = () => <Input disabled={true} />;

export const Placeholder = () => <Input placeholder="placeholder" />;
