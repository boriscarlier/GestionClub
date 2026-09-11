"""Return the Windows installation path selected by the user."""
from pathlib import Path


def resolve(root=Path('D:/')):
    return root / 'GestionClub' / 'FC_LA_COUR_GestionClub'


if __name__ == '__main__':
    print(resolve())
