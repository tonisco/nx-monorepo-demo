import { render } from '@testing-library/react';

import StoreUtilFormatters from './store-util-formatters';

describe('StoreUtilFormatters', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StoreUtilFormatters />);
    expect(baseElement).toBeTruthy();
  });
});
