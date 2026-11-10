import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import StatusPill from './StatusPill'

describe('StatusPill', () => {
  it('показывает текущий статус', () => {
    render(<StatusPill value="active" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /статус/i })).toHaveTextContent('Активный')
  })

  it('открывает список и вызывает onChange при выборе', () => {
    const onChange = vi.fn()
    render(<StatusPill value="lead" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /статус/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('option', { name: /неактивный/i }))
    expect(onChange).toHaveBeenCalledWith('inactive')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('закрывается по Escape', () => {
    render(<StatusPill value="lead" onChange={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: /статус/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('не открывается в disabled', () => {
    render(<StatusPill value="lead" onChange={() => {}} disabled />)
    fireEvent.click(screen.getByRole('button', { name: /статус/i }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})