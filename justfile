set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

# ---- workspace shortcuts ----

public-dev:
  pnpm --filter @primer-paso/public dev

public-build:
  pnpm --filter @primer-paso/public build

public-typecheck:
  pnpm --filter @primer-paso/public typecheck

public-test:
  pnpm --filter @primer-paso/public test

org-dev:
  pnpm --filter @primer-paso/org-portal dev

org-build:
  pnpm --filter @primer-paso/org-portal build

org-typecheck:
  pnpm --filter @primer-paso/org-portal typecheck

org-test:
  pnpm --filter @primer-paso/org-portal test

db-typecheck:
  pnpm --filter @primer-paso/db typecheck

db-test:
  pnpm --filter @primer-paso/db test

db-seed-local-org-portal:
  pnpm db:seed:local-org-portal

certificate-typecheck:
  pnpm --filter @primer-paso/certificate typecheck

certificate-test:
  pnpm --filter @primer-paso/certificate test

certificate-export-sample-pdf:
  pnpm --filter @primer-paso/certificate export:sample-pdf

certificate-field-template:
  pnpm --filter @primer-paso/certificate template:field

check:
  pnpm run check

typecheck:
  pnpm run typecheck

test:
  pnpm test

ci:
  pnpm run check
  pnpm run typecheck
  pnpm test

dev:
  pnpm dev

# ---- Repomix helpers ----

REPOMIX_DIR := ".repomix"
REPOMIX_CONFIG_DIR := ".repomix/config"
REPOMIX_ROOT_CFG := "repomix.config.json"
DIFFS_OUT := ".repomix/diffs.patch"

# Usage:
#   just repomix
#   just repomix public
#   just repomix public certificate db
#   just repomix --diffs public
#   just repomix --compress public
#   just repomix --diffs --compress public org-portal
#
# Target names resolve to:
#   apps/<target>
#   packages/<target>
#
# Optional extra include patterns:
#   .repomix/config/public.include
#   .repomix/config/org-portal.include
#   .repomix/config/certificate.include
#
# Each include file may contain extra glob patterns, one per line.
[arg("diffs", long="diffs", short="D", value="true")]
[arg("compress", long="compress", short="c", value="true")]
repomix diffs="false" compress="false" *targets:
  @mkdir -p {{REPOMIX_DIR}} {{REPOMIX_CONFIG_DIR}}
  @set -eu; \
  flags=""; \
  [ "{{diffs}}" = "true" ] && flags="${flags} --include-diffs"; \
  [ "{{compress}}" = "true" ] && flags="${flags} --compress"; \
  typed_targets="{{targets}}"; \
  echo "[repomix] targets='${typed_targets}'"; \
  if [ -z "$typed_targets" ]; then \
    out="{{REPOMIX_DIR}}/repomix-all.xml"; \
    pnpm exec repomix -c {{REPOMIX_ROOT_CFG}} --include "**/*" --include-full-directory-structure -o "$out" $flags; \
    echo "[repomix] wrote $out"; \
    exit 0; \
  fi; \
  include_patterns=""; \
  for target in $typed_targets; do \
    base=""; \
    if [ -d "apps/$target" ]; then \
      base="apps/$target"; \
    elif [ -d "packages/$target" ]; then \
      base="packages/$target"; \
    else \
      echo "[repomix] Warning: no app or package named '$target' (skipping)"; \
      continue; \
    fi; \
    target_patterns="${base}/**"; \
    include_file="{{REPOMIX_CONFIG_DIR}}/${target}.include"; \
    if [ -f "$include_file" ]; then \
      extras="$(grep -vE '^[[:space:]]*($|#)' "$include_file" | tr '\n' ',' | sed 's/,$//')"; \
      [ -n "$extras" ] && target_patterns="${target_patterns},${extras}"; \
    fi; \
    include_patterns="${include_patterns}${include_patterns:+,}${target_patterns}"; \
  done; \
  if [ -z "$include_patterns" ]; then \
    echo "[repomix] No valid targets found."; \
    exit 1; \
  fi; \
  bundle_name="$(echo "$typed_targets" | tr ' ' '-')"; \
  out="{{REPOMIX_DIR}}/repomix-${bundle_name}.xml"; \
  pnpm exec repomix -c {{REPOMIX_ROOT_CFG}} --include "$include_patterns" --include-full-directory-structure -o "$out" $flags; \
  echo "[repomix] wrote $out"

# Produce a patch of local uncommitted changes without touching the real index.
#
# Usage:
#   just diffs
#
# Output:
#   .repomix/diffs.patch
diffs:
  @mkdir -p {{REPOMIX_DIR}}
  @set -eu; \
  tmp_index="$(mktemp -t just-diffs-index.XXXXXX)"; \
  trap 'rm -f "$tmp_index"' EXIT; \
  export GIT_INDEX_FILE="$tmp_index"; \
  git read-tree HEAD; \
  git add -A -- . \
    ':(exclude)pnpm-lock.yaml' \
    ':(exclude)**/pnpm-lock.yaml'; \
  git diff --cached --patch --no-color > "{{DIFFS_OUT}}"; \
  echo "Wrote {{DIFFS_OUT}}"

REPOMIX_BUNDLE_CONFIG_DIR := ".repomix/config/bundles"

# Usage:
#   just bundle copy
#   just bundle style
#   just bundle backend
#   just bundle --diffs backend
#   just bundle --compress copy
[arg("diffs", long="diffs", short="D", value="true")]
[arg("compress", long="compress", short="c", value="true")]
bundle name diffs="false" compress="false":
  @mkdir -p {{REPOMIX_DIR}} {{REPOMIX_BUNDLE_CONFIG_DIR}}
  @set -eu; \
  include_file="{{REPOMIX_BUNDLE_CONFIG_DIR}}/{{name}}.include"; \
  if [ ! -f "$include_file" ]; then \
    echo "[repomix] Unknown bundle '{{name}}'"; \
    echo "[repomix] Expected file: $include_file"; \
    echo "[repomix] Available bundles:"; \
    find "{{REPOMIX_BUNDLE_CONFIG_DIR}}" -maxdepth 1 -name '*.include' -exec basename {} .include \; | sort | sed 's/^/  - /'; \
    exit 1; \
  fi; \
  flags=""; \
  [ "{{diffs}}" = "true" ] && flags="${flags} --include-diffs"; \
  [ "{{compress}}" = "true" ] && flags="${flags} --compress"; \
  include_patterns="$(grep -vE '^[[:space:]]*($|#)' "$include_file" | tr '\n' ',' | sed 's/,$//')"; \
  if [ -z "$include_patterns" ]; then \
    echo "[repomix] Bundle '{{name}}' has no include patterns."; \
    exit 1; \
  fi; \
  out="{{REPOMIX_DIR}}/repomix-{{name}}.xml"; \
  pnpm exec repomix -c {{REPOMIX_ROOT_CFG}} --include "$include_patterns" --include-full-directory-structure -o "$out" $flags; \
  echo "[repomix] wrote $out"

bundles:
  @mkdir -p {{REPOMIX_BUNDLE_CONFIG_DIR}}
  @find "{{REPOMIX_BUNDLE_CONFIG_DIR}}" -maxdepth 1 -name '*.include' -exec basename {} .include \; | sort