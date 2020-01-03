import React from 'react';
import { TextArea } from './Textarea';

export default { title: 'Atoms|TextArea' };

export const Default = () => <TextArea />;

export const Disabled = () => <TextArea disabled />;

export const Placeholder = () => <TextArea placeholder="placeholder" />;
