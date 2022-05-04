import axios from 'axios'

const URL = process.env.API_URL

test('if the api was successful', async () => {
  const response = await axios.get(URL)

  expect(response.status).toEqual(200)
  expect(response.data).toEqual({ success: true, message: 'api1' })
})

test('if the correct resposne is returned on passing a bad query string', async () => {
  try {
    await axios.get(`${URL}?value=bad-input`)
  } catch (error) {
    let e = error as any
    expect(e.response.status).toEqual(400)
    expect(e.response.data).toEqual({
      success: false,
      message: 'bad request',
    })
  }
})
