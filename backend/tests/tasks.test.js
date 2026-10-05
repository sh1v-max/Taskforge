import { describe, it, expect, beforeEach } from 'vitest'
import { api, auth, signUp } from './helpers.js'

let token

beforeEach(async () => {
  token = await signUp()
})

const createTask = (body, t = token) => api().post('/api/tasks').set(auth(t)).send(body)

describe('POST /api/tasks', () => {
  it('blocks requests without a token', async () => {
    expect((await api().post('/api/tasks').send({ title: 'x' })).status).toBe(401)
  })

  it('creates a task for the logged-in user with defaults applied', async () => {
    const res = await createTask({ title: 'Write tests' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ title: 'Write tests', status: 'pending' })
  })

  it('trims the title', async () => {
    const res = await createTask({ title: '   Write tests   ' })
    expect(res.body.title).toBe('Write tests')
  })

  it('ignores a user id sent in the body', async () => {
    const ravi = await signUp('ravi@example.com')
    const me = await api().get('/api/auth/me').set(auth(token))
    const res = await createTask({ title: 'mine', user: 'someone-else' })
    expect(res.status).toBe(201)
    expect(res.body.user).toBe(me.body.user.id)
    expect((await api().get('/api/tasks').set(auth(ravi))).body.total).toBe(0)
  })

  it('says which field is wrong when the title is missing', async () => {
    const res = await createTask({ description: 'no title' })
    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('title')
  })

  it('rejects an unknown status', async () => {
    const res = await createTask({ title: 'x', status: 'done' })
    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('status')
  })

  it('accepts an ISO due date, as the frontend sends it', async () => {
    const res = await createTask({ title: 'x', dueDate: '2026-12-01T00:00:00.000Z' })
    expect(res.status).toBe(201)
    expect(res.body.dueDate).toBe('2026-12-01T00:00:00.000Z')
  })
})

describe('GET /api/tasks', () => {
  it('lists only my tasks, with paging', async () => {
    await createTask({ title: 'mine 1' })
    await createTask({ title: 'mine 2' })
    const ravi = await signUp('ravi@example.com')
    await createTask({ title: 'not mine' }, ravi)

    const res = await api().get('/api/tasks?limit=1').set(auth(token))
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(2)
    expect(res.body.tasks).toHaveLength(1)
  })

  it('filters by status', async () => {
    await createTask({ title: 'a', status: 'completed' })
    await createTask({ title: 'b' })
    const res = await api().get('/api/tasks?status=completed').set(auth(token))
    expect(res.body.tasks.map((t) => t.title)).toEqual(['a'])
  })

  it('sorts by an allowed field', async () => {
    await createTask({ title: 'banana' })
    await createTask({ title: 'apple' })
    const res = await api().get('/api/tasks?sortBy=title:asc').set(auth(token))
    expect(res.status).toBe(200)
    expect(res.body.tasks.map((t) => t.title)).toEqual(['apple', 'banana'])
  })

  it('refuses to sort on fields that are not on the list', async () => {
    const res = await api().get('/api/tasks?sortBy=user:asc').set(auth(token))
    expect(res.status).toBe(400)
    expect(res.body.errors[0].field).toBe('sortBy')
  })

  it('rejects a limit over 100', async () => {
    expect((await api().get('/api/tasks?limit=500').set(auth(token))).status).toBe(400)
  })
})

describe('GET, PUT, DELETE /api/tasks/:id', () => {
  it('reads, updates and deletes my own task', async () => {
    const { body: task } = await createTask({ title: 'draft' })

    const read = await api().get(`/api/tasks/${task._id}`).set(auth(token))
    expect(read.body.title).toBe('draft')

    const updated = await api().put(`/api/tasks/${task._id}`).set(auth(token)).send({ status: 'in-progress' })
    expect(updated.status).toBe(200)
    expect(updated.body).toMatchObject({ title: 'draft', status: 'in-progress' })

    expect((await api().delete(`/api/tasks/${task._id}`).set(auth(token))).status).toBe(200)
    expect((await api().get(`/api/tasks/${task._id}`).set(auth(token))).status).toBe(404)
  })

  it('clears description and due date when sent as empty string and null', async () => {
    const { body: task } = await createTask({
      title: 'draft',
      description: 'some notes',
      dueDate: '2026-12-01T00:00:00.000Z',
    })

    // This is what the edit form sends when the user empties both fields
    const res = await api().put(`/api/tasks/${task._id}`).set(auth(token)).send({
      title: 'draft',
      status: 'pending',
      description: '',
      dueDate: null,
    })
    expect(res.status).toBe(200)
    expect(res.body.description).toBe('')
    expect(res.body.dueDate).toBeNull()
  })

  it('keeps fields that are left out of an update', async () => {
    const { body: task } = await createTask({ title: 'draft', description: 'some notes' })
    const res = await api().put(`/api/tasks/${task._id}`).set(auth(token)).send({ status: 'completed' })
    expect(res.body).toMatchObject({ description: 'some notes', status: 'completed' })
  })

  it('validates updates too', async () => {
    const { body: task } = await createTask({ title: 'draft' })
    const res = await api().put(`/api/tasks/${task._id}`).set(auth(token)).send({ status: 'done' })
    expect(res.status).toBe(400)
  })

  it("can't read, edit or delete someone else's task", async () => {
    const ravi = await signUp('ravi@example.com')
    const { body: task } = await createTask({ title: 'private' }, ravi)

    expect((await api().get(`/api/tasks/${task._id}`).set(auth(token))).status).toBe(404)
    expect((await api().put(`/api/tasks/${task._id}`).set(auth(token)).send({ title: 'mine now' })).status).toBe(404)
    expect((await api().delete(`/api/tasks/${task._id}`).set(auth(token))).status).toBe(404)
    expect((await api().get(`/api/tasks/${task._id}`).set(auth(ravi))).body.title).toBe('private')
  })

  it('answers 400 for a malformed id instead of crashing', async () => {
    expect((await api().get('/api/tasks/not-an-id').set(auth(token))).status).toBe(400)
  })
})
