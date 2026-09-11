#!/usr/bin/env python3
"""Migration a blanc V1.25.13.17 SQLite -> arborescence V1.26.

Par defaut, le script est en dry-run : il lit la base source, calcule ce qui
serait migre et ecrit un rapport JSON. La base source n'est jamais modifiee.
Utiliser --apply uniquement pour creer les bases V1.26 dans un dossier cible
separe.
"""
import argparse
import json
import sqlite3
import sys
import time
from contextlib import closing
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SERVER_ROOT = ROOT / 'server'
if str(SERVER_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVER_ROOT))

import data_layout


def connect_readonly(path):
    uri = Path(path).resolve().as_uri() + '?mode=ro'
    db = sqlite3.connect(uri, uri=True)
    db.row_factory = sqlite3.Row
    return db


def connect_write(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    return db


def table_exists(db, name):
    row = db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (name,)).fetchone()
    return row is not None


def rows(db, table):
    if not table_exists(db, table):
        return []
    return [dict(row) for row in db.execute(f'SELECT * FROM {table}')]


def latest_revision(db):
    if not table_exists(db, 'revisions'):
        return None
    row = db.execute('SELECT id,created,actor,club,payload FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
    if row is None:
        return None
    out = dict(row)
    try:
        out['backup'] = json.loads(out.get('payload') or '{}')
    except json.JSONDecodeError:
        out['backup'] = {}
    return out


def text_value(row, *keys):
    for key in keys:
        value = row.get(key) if isinstance(row, dict) else None
        if value is not None:
            value = str(value).strip()
            if value:
                return value
    return ''


def stable_id(prefix, *parts):
    raw = '-'.join(str(part).strip().lower() for part in parts if str(part or '').strip())
    safe = ''.join(ch if ch.isalnum() else '-' for ch in raw).strip('-')
    while '--' in safe:
        safe = safe.replace('--', '-')
    return f'{prefix}-{safe or "unknown"}'


def club_identifier(revision):
    value = revision.get('club') if revision else ''
    if value and str(value).strip() != '000000':
        return data_layout.normalize_club_id('club-' + str(value).strip())
    backup = revision.get('backup', {}) if revision else {}
    official = backup.get('state', {}).get('clubProfile', {}).get('official', {})
    affiliation = str(official.get('affiliation') or value or '000000').strip()
    return data_layout.normalize_club_id('club-' + affiliation)


def latest_state_rows(db, table, revision):
    direct = rows(db, table)
    if direct:
        return direct
    backup = revision.get('backup', {}) if revision else {}
    return backup.get('state', {}).get(table, []) if isinstance(backup.get('state'), dict) else []


def map_people_and_licenses(members, club_id, now):
    people = []
    licenses = []
    seen_people = set()
    for member in members:
        source_id = text_value(member, 'id') or stable_id('member', text_value(member, 'license_number', 'licenseNumber'), text_value(member, 'last_name', 'last'), text_value(member, 'first_name', 'first'))
        person_number = text_value(member, 'person_number', 'personNumber')
        license_number = text_value(member, 'license_number', 'licenseNumber', 'licenceNumber')
        last = text_value(member, 'last_name', 'last', 'lastName', 'nom')
        first = text_value(member, 'first_name', 'first', 'firstName', 'prenom')
        birth = text_value(member, 'birth_date', 'birthDate', 'dateOfBirth')
        person_id = stable_id('person', person_number or source_id)
        if person_id not in seen_people:
            seen_people.add(person_id)
            people.append({
                'person_id': person_id,
                'club_id': club_id,
                'last_name': last or 'A_COMPLETER',
                'first_name': first or 'A_COMPLETER',
                'birth_date': birth,
                'email': text_value(member, 'email', 'email1', 'primaryEmail'),
                'phone': text_value(member, 'phone', 'telephone', 'displayPhone', 'mobile', 'cellphone'),
                'payload': json.dumps(member, ensure_ascii=False, separators=(',', ':')),
                'created': now,
                'updated': now,
            })
        licenses.append({
            'license_id': stable_id('license', license_number or source_id),
            'club_id': club_id,
            'person_id': person_id,
            'license_number': license_number or None,
            'person_number': person_number or None,
            'category': text_value(member, 'category'),
            'subcategory': text_value(member, 'subcategory', 'subCategory'),
            'license_type': text_value(member, 'license_type', 'licenseType'),
            'member_type': text_value(member, 'member_type', 'type'),
            'status': text_value(member, 'status', 'license'),
            'season': '',
            'payload': json.dumps(member, ensure_ascii=False, separators=(',', ':')),
            'created': now,
            'updated': now,
        })
    return people, licenses


def map_teams(teams, club_id, now):
    out = []
    for team in teams:
        name = text_value(team, 'name') or 'Equipe a completer'
        out.append({
            'team_id': stable_id('team', text_value(team, 'id') or name),
            'club_id': club_id,
            'name': name,
            'category': text_value(team, 'category', 'group', 'team_group'),
            'competition': text_value(team, 'competition'),
            'payload': json.dumps(team, ensure_ascii=False, separators=(',', ':')),
            'created': now,
            'updated': now,
        })
    return out


def plan(source):
    with closing(connect_readonly(source)) as db:
        revision = latest_revision(db)
        club_id = club_identifier(revision)
        now = time.time()
        users = rows(db, 'users')
        profiles = rows(db, 'user_profiles')
        members = latest_state_rows(db, 'members', revision)
        teams = latest_state_rows(db, 'teams', revision)
        people, licenses = map_people_and_licenses(members, club_id, now)
        team_rows = map_teams(teams, club_id, now)
        profile_by_user = {p.get('user'): p for p in profiles}
        accounts = []
        account_roles = []
        links = []
        for user in users:
            login = text_value(user, 'name')
            account_id = stable_id('account', login)
            accounts.append({
                'account_id': account_id,
                'login': login,
                'display_name': login,
                'status': 'active',
                'password_salt': user.get('salt'),
                'password_hash': user.get('password'),
                'must_change_password': int(user.get('must_change_password') or 0),
                'credential_nonce': user.get('credential_nonce'),
                'generated_at': user.get('generated_at'),
                'password_changed_at': user.get('password_changed_at'),
                'created': now,
                'updated': now,
            })
            account_roles.append({
                'account_id': account_id,
                'club_id': club_id,
                'team_id': None,
                'role_id': text_value(user, 'role') or 'reader',
                'created': now,
            })
            profile = profile_by_user.get(login, {})
            member_id = text_value(profile, 'member_id')
            links.append({
                'account_id': account_id,
                'club_id': club_id,
                'person_id': stable_id('person', member_id) if member_id else None,
                'license_id': None,
                'link_status': 'to_confirm' if member_id else 'disabled',
                'created': now,
                'updated': now,
            })
        return {
            'source': str(Path(source).resolve()),
            'created': now,
            'mode': 'dry-run',
            'club_id': club_id,
            'latest_revision': revision['id'] if revision else 0,
            'counts': {
                'users': len(users),
                'user_profiles': len(profiles),
                'members_source': len(members),
                'teams_source': len(teams),
                'accounts': len(accounts),
                'account_links': len(links),
                'account_roles': len(account_roles),
                'people': len(people),
                'licenses': len(licenses),
                'teams': len(team_rows),
            },
            'data': {
                'accounts': accounts,
                'account_links': links,
                'account_roles': account_roles,
                'people': people,
                'licenses': licenses,
                'teams': team_rows,
            },
            'warnings': warnings_for(users, people, licenses, team_rows),
        }


def warnings_for(users, people, licenses, teams):
    warnings = []
    if not users:
        warnings.append('Aucun compte utilisateur trouve dans la base source.')
    if any(p['last_name'] == 'A_COMPLETER' or p['first_name'] == 'A_COMPLETER' for p in people):
        warnings.append('Certaines personnes ont un nom ou prenom incomplet.')
    license_numbers = [l['license_number'] for l in licenses if l['license_number']]
    if len(license_numbers) != len(set(license_numbers)):
        warnings.append('Doublons de numeros de licence detectes dans le club.')
    if not teams:
        warnings.append('Aucune equipe trouvee dans la base source.')
    return warnings


def apply_schema(path, section_name):
    schema = (ROOT / 'docs/schema/V1.26_CANONICAL_SCHEMA.sql').read_text(encoding='utf-8')
    sections = [part.strip() for part in schema.split('-- FILE: ') if part.strip()]
    for section in sections:
        name, _, sql = section.partition('\n')
        if name.strip() == section_name:
            with closing(connect_write(path)) as db, db:
                db.executescript(sql)
            return
    raise ValueError('Section schema inconnue: ' + section_name)


def materialize(migration, target):
    target = Path(target)
    layout = data_layout.DataLayout(target)
    if target.exists():
        raise SystemExit('Le dossier cible existe deja. Choisir un dossier vide pour eviter tout ecrasement.')
    for directory in layout.required_directories([migration['club_id']]):
        directory.mkdir(parents=True, exist_ok=True)
    for domain in data_layout.INSTANCE_DATABASES:
        apply_schema(layout.instance_db(domain), f'instance/{domain}.db')
    for domain in data_layout.CLUB_DATABASES:
        apply_schema(layout.club_db(migration['club_id'], domain), f'clubs/<club_id>/{domain}.db')

    now = migration['created']
    with closing(connect_write(layout.instance_db('instance'))) as db, db:
        db.execute('INSERT INTO clubs VALUES(?,?,?,?,?,?)', (migration['club_id'], migration['club_id'].replace('club-', ''), migration['club_id'], 'active', now, now))
        db.execute('INSERT INTO schema_versions VALUES(?,?,?,?)', ('v126', 'V1.26-dry-run', 'V1.25.13.17', now))
    with closing(connect_write(layout.instance_db('accounts'))) as db, db:
        for row in migration['data']['accounts']:
            db.execute('''
              INSERT INTO accounts(
                account_id,login,display_name,status,password_salt,password_hash,
                must_change_password,credential_nonce,generated_at,password_changed_at,
                created,updated
              ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
            ''', (
                row['account_id'], row['login'], row['display_name'], row['status'],
                row['password_salt'], row['password_hash'], row['must_change_password'],
                row['credential_nonce'], row['generated_at'], row['password_changed_at'],
                row['created'], row['updated'],
            ))
        for row in migration['data']['account_links']:
            db.execute('INSERT INTO account_links VALUES(?,?,?,?,?,?,?)', tuple(row.values()))
    with closing(connect_write(layout.instance_db('permissions'))) as db, db:
        for role in ('admin', 'editor', 'reader', 'educator', 'member'):
            db.execute('INSERT INTO roles VALUES(?,?,?)', (role, role, 'club'))
        for row in migration['data']['account_roles']:
            db.execute('INSERT INTO account_roles VALUES(?,?,?,?,?)', tuple(row.values()))
    with closing(connect_write(layout.club_db(migration['club_id'], 'club'))) as db, db:
        db.execute('INSERT INTO club_profile VALUES(?,?,?,?,?)', (migration['club_id'], migration['club_id'].replace('club-', ''), migration['club_id'], '{}', now))
    with closing(connect_write(layout.club_db(migration['club_id'], 'people'))) as db, db:
        for row in migration['data']['people']:
            db.execute('INSERT INTO people VALUES(?,?,?,?,?,?,?,?,?,?)', tuple(row.values()))
    with closing(connect_write(layout.club_db(migration['club_id'], 'licenses'))) as db, db:
        for row in migration['data']['licenses']:
            db.execute('INSERT INTO licenses VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', tuple(row.values()))
    with closing(connect_write(layout.club_db(migration['club_id'], 'teams'))) as db, db:
        for row in migration['data']['teams']:
            db.execute('INSERT INTO teams VALUES(?,?,?,?,?,?,?,?)', tuple(row.values()))
    return layout


def report_for(migration, target=None):
    public = {key: value for key, value in migration.items() if key != 'data'}
    public['target'] = str(Path(target).resolve()) if target else None
    public['sensitive'] = {
        'source_not_modified': True,
        'password_hashes_not_printed': True,
        'sessions_not_migrated': True,
        'raw_payloads_not_printed': True,
    }
    return public


def parse_args():
    parser = argparse.ArgumentParser(description='Dry-run migration Gestion Club V1.25 SQLite vers V1.26.')
    parser.add_argument('source', type=Path, help='Chemin vers une copie de club.sqlite3 V1.25.13.17')
    parser.add_argument('--target', type=Path, help='Dossier V1.26 cible. Obligatoire avec --apply.')
    parser.add_argument('--apply', action='store_true', help='Cree les bases V1.26 dans --target. Sans cette option: rapport seulement.')
    parser.add_argument('--report', type=Path, help='Chemin du rapport JSON. Par defaut: affichage console.')
    return parser.parse_args()


def main():
    args = parse_args()
    if not args.source.exists():
        raise SystemExit('Base source introuvable: ' + str(args.source))
    if args.apply and not args.target:
        raise SystemExit('--target est obligatoire avec --apply')
    migration = plan(args.source)
    if args.apply:
        materialize(migration, args.target)
        migration['mode'] = 'apply'
    public = report_for(migration, args.target)
    text = json.dumps(public, ensure_ascii=False, indent=2)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text + '\n', encoding='utf-8')
    else:
        print(text)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
