document.getElementById('share').onclick = async () => {
  const content = document.getElementById('editor').value.trim();
  if (!content) {
    alert('共有するテキストが空です！');
    return;
  }

  try {
    const res = await fetch('/api/create-gist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      const msg = await res.text();
      alert('Gist作成に失敗しました: ' + msg);
      return;
    }

    const data = await res.json();
    const html_url = data?.html_url || '(URL取得失敗)';
    await navigator.clipboard.writeText(html_url);
    alert('Gist共有リンクをコピーしました:\n' + html_url);
  } catch (err) {
    console.error(err);
    alert('エラーが発生しました: ' + err.message);
  }
};