(() => {
  'use strict';

  let session = null;

  const $ = (id) => document.getElementById(id);
  const message = (text) => { const node = $('videoMessage'); if (node) node.textContent = text || ''; };

  async function api(path, method = 'GET', body) {
    const headers = { 'Content-Type': 'application/json' };
    if (session && method !== 'GET') headers['X-CSRF-Token'] = session.csrf;
    const response = await fetch(path, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Opération refusée.');
    return data;
  }

  function option(select, value, label) {
    const node = document.createElement('option');
    node.value = value;
    node.textContent = label;
    select.appendChild(node);
  }

  async function loadTeams() {
    const result = await api('/api/state/teams?limit=500');
    const form = $('videoTeam');
    const filter = $('videoFilterTeam');
    for (const team of result.teams || []) {
      const label = team.name || team.id;
      option(form, team.id, label);
      option(filter, team.id, label);
    }
  }

  function field(id) {
    return ($(id)?.value || '').trim();
  }

  function payload() {
    return {
      url: field('videoUrl'),
      title: field('videoTitle'),
      teamId: field('videoTeam'),
      matchId: field('videoMatch'),
      matchDate: field('videoDate'),
      opponent: field('videoOpponent'),
      competition: field('videoCompetition'),
      visibility: field('videoVisibility') || 'unknown',
    };
  }

  function addCell(row, value) {
    const cell = document.createElement('td');
    cell.textContent = value || '—';
    row.appendChild(cell);
  }

  function renderVideos(videos) {
    const root = $('videoList');
    root.replaceChildren();
    if (!videos.length) {
      const p = document.createElement('p');
      p.textContent = 'Aucune référence vidéo enregistrée.';
      root.appendChild(p);
      return;
    }
    const table = document.createElement('table');
    table.className = 'video-table';
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const label of ['Date', 'Équipe', 'Adversaire', 'Compétition', 'Source', 'Visibilité', 'Lien']) {
      const th = document.createElement('th');
      th.textContent = label;
      headRow.appendChild(th);
    }
    head.appendChild(headRow);
    table.appendChild(head);
    const body = document.createElement('tbody');
    for (const video of videos) {
      const row = document.createElement('tr');
      addCell(row, video.matchDate);
      addCell(row, video.teamId);
      addCell(row, video.opponent);
      addCell(row, video.competition);
      addCell(row, video.provider === 'veo' ? 'Veo' : 'Externe');
      addCell(row, video.visibility);
      const linkCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = video.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = video.title || 'Ouvrir la vidéo';
      linkCell.appendChild(link);
      row.appendChild(linkCell);
      body.appendChild(row);
    }
    table.appendChild(body);
    root.appendChild(table);
  }

  async function loadVideos() {
    const params = new URLSearchParams();
    const teamId = field('videoFilterTeam');
    const q = field('videoQuery');
    if (teamId) params.set('teamId', teamId);
    if (q) params.set('q', q);
    const result = await api('/api/videos' + (params.toString() ? '?' + params.toString() : ''));
    renderVideos(result.videos || []);
  }

  async function saveVideo(event) {
    event.preventDefault();
    const button = $('videoSave');
    try {
      button.disabled = true;
      message('Enregistrement de la référence vidéo...');
      const result = await api('/api/videos', 'POST', payload());
      $('videoForm').reset();
      message('Référence enregistrée : ' + result.video.provider + '.');
      await loadVideos();
    } catch (error) {
      message(error.message);
    } finally {
      button.disabled = false;
    }
  }

  async function init() {
    try {
      session = await api('/api/session');
      $('videoIdentity').textContent = session.user + ' · ' + session.role;
      if (session.role === 'reader') $('videoWriter').hidden = true;
      await loadTeams();
      await loadVideos();
      $('videoForm').addEventListener('submit', saveVideo);
      $('videoRefresh').addEventListener('click', () => loadVideos().catch((e) => message(e.message)));
      $('videoFilters').addEventListener('submit', (event) => {
        event.preventDefault();
        loadVideos().catch((e) => message(e.message));
      });
    } catch (error) {
      message(error.message + ' Retournez à la page serveur pour vous connecter.');
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
