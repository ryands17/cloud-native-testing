import axios from 'axios'

const URL = process.env.API_URL

test('if the api was successful', async () => {
  const response = await axios.get(`${URL}/another`)

  expect(response.status).toEqual(200)
  expect(response.data).toEqual({ success: true, message: 'api2' })
})
