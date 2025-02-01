export async function getMistralResponse(prompt, apiKey) {
      if (!apiKey) {
        throw new Error('Mistral API key is not set.');
      }

      const response = await fetch('https://api.mistral.ai/v1/your-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    }
