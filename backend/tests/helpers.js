import request from 'supertest'
import app from '../src/app.js'

export const api = () => request(app)

export const auth = (token) => ({ Authorization: `Bearer ${token}` })

export async function signUp(email = 'asha@example.com') {
  const res = await api().post('/api/auth/register').send({ name: 'Asha', email, password: 'secret123' })
  return res.body.token
}
