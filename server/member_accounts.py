"""Comptes licenciés automatiques pour Gestion Club V1.26.1."""
import base64
import hashlib
import hmac
import re
import secrets
import time
import unicodedata


def initialize(db):
    columns = {row['name'] for row in db.execute('PRAGMA table_info(users)')}
    additions = {
        'member_id': 'TEXT',
        'must_change_password': 'INTEGER NOT NULL DEFAULT 0',
        'credential_nonce': 'TEXT',
        'generated_at': 'REAL',
        'password_changed_at': 'REAL',
    }
    for name, declaration in additions.items():
        if name not in columns:
            db.execute(f'ALTER TABLE users ADD COLUMN {name} {declaration}')
    db.executescript('''
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_member_id
      ON users(member_id) WHERE member_id IS NOT NULL;
    CREATE TABLE IF NOT EXISTS server_settings(
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    ''')
    if not db.execute("SELECT 1 FROM server_settings WHERE key='credential_secret'").fetchone():
        db.execute(
            "INSERT INTO server_settings(key,value) VALUES('credential_secret',?)",
            (secrets.token_hex(32),),
        )


def _secret(db):
    return db.execute(
        "SELECT value FROM server_settings WHERE key='credential_secret'"
    ).fetchone()['value']


def temporary_password(db, row):
    nonce = row['credential_nonce']
    member_id = row['member_id']
    if not nonce or not member_id or not row['must_change_password']:
        return None
    digest = hmac.new(
        bytes.fromhex(_secret(db)),
        f'{member_id}:{nonce}'.encode('utf-8'),
        hashlib.sha256,
    ).digest()[:12]
    token = base64.urlsafe_b64encode(digest).decode('ascii').rstrip('=')
    return 'Gc1!' + token


def _slug(value):
    normalized = unicodedata.normalize('NFKD', value or '')
    ascii_value = ''.join(ch for ch in normalized if not unicodedata.combining(ch))
    return re.sub(r'[^a-z0-9]+', '', ascii_value.lower())


def base_login(first_name, last_name, member_id):
    first = _slug(first_name)
    last = _slug(last_name)
    if first and last:
        return (first[0] + last).upper()[:40]
    fallback = _slug(member_id)
    return ('m' + fallback if fallback else 'licencie').upper()[:40]


def next_login(db, base):
    candidate = base
    counter = 2
    while db.execute('SELECT 1 FROM users WHERE name=?', (candidate,)).fetchone():
        suffix = str(counter)
        candidate = base[:40 - len(suffix)] + suffix
        counter += 1
    return candidate


def sync(db, password_hash):
    """Crée un compte lecteur pour chaque Member ID SQL encore sans compte."""
    initialize(db)
    created = 0
    existing = 0
    conflicts = []
    now = time.time()
    members = db.execute(
        "SELECT id,last_name,first_name,full_name,license_number FROM members WHERE trim(id)<>'' ORDER BY id"
    ).fetchall()
    for member in members:
        member_id = str(member['id']).strip()
        linked = db.execute('SELECT name FROM users WHERE member_id=?', (member_id,)).fetchone()
        if linked:
            existing += 1
            continue
        if len(member_id) > 80 or any(ord(ch) < 32 for ch in member_id):
            conflicts.append(member_id)
            continue
        login = next_login(db, base_login(member['first_name'], member['last_name'], member_id))
        salt = secrets.token_hex(16)
        nonce = secrets.token_hex(16)
        provisional = {
            'member_id': member_id,
            'credential_nonce': nonce,
            'must_change_password': 1,
        }
        password = temporary_password_for_values(db, provisional)
        db.execute('''
          INSERT INTO users(
            name,salt,password,role,member_id,must_change_password,
            credential_nonce,generated_at,password_changed_at
          ) VALUES(?,?,?,?,?,?,?,?,NULL)
        ''', (login, salt, password_hash(password, salt), 'reader', member_id, 1, nonce, now))
        created += 1
    return {'created': created, 'existing': existing, 'conflicts': conflicts}


def temporary_password_for_values(db, values):
    digest = hmac.new(
        bytes.fromhex(_secret(db)),
        f"{values['member_id']}:{values['credential_nonce']}".encode('utf-8'),
        hashlib.sha256,
    ).digest()[:12]
    return 'Gc1!' + base64.urlsafe_b64encode(digest).decode('ascii').rstrip('=')


def admin_listing(db):
    rows = db.execute('''
      SELECT u.*,m.full_name,m.license_number
      FROM users u LEFT JOIN members m ON m.id=u.member_id
      WHERE u.member_id IS NOT NULL
      ORDER BY coalesce(m.full_name,u.name),u.name
    ''').fetchall()
    return [{
        'memberId': row['member_id'],
        'login': row['name'],
        'fullName': row['full_name'] or '',
        'licenseNumber': row['license_number'] or '',
        'mustChangePassword': bool(row['must_change_password']),
        'temporaryPassword': temporary_password(db, row),
        'generatedAt': row['generated_at'],
        'passwordChangedAt': row['password_changed_at'],
    } for row in rows]


def member_profile(db, member_id):
    row = db.execute(
        'SELECT id,full_name,license_number,category,status FROM members WHERE id=?',
        (member_id,),
    ).fetchone()
    if not row:
        return None
    return {
        'memberId': row['id'],
        'fullName': row['full_name'] or '',
        'licenseNumber': row['license_number'] or '',
        'category': row['category'] or '',
        'status': row['status'] or '',
    }
