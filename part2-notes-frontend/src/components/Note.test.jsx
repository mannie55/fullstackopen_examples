import { render, screen } from '@testing-library/react'
import Note from './Note'
import { expect, test } from 'vitest'

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

  const element = screen.findByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})