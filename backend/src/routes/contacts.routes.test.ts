import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';
import * as repo from '../repository/contacts.repository';
import type { Contact } from '../types';

vi.mock('../repository/contacts.repository');

const mockedRepo = vi.mocked(repo);
const app = createApp();

const sampleContact: Contact = {
  id: 1,
  fullName: 'Иван Петров',
  company: 'ACME',
  email: 'ivan@acme.io',
  status: 'active',
  createdAt: '2026-11-10T10:00:00.000Z',
  updatedAt: '2026-11-10T10:00:00.000Z',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('GET /api/contacts', () => {
  it('400 при невалидном sortBy', async () => {
    const res = await request(app).get('/api/contacts?sortBy=password');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(mockedRepo.findAll).not.toHaveBeenCalled();
  });
});

describe('POST /api/contacts', () => {
  it('201 и созданный контакт при валидном теле', async () => {
    mockedRepo.create.mockResolvedValue(sampleContact);

    const res = await request(app)
      .post('/api/contacts')
      .send({ fullName: '  Иван Петров  ', company: 'ACME', email: '', status: 'active' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ data: sampleContact });
    expect(mockedRepo.create).toHaveBeenCalledWith({
      fullName: 'Иван Петров',
      company: 'ACME',
      email: null,
      status: 'active',
    });
  });

  it('400 со списком ошибок при пустом ФИО и плохом email', async () => {
    const res = await request(app).post('/api/contacts').send({
      fullName: '   ',
      company: 'ACME',
      email: 'not-an-email',
      status: 'active',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const paths = res.body.error.details.map((d: { path: string }) => d.path);
    expect(paths).toContain('fullName');
    expect(paths).toContain('email');
    expect(mockedRepo.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/contacts/:id', () => {
  it('200 при существующем контакте', async () => {
    mockedRepo.findById.mockResolvedValue(sampleContact);

    const res = await request(app).get('/api/contacts/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: sampleContact });
    expect(mockedRepo.findById).toHaveBeenCalledWith(1);
  });

  it('404 при отсутствии', async () => {
    mockedRepo.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/contacts/999999');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('PUT /api/contacts/:id', () => {
  it('200 при успешном обновлении', async () => {
    mockedRepo.update.mockResolvedValue({ ...sampleContact, status: 'lead' });

    const res = await request(app)
      .put('/api/contacts/1')
      .send({ fullName: 'Иван П.', company: 'ACME', email: null, status: 'lead' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('lead');
  });

  it('404 при отсутствии', async () => {
    mockedRepo.update.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/contacts/42')
      .send({ fullName: 'X', company: 'Y', email: null, status: 'active' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/contacts/:id', () => {
  it('204 при успехе', async () => {
    mockedRepo.remove.mockResolvedValue(true);

    const res = await request(app).delete('/api/contacts/1');

    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });

  it('404 при отсутствии', async () => {
    mockedRepo.remove.mockResolvedValue(false);

    const res = await request(app).delete('/api/contacts/42');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});