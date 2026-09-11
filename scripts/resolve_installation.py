"""Locate an existing installation without tying its directory to a club name."""
from pathlib import Path
import sys


def resolve(root=Path('D:/')):
    candidates = [p for p in root.glob('*GestionClub')
                  if (p / 'server/current_server.py').is_file()
                  and (p / 'data/club.sqlite3').is_file()]
    if len(candidates) > 1:
        raise ValueError('Plusieurs installations avec base detectees. Indiquer la cible en argument.')
    return candidates[0] if candidates else root / 'GESTION_CLUB_GestionClub'


if __name__ == '__main__':
    try:
        print(resolve())
    except (ValueError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(2)
