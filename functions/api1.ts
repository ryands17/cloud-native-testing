import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { response } from './utils'

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (event.queryStringParameters?.value === 'bad-input') {
    return response({
      statusCode: 400,
      body: { success: false, message: 'bad request' },
    })
  }

  return response({ body: { success: true, message: 'api1' } })
}
