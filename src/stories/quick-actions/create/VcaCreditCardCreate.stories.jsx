import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VcaCreditCardCreate } from '../../../components/quick-actions/create/VcaCreditCardCreate';

export default {
  title: 'Quick-Actions/VcaCreditCardCreate',
  component: VcaCreditCardCreate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    entity: { control: 'object' },
    environment: { control: 'string' },
    apiKey: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minWidth:'600px' }}>
        <Story />
      </div>
    ),
  ],
};

const Template = (args) => (
  <MemoryRouter>
    <VcaCreditCardCreate {...args} />
  </MemoryRouter>
);

export const Verified = Template.bind({});
Verified.args = {
  entity: { is_verified: true },
  environment: 'development',
  apiKey: '',
};

export const NotVerified = Template.bind({});
NotVerified.args = {
  entity: { is_verified: false },
  environment: 'development',
  apiKey: '',
};
