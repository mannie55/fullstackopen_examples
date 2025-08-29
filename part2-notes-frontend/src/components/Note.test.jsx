import { render, screen } from '@testing-library/react'
import Note from './Note'
import { expect, test, vi } from 'vitest'
import userEvent from '@testing-library/user-event'


test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  /*
  getByText method does not find the element,
  if we want to look for an element that contains the text,
  we could use an the '{ exact: false }'
  or we use findByText method which returns a promise
   */

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()

  // const { container } = render(<Note note={note} />)

  // const div = container.querySelector('.note')
  // expect(div).toHaveTextContent('Component testing is done with react-testing-library')

  // screen.debug(element)
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})