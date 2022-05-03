export const response = ({
  statusCode = 200,
  body,
}: {
  statusCode?: number
  body: any
}) => {
  return {
    body: JSON.stringify(body),
    statusCode,
  }
}
