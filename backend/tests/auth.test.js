import { describe, it, expect } from 'vitest'
import User from '../src/models/User.js'
import { api, auth, signUp } from './helpers.js'

const asha = { name: 'Asha', email: 'asha@example.com', password: 'secret123' }

describe('POST /api/auth/register', () => {
  it('creates a user and returns a token, never the password', async () => {
    const res = await api().post('/api/auth/register').send(asha)
    expect(res.status).toBe(201)
    expect(res.body.token).toEqual(expect.any(String))
    expect(res.body.user).toMatchObject({ name: 'Asha', email: asha.email })
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('stores a bcrypt hash, not the plain password', async () => {
    await api().post('/api/auth/register').send(asha)
    const saved = await User.findOne({ email: asha.email })
    expect(saved.password).not.toBe(asha.password)
    expect(saved.password).toMatch(/^\$2[aby]\$10\$/)
  })

  it('normalises the email before saving', async () => {
    const res = await api().post('/api/auth/register').send({ ...asha, email: '  Asha@Example.COM ' })
    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('asha@example.com')
  })

  it('rejects a duplicate email', async () => {
    await api().post('/api/auth/register').send(asha)
    const res = await api().post('/api/auth/register').send(asha)
    expect(res.status).toBe(400)
  })

  it('reports every invalid field, by name', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'A', email: 'nope', password: '123' })
    expect(res.status).toBe(400)
    expect(res.body.errors.map((e) => e.field).sort()).toEqual(['email', 'password'])
  })
})

describe('POST /api/auth/login', () => {
  it('returns a token for the right password', async () => {
    await signUp()
    const res = await api().post('/api/auth/login').send({ email: asha.email, password: asha.password })
    expect(res.status).toBe(200)
    expect(res.body.token).toEqual(expect.any(String))
  })

  it('gives the same answer for a wrong password and an unknown email', async () => {
    await signUp()
    const wrongPass = await api().post('/api/auth/login').send({ email: asha.email, password: 'wrongpass' })
    const noUser = await api().post('/api/auth/login').send({ email: 'ghost@example.com', password: 'wrongpass' })
    expect(wrongPass.status).toBe(400)
    expect(noUser.status).toBe(400)
    expect(wrongPass.body.message).toBe(noUser.body.message)
  })
})

describe('GET /api/auth/me', () => {
  it('needs a token', async () => {
    expect((await api().get('/api/auth/me')).status).toBe(401)
  })

  it('rejects a forged token', async () => {
    expect((await api().get('/api/auth/me').set(auth('not.a.real.token'))).status).toBe(401)
  })

  it('returns the profile without the password', async () => {
    const token = await signUp()
    const res = await api().get('/api/auth/me').set(auth(token))
    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ name: 'Asha', email: asha.email })
    expect(res.body.user).not.toHaveProperty('password')
  })
})

describe('PUT /api/auth/me', () => {
  it('changes the password only when the current one is right', async () => {
    const token = await signUp()

    const wrong = await api().put('/api/auth/me').set(auth(token)).send({ currentPassword: 'wrongpass', newPassword: 'newpass123' })
    expect(wrong.status).toBe(400)

    const right = await api().put('/api/auth/me').set(auth(token)).send({ currentPassword: asha.password, newPassword: 'newpass123' })
    expect(right.status).toBe(200)

    const login = await api().post('/api/auth/login').send({ email: asha.email, password: 'newpass123' })
    expect(login.status).toBe(200)
  })

  it('refuses a new password without the current one', async () => {
    const token = await signUp()
    const res = await api().put('/api/auth/me').set(auth(token)).send({ newPassword: 'newpass123' })
    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('currentPassword')
  })
})
