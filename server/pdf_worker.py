"""Processus d’extraction séparé. Pas d’OCR, de réseau ni d’exécution de JavaScript PDF."""
import io,json,sys,re,datetime,unicodedata
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'vendor'))
from pypdf import PdfReader
MAX_BYTES=5*1024*1024
MAX_PAGES=40
MAX_TEXT=15000

def norm(text):return ''.join(c for c in unicodedata.normalize('NFKD',text) if not unicodedata.combining(c)).lower()
def marks(text):
    normalized=norm(text)
    patterns={'FC LA COUR':r'\b(?:f\W*c\W*|football club\s+(?:a\s+)?)la cour\b',
              'Les Jacques':r'\b(?:les|des|aux) jacques\b','Convocation / détection':r'\b(?:convoc\w*|detect\w*|selection\w*)',
              'Formation':r'\bformation\w*|\bbmf\b|\bbef\b','Réunion':r'\breunion (?:du|de|des|avec|le)\b|\bassemblee\w*'}
    terms=[name for name,pattern in patterns.items() if re.search(pattern,normalized)]
    dates=[]
    months={'janvier':1,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,'juillet':7,'aout':8,'septembre':9,'octobre':10,'novembre':11,'decembre':12}
    candidates=[]
    for m in re.finditer(r'\b(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})\b',normalized):candidates.append((m,int(m[1]),int(m[2]),int(m[3])))
    for m in re.finditer(r'\b(\d{1,2})(?:er)?\s+('+'|'.join(months)+r')\s+(\d{4})\b',normalized):candidates.append((m,int(m[1]),months[m[2]],int(m[3])))
    for m,day,month,year in sorted(candidates,key=lambda v:v[0].start()):
        try:value=datetime.date(year,month,day).isoformat()
        except ValueError:continue
        context=' '.join(normalized[max(0,m.start()-90):m.end()+90].split())
        if not any(d['date']==value and d['context']==context for d in dates):dates.append({'date':value,'context':context})
        if len(dates)==30:break
    return terms,dates

def club_players(page):
    """Read bordered CLUBS/NOM/PRENOM tables. Never infer a merged cell from text order.

    Only unrotated, untransformed coordinates are supported. Rectangles matching
    the header column locate the full club cell, including rows ABOVE its label.
    Unsupported/ambiguous layouts return no candidates and remain manually readable.
    """
    rectangles=[];fragments=[];unsupported=False;last_text_matrix=None
    def matrix_ok(cm):return all(abs(float(a)-b)<0.00001 for a,b in zip(cm,(1,0,0,1,0,0)))
    def operand(op,args,cm,tm):
        nonlocal unsupported,last_text_matrix
        if op in (b'Tj',b'TJ'):last_text_matrix=list(tm) if matrix_ok(cm) else None
        if op==b're':
            if not matrix_ok(cm):unsupported=True;return
            if len(rectangles)>=20000:raise ValueError('Table too complex')
            x,y,w,h=map(float,args)
            if w>0 and h>0:rectangles.append((x,y,w,h))
    def visitor(text,cm,tm,font,size):
        nonlocal unsupported
        if not text.strip():return
        # pypdf may flush a spaced text fragment after resetting the text matrix.
        if float(tm[4])==0 and float(tm[5])==0 and last_text_matrix is not None:tm=last_text_matrix
        if not matrix_ok(cm) or abs(float(tm[1]))>0.00001 or abs(float(tm[2]))>0.00001:
            unsupported=True;return
        if len(fragments)>=20000:raise ValueError('Table too complex')
        fragments.append((' '.join(text.split()),float(tm[4]),float(tm[5])))
    page.extract_text(visitor_operand_before=operand,visitor_text=visitor)
    if unsupported:return []
    rectangles=list(set(rectangles))
    def inside(r,x,y):return r[0]<=x<r[0]+r[2] and r[1]<=y<r[1]+r[3]
    def text_in(r):return [f for f in fragments if inside(r,f[1],f[2])]
    def label(r):return re.sub(r'[^a-z]','',norm(''.join(t for t,x,y in sorted(text_in(r),key=lambda f:f[1]))))
    headers=[]
    for r in rectangles:
        if r[2]<40 or r[3]<20 or label(r)!='clubs':continue
        names=[n for n in rectangles if abs(n[0]-(r[0]+r[2]))<2 and abs(n[1]-r[1])<1 and abs(n[3]-r[3])<1 and label(n)=='nom']
        for n in names:
            firsts=[f for f in rectangles if abs(f[0]-(n[0]+n[2]))<2 and abs(f[1]-n[1])<1 and abs(f[3]-n[3])<1 and label(f)=='prenom']
            for f in firsts:headers.append((r,n,f))
    if len(headers)!=1:return []
    header,surname,first=headers[0];players=[]
    club_pattern=r'(?:f\W*c\W*|football club\s+(?:a\s+)?)la cour'
    clubs=[f for f in fragments if re.fullmatch(club_pattern,norm(f[0]))]
    for club,x,y in clubs:
        cells=[r for r in rectangles if inside(r,x,y) and abs(r[0]-header[0])<1 and abs(r[2]-header[2])<1 and r[1]+r[3]<=header[1]+1]
        if len(cells)!=1:continue
        cell=cells[0]
        # An additional club label in this cell makes its extent uncertain.
        if len(text_in(cell))!=1:continue
        rows={}
        for text,tx,ty in fragments:
            if not cell[1]<ty<cell[1]+cell[3]:continue
            col=0 if surname[0]<=tx<surname[0]+surname[2] else 1 if first[0]<=tx<first[0]+first[2] else None
            if col is None:continue
            keys=[key for key in rows if abs(key-ty)<1]
            key=keys[0] if keys else ty
            rows.setdefault(key,[[],[]])[col].append((tx,text))
        candidates=[]
        for baseline,cols in sorted(rows.items(),reverse=True):
            values=[' '.join(t for x,t in sorted(col)) for col in cols]
            if not all(values) or any(len(v)>160 or any(c.isdigit() for c in v) for v in values):
                candidates=[];break
            candidates.append({'surname':values[0],'givenNames':values[1],'club':club,
                               'method':'Cellule de club délimitée dans le tableau'})
        players.extend(candidates)
    return players

def extract(raw):
    if len(raw)>MAX_BYTES or not raw.startswith(b'%PDF-'):raise ValueError('PDF requis, maximum 5 Mo.')
    reader=PdfReader(io.BytesIO(raw),strict=False)
    if reader.is_encrypted:raise ValueError('PDF chiffré ou protégé : fournir une copie lisible non chiffrée.')
    if len(reader.pages)>MAX_PAGES:raise ValueError('Maximum 40 pages par document dans cette version.')
    if not reader.pages:raise ValueError('Document sans page.')
    pages=[];warnings=[]
    for n,page in enumerate(reader.pages,1):
        try:
            text=page.extract_text() or ''
            text='\n'.join(line.rstrip() for line in text.replace('\x00','').splitlines()).strip()
            clipped=len(text)>MAX_TEXT;text=text[:MAX_TEXT]
            terms,dates=marks(text)
            state='truncated' if clipped else 'text' if text else 'no-text'
            if state=='no-text':warnings.append('Page '+str(n)+' : aucun texte extractible (scan ou page vide).')
            if clipped:warnings.append('Page '+str(n)+' : texte limité aux 15 000 premiers caractères.')
            players=[]
            if 'FC LA COUR' in terms:
                try:players=club_players(page)
                except Exception:pass
                if not players:warnings.append('Page '+str(n)+' : club repéré, mais lignes de joueurs non établies ; vérifier le tableau original.')
            pages.append({'page':n,'state':state,'text':text,'terms':terms,'dates':dates,'players':players})
        except Exception:
            warnings.append('Page '+str(n)+' : extraction impossible.')
            pages.append({'page':n,'state':'error','text':'','terms':[],'dates':[]})
    return {'pages':pages,'pageCount':len(pages),'warnings':warnings,'engine':'pypdf 6.10.0','analysisVersion':'1.24.4',
            'notice':'Repérage indicatif dans le texte extractible. Les dates peuvent être des naissances, échéances ou références historiques. Vérifier la page originale ; aucun événement ni rapprochement de licencié créé.'}

if __name__=='__main__':
    try:
        if sys.platform!='win32':
            import resource
            resource.setrlimit(resource.RLIMIT_AS,(384*1024*1024,384*1024*1024))
        raw=sys.stdin.buffer.read(MAX_BYTES+1)
        result=extract(raw)
    except ValueError as e:result={'error':str(e)}
    except Exception:result={'error':'PDF illisible ou extraction impossible. Le document n’a pas été enregistré.'}
    sys.stdout.buffer.write(json.dumps(result,ensure_ascii=True).encode('utf-8'))
