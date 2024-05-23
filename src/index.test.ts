import { expect, test, describe} from 'vitest'
import app from './index'
import axios from 'axios'

describe('Test server', () => {
  test('GET /', async () => {
    const res = await app.request(`http://localhost:8080`)
    expect(res.status).toBe(200)
  })

  test('should return 404 for unknown routes', async () => {
    const res = await app.request(`http://localhost:8080/unknown`)
    expect(res.status).toBe(404);
  });

  test('Generate with gemini', async () => {

    const postData = {"model":"gemini","chatId":"0","messages":[{"role":"user","parts":{"text":"Ответь Привет"}}],"stream":false};

    // Perform the POST request
    const response = await axios.post('http://localhost:8080/api/generate', postData);

    // Check the status code
    expect(response.status).toBe(200);
  });

  test('Test rag upload', async () => {

    const response = await axios.post('http://localhost:8080/api/rag/upload');

    // Check the status code
    expect(response.status).toBe(200);
  });

  test('Test rag list documents', async () => {

    const response = await axios.get('http://localhost:8080/api/rag/documents');

    // Check the status code
    expect(response.status).toBe(200);
  });


})