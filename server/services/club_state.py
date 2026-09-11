"""Lecture SQL/API des donnees club migrees depuis les sauvegardes completes."""
import json

MEMBER_COLUMNS = (
    'id', 'licenseNumber', 'personNumber', 'last', 'first', 'fullName',
    'birthDate', 'category', 'subcategory', 'licenseType', 'type', 'status',
    'email', 'phone', 'mobile'
)

def initialize(db):
    db.executescript('''
    CREATE TABLE IF NOT EXISTS members(
      id TEXT PRIMARY KEY,
      revision INTEGER NOT NULL,
      license_number TEXT,
      person_number TEXT,
      last_name TEXT,
      first_name TEXT,
      full_name TEXT,
      birth_date TEXT,
      category TEXT,
      subcategory TEXT,
      license_type TEXT,
      member_type TEXT,
      status TEXT,
      email TEXT,
      phone TEXT,
      mobile TEXT,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_members_revision ON members(revision);
    CREATE INDEX IF NOT EXISTS idx_members_license ON members(license_number);
    CREATE INDEX IF NOT EXISTS idx_members_person ON members(person_number);
    CREATE INDEX IF NOT EXISTS idx_members_name ON members(last_name, first_name);

    CREATE TABLE IF NOT EXISTS teams(
      id TEXT PRIMARY KEY,
      revision INTEGER NOT NULL,
      name TEXT,
      competition TEXT,
      team_group TEXT,
      coach TEXT,
      assistant TEXT,
      manager TEXT,
      ground TEXT,
      training TEXT,
      public INTEGER NOT NULL DEFAULT 0,
      roster_public INTEGER NOT NULL DEFAULT 0,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_teams_revision ON teams(revision);
    CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);
    CREATE INDEX IF NOT EXISTS idx_teams_group ON teams(team_group);
    ''')

def text_value(row, *keys):
    for key in keys:
        value = row.get(key) if isinstance(row, dict) else None
        if value is not None:
            value = str(value).strip()
            if value:
                return value
    return ''

def member_summary(row):
    last = text_value(row, 'last', 'lastName', 'nom')
    first = text_value(row, 'first', 'firstName', 'prenom')
    full = text_value(row, 'fullName', 'name', 'displayName')
    if not full:
        full = ' '.join(part for part in (last, first) if part)
    return {
        'id': text_value(row, 'id'),
        'licenseNumber': text_value(row, 'licenseNumber', 'licenceNumber'),
        'personNumber': text_value(row, 'personNumber'),
        'last': last,
        'first': first,
        'fullName': full,
        'birthDate': text_value(row, 'birthDate', 'dateOfBirth'),
        'category': text_value(row, 'category'),
        'subcategory': text_value(row, 'subcategory', 'subCategory'),
        'licenseType': text_value(row, 'licenseType'),
        'type': text_value(row, 'type'),
        'status': text_value(row, 'status', 'license'),
        'email': text_value(row, 'email', 'email1', 'primaryEmail'),
        'phone': text_value(row, 'phone', 'telephone', 'displayPhone'),
        'mobile': text_value(row, 'mobile', 'cellphone')
    }

def sync_members(db, revision, backup):
    rows = backup.get('state', {}).get('members', [])
    db.execute('DELETE FROM members')
    for row in rows:
        summary = member_summary(row)
        db.execute('''
        INSERT INTO members(
          id,revision,license_number,person_number,last_name,first_name,full_name,
          birth_date,category,subcategory,license_type,member_type,status,email,phone,mobile,payload
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            summary['id'], revision, summary['licenseNumber'], summary['personNumber'],
            summary['last'], summary['first'], summary['fullName'], summary['birthDate'],
            summary['category'], summary['subcategory'], summary['licenseType'],
            summary['type'], summary['status'], summary['email'], summary['phone'],
            summary['mobile'], json.dumps(row, ensure_ascii=False, separators=(',', ':'))
        ))
    return len(rows)

def team_summary(row):
    return {
        'id': text_value(row, 'id'),
        'name': text_value(row, 'name'),
        'competition': text_value(row, 'competition'),
        'group': text_value(row, 'group'),
        'coach': text_value(row, 'coach'),
        'assistant': text_value(row, 'assistant'),
        'manager': text_value(row, 'manager'),
        'ground': text_value(row, 'ground'),
        'training': text_value(row, 'training'),
        'public': bool(row.get('public')) if isinstance(row, dict) else False,
        'rosterPublic': bool(row.get('rosterPublic')) if isinstance(row, dict) else False
    }

def sync_teams(db, revision, backup):
    rows = backup.get('state', {}).get('teams', [])
    db.execute('DELETE FROM teams')
    for row in rows:
        summary = team_summary(row)
        db.execute('''
        INSERT INTO teams(
          id,revision,name,competition,team_group,coach,assistant,manager,
          ground,training,public,roster_public,payload
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)
        ''', (
            summary['id'], revision, summary['name'], summary['competition'],
            summary['group'], summary['coach'], summary['assistant'], summary['manager'],
            summary['ground'], summary['training'], 1 if summary['public'] else 0,
            1 if summary['rosterPublic'] else 0,
            json.dumps(row, ensure_ascii=False, separators=(',', ':'))
        ))
    return len(rows)

def sync_all(db, revision, backup):
    return {
        'members': sync_members(db, revision, backup),
        'teams': sync_teams(db, revision, backup)
    }

def bootstrap_latest(db):
    existing = {
        'members': db.execute('SELECT count(*) FROM members').fetchone()[0],
        'teams': db.execute('SELECT count(*) FROM teams').fetchone()[0]
    }
    if all(existing.values()):
        return existing
    row = db.execute('SELECT id,payload FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
    if not row:
        return existing
    return sync_all(db, row['id'], json.loads(row['payload']))

def row_to_member(row, include_payload=False):
    data = {
        'id': row['id'],
        'revision': row['revision'],
        'licenseNumber': row['license_number'] or '',
        'personNumber': row['person_number'] or '',
        'last': row['last_name'] or '',
        'first': row['first_name'] or '',
        'fullName': row['full_name'] or '',
        'birthDate': row['birth_date'] or '',
        'category': row['category'] or '',
        'subcategory': row['subcategory'] or '',
        'licenseType': row['license_type'] or '',
        'type': row['member_type'] or '',
        'status': row['status'] or '',
        'email': row['email'] or '',
        'phone': row['phone'] or '',
        'mobile': row['mobile'] or ''
    }
    if include_payload:
        data['payload'] = json.loads(row['payload'])
    return data

def summary(db):
    rev = db.execute('SELECT id,club FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
    member_count = db.execute('SELECT count(*) FROM members').fetchone()[0]
    team_count = db.execute('SELECT count(*) FROM teams').fetchone()[0]
    return {
        'revision': rev['id'] if rev else 0,
        'club': rev['club'] if rev else None,
        'counts': {'members': member_count, 'teams': team_count}
    }

def members(db, params):
    q = str(params.get('q', [''])[0]).strip().lower()
    limit_raw = str(params.get('limit', ['100'])[0])
    offset_raw = str(params.get('offset', ['0'])[0])
    if not limit_raw.isdigit() or not offset_raw.isdigit():
        raise ValueError('Pagination invalide.')
    limit = min(max(int(limit_raw), 1), 500)
    offset = max(int(offset_raw), 0)
    args = []
    where = ''
    if q:
        like = '%' + q + '%'
        where = '''WHERE lower(coalesce(full_name,'')||' '||coalesce(last_name,'')||' '||
                   coalesce(first_name,'')||' '||coalesce(license_number,'')||' '||
                   coalesce(person_number,'')||' '||coalesce(category,'')) LIKE ?'''
        args.append(like)
    total = db.execute('SELECT count(*) FROM members ' + where, args).fetchone()[0]
    rows = db.execute('SELECT * FROM members ' + where + ' ORDER BY last_name,first_name,id LIMIT ? OFFSET ?', args + [limit, offset]).fetchall()
    return {'total': total, 'limit': limit, 'offset': offset, 'members': [row_to_member(r) for r in rows]}

def member(db, ident):
    row = db.execute('SELECT * FROM members WHERE id=?', (ident,)).fetchone()
    if not row:
        return None
    return row_to_member(row, include_payload=True)

def member_by_reference(db, ref):
    ref = str(ref or '').strip()
    if not ref:
        return None
    row = db.execute('''
      SELECT * FROM members
      WHERE id=? OR license_number=? OR person_number=?
      ORDER BY CASE WHEN id=? THEN 0 WHEN license_number=? THEN 1 ELSE 2 END, id
      LIMIT 1
    ''', (ref, ref, ref, ref, ref)).fetchone()
    if not row:
        return None
    return row_to_member(row, include_payload=True)

def row_to_team(row, include_payload=False):
    data = {
        'id': row['id'],
        'revision': row['revision'],
        'name': row['name'] or '',
        'competition': row['competition'] or '',
        'group': row['team_group'] or '',
        'coach': row['coach'] or '',
        'assistant': row['assistant'] or '',
        'manager': row['manager'] or '',
        'ground': row['ground'] or '',
        'training': row['training'] or '',
        'public': bool(row['public']),
        'rosterPublic': bool(row['roster_public'])
    }
    if include_payload:
        data['payload'] = json.loads(row['payload'])
    return data

def teams(db, params):
    q = str(params.get('q', [''])[0]).strip().lower()
    limit_raw = str(params.get('limit', ['100'])[0])
    offset_raw = str(params.get('offset', ['0'])[0])
    if not limit_raw.isdigit() or not offset_raw.isdigit():
        raise ValueError('Pagination invalide.')
    limit = min(max(int(limit_raw), 1), 500)
    offset = max(int(offset_raw), 0)
    args = []
    where = ''
    if q:
        like = '%' + q + '%'
        where = '''WHERE lower(coalesce(name,'')||' '||coalesce(competition,'')||' '||
                   coalesce(team_group,'')||' '||coalesce(coach,'')||' '||
                   coalesce(assistant,'')||' '||coalesce(manager,'')||' '||
                   coalesce(ground,'')) LIKE ?'''
        args.append(like)
    total = db.execute('SELECT count(*) FROM teams ' + where, args).fetchone()[0]
    rows = db.execute('SELECT * FROM teams ' + where + ' ORDER BY name,id LIMIT ? OFFSET ?', args + [limit, offset]).fetchall()
    return {'total': total, 'limit': limit, 'offset': offset, 'teams': [row_to_team(r) for r in rows]}

def team(db, ident):
    row = db.execute('SELECT * FROM teams WHERE id=?', (ident,)).fetchone()
    if not row:
        return None
    return row_to_team(row, include_payload=True)
