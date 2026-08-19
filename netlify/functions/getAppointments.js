export const handler = async () => {
  const apiUrl = process.env.PROGETTO_API_URL
  const apiKey = process.env.PROGETTO_API_KEY

  if (!apiUrl || !apiKey) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (response.ok) {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json()
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      }

      return {
        statusCode: 502,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Upstream service returned a non-JSON response.' }),
      }
    }

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Unable to retrieve appointments from upstream service.' }),
    }
  } catch {
    return {
      statusCode: 502,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to retrieve appointments.' }),
    }
  }
}
