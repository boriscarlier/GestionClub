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

def bootstrap_latest(db):
    existing = db.execute('SELECT count(*) FROM members').fetchone()[0]
    if existing:
        return existing
    row = db.execute('SELECT id,payload FROM revisions ORDER BY id DESC LIMIT 1').fetchone()
    if not row:
        return 0
    return sync_members(db, row['id'], json.loads(row['payload']))

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
    return {
        'revision': rev['id'] if rev else 0,
        'club': rev['club'] if rev else None,
        'counts': {'members': member_count}
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
