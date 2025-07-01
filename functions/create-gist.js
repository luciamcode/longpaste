// functions/create-gist.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { content } = JSON.parse(event.body);

  // GitHub に Gist を作成
  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'Shared via long-text-paste',
      public: false,
      files: { 'snippet.txt': { content } }
    })
  });
  if (!response.ok) {
    return { statusCode: response.status, body: 'GitHub API error' };
  }

  const data = await response.json();
  // files オブジェクトの中身を取り出して raw_url を取得
  const file = Object.values(data.files)[0];

  return {
    statusCode: 200,
    body: JSON.stringify({
      html_url: data.html_url,
      raw_url: file.raw_url
    })
  };
};