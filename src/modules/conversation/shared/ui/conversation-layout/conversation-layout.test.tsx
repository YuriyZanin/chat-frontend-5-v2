import { render, screen } from '@testing-library/react';
import { ConversationLayout } from './conversation-layout';

describe('ConversationLayout', () => {
  it('рендерит header, body и footer', () => {
    render(
      <ConversationLayout
        header={<div data-testid="header">Header</div>}
        footer={<div data-testid="footer">Footer</div>}
      >
        <div data-testid="body">Body</div>
      </ConversationLayout>,
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
