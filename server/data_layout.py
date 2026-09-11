"""Arborescence de donnees cible pour Gestion Club V1.26.

Ce module est volontairement autonome : il documente et valide les chemins
physiques sans modifier le runtime V1.25.13.17 existant.
"""
import os
import re
from dataclasses import dataclass
from pathlib import Path


CLUB_ID_RE = re.compile(r'[a-z0-9](?:[a-z0-9_-]{0,62}[a-z0-9])?')

INSTANCE_DATABASES = {
    'instance': 'instance.db',
    'accounts': 'accounts.db',
    'permissions': 'permissions.db',
    'audit': 'audit.db',
}

CLUB_DATABASES = {
    'club': 'club.db',
    'people': 'people.db',
    'licenses': 'licenses.db',
    'teams': 'teams.db',
    'memberships': 'memberships.db',
    'settings': 'settings.db',
}


@dataclass(frozen=True)
class DataLayout:
    root: Path

    @property
    def instance_dir(self):
        return self.root / 'instance'

    @property
    def clubs_dir(self):
        return self.root / 'clubs'

    @property
    def imports_dir(self):
        return self.root / 'imports'

    @property
    def exports_dir(self):
        return self.root / 'exports'

    @property
    def sync_dir(self):
        return self.root / 'sync'

    @property
    def backups_dir(self):
        return self.root / 'backups'

    def instance_db(self, domain):
        if domain not in INSTANCE_DATABASES:
            raise ValueError('Domaine instance inconnu.')
        return self.instance_dir / INSTANCE_DATABASES[domain]

    def club_dir(self, club_id):
        checked = normalize_club_id(club_id)
        return self.clubs_dir / checked

    def club_db(self, club_id, domain):
        if domain not in CLUB_DATABASES:
            raise ValueError('Domaine club inconnu.')
        return self.club_dir(club_id) / CLUB_DATABASES[domain]

    def club_documents_dir(self, club_id):
        return self.club_dir(club_id) / 'documents'

    def club_backups_dir(self, club_id):
        return self.backups_dir / 'clubs' / normalize_club_id(club_id)

    def required_directories(self, club_ids=()):
        dirs = [
            self.root,
            self.instance_dir,
            self.clubs_dir,
            self.imports_dir,
            self.exports_dir,
            self.sync_dir,
            self.backups_dir,
            self.backups_dir / 'instance',
            self.backups_dir / 'clubs',
        ]
        for club_id in club_ids:
            dirs.extend([
                self.club_dir(club_id),
                self.club_documents_dir(club_id),
                self.club_backups_dir(club_id),
            ])
        return dirs


def normalize_club_id(value):
    club_id = str(value or '').strip().lower()
    if not CLUB_ID_RE.fullmatch(club_id):
        raise ValueError('club_id invalide.')
    if '..' in club_id or '/' in club_id or '\\' in club_id:
        raise ValueError('club_id invalide.')
    return club_id


def default_root(project_root):
    configured = os.environ.get('GESTION_CLUB_V126_DATA_ROOT')
    if configured:
        return Path(configured)
    data_dir = os.environ.get('GESTION_CLUB_DATA_DIR')
    if data_dir:
        return Path(data_dir)
    return Path(project_root) / 'data'


def layout(project_root):
    return DataLayout(default_root(project_root))
