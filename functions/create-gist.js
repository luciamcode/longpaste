// ✅ Node.js形式（＝サーバー側）
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { content } = JSON.parse(event.body);

  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      "Authorization": `token ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      description: "Shared via TinyViewer",
      public: false,
      files: {
        "shared.txt": {
          content
        }
      }
    })
  });

  const data = await res.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};