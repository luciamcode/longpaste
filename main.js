import { saveTab, loadTab, listTabs } from './indexeddb-utils.js';

let currentTabId = null;

async function renderTabs() {
  const ids = await listTabs();
  const ul = document.getElementById('tab-list');
  ul.innerHTML = '';
  ids.forEach(id => {
    const li = document.createElement('li');
    li.textContent = id;
    li.dataset.id = id;
    if (id === currentTabId) li.classList.add('active');
    li.onclick = () => selectTab(id);
    ul.appendChild(li);
  });
}

async function selectTab(id) {
  currentTabId = id;
  window.location.hash = id;
  await renderTabs();
  document.getElementById('editor').value = await loadTab(id);
}

async function createNewTab() {
  const id = Date.now().toString();
  await saveTab(id, '');
  selectTab(id);
}

window.addEventListener('load', async () => {
  const ids = await listTabs();
  const hashId = location.hash.replace('#', '');
  if (hashId && ids.includes(hashId)) currentTabId = hashId;
  else if (ids.length > 0) currentTabId = ids[0];

  if (!currentTabId) await createNewTab();
  else await selectTab(currentTabId);

  document.getElementById('new-tab').onclick = createNewTab;
  document.getElementById('save').onclick = async () => {
    await saveTab(currentTabId, document.getElementById('editor').value);
    alert('保存しました');
  };
  document.getElementById('share').onclick = async () => {
    const content = document.getElementById('editor').value;
    const res = await fetch('/api/create-gist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    const { html_url } = await res.json();
    await navigator.clipboard.writeText(html_url);
    alert('Gist共有リンクをコピーしました:\n' + html_url);
  };
});