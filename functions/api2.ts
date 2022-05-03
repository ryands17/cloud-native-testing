import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { response } from './utils'

export const handler: APIGatewayProxyHandlerV2 = async () => {
  return response({ body: { success: true, message: 'api2' } })
}
