import { render } from '@testing-library/react';

import ApiUtilInterface from './api-util-interface';

describe('ApiUtilInterface', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApiUtilInterface />);
    expect(baseElement).toBeTruthy();
  });
});
