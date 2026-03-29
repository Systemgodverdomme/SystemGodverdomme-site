exports.handler = async function handler(event) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing YOUTUBE_API_KEY environment variable' }),
    };
  }

  const playlistId = event.queryStringParameters?.playlistId;
  const pageToken = event.queryStringParameters?.pageToken;

  if (!playlistId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing playlistId query parameter' }),
    };
  }

  const params = new URLSearchParams({
    key: apiKey,
    part: 'snippet,contentDetails',
    maxResults: '24',
    playlistId,
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data?.error?.message || 'YouTube API request failed' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify({
        items: data.items || [],
        nextPageToken: data.nextPageToken || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Server error while contacting YouTube API' }),
    };
  }
};
