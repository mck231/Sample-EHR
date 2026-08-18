exports.handler = async () => {
  const apiUrl = process.env.PROGETTO_API_URL
  const apiKey = process.env.PROGETTO_API_KEY

  if (!apiUrl || !apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration is missing.' }),
    }
  }

  try {
    const response = await fetch(`${apiUrl}/v1/delivery/config/ehr-appointments`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    })

    const data = await response.json()

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Failed to retrieve appointments.' }),
    }
  }
}
