#!/usr/bin/env sh
set -eu
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT_DIR"
PYTHONPATH="$ROOT_DIR/server:$ROOT_DIR/vendor:$ROOT_DIR/tests:$ROOT_DIR/scripts" python3 -m unittest -v \
  tests.test_server \
  tests.test_watch \
  tests.test_manual_watch \
  tests.test_pdf_watch \
  tests.test_convocations \
  tests.test_lan_server \
  tests.test_windows_runtime \
  tests.test_html_decomposition \
  tests.test_manager_page_index \
  tests.test_manager_assets \
  tests.test_manager_css \
  tests.test_manager_sources \
  tests.test_v126_data_architecture \
  tests.test_v126_migration \
  tests.test_installation
