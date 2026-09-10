const statusNode = document.querySelector('[data-dashboard-status]');
const userNode = document.querySelector('[data-dashboard-user]');
const revisionNode = document.querySelector('[data-dashboard-revision]');
const clubNode = document.querySelector('[data-dashboard-club]');
const metricNodes = document.querySelectorAll('[data-summary-count]');

function setStatus(message) {
  if (statusNode) {
    statusNode.textContent = message;
  }
}

function displayCount(key, value) {
  const node = document.querySelector(`[data-summary-count="${key}"]`);
  if (node) {
    node.textContent = Number.isFinite(value) ? String(value) : '0';
  }
}

async function readJson(path) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Lecture serveur impossible.');
  }
  return data;
}

async function initDashboard() {
  metricNodes.forEach((node) => {
    node.textContent = '...';
  });

  try {
    const session = await readJson('/api/session');
    const summary = await readJson('/api/state/summary');
    if (userNode) {
      userNode.textContent = `${session.user} (${session.role})`;
    }
    if (revisionNode) {
      revisionNode.textContent = String(summary.revision || 0);
    }
    if (clubNode) {
      clubNode.textContent = summary.club || 'Non renseigne';
    }
    const counts = summary.counts || {};
    displayCount('members', counts.members);
    displayCount('teams', counts.teams);
    displayCount('matches', counts.matches);
    displayCount('accounts', counts.accounts);
    setStatus('Dashboard extrait en lecture seule. Le Manager stable reste disponible en rollback.');
  } catch (error) {
    metricNodes.forEach((node) => {
      node.textContent = '0';
    });
    setStatus(error.message + ' Utiliser le lien de rollback vers le Manager stable.');
  }
}

initDashboard();
