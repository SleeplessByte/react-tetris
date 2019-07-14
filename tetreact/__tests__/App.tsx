import React from 'react'
import { render } from '@testing-library/react'
import { App } from '../src/App';

it('App renders heading', () => {
  const { container, queryByText } = render(
    <App headingText="Hello World" />,
  );

  expect(queryByText(/Hello World/)).toBeVisible()
  expect(container.firstChild).not.toBeNull()
});

it('App renders nothing without headingText', () => {
  const { container } = render(
    <App />,
  );

  expect(container.firstChild).toBeNull()
});
