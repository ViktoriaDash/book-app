import { render, screen } from '@testing-library/react'

describe('test', () => {
  it('should verify that testing environment works', () => {
    render(<h1>Hello!</h1>)
    const heading = screen.getByText('Hello!')
    expect(heading).toBeInTheDocument()
  })
})