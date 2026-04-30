#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fixtures_dir="$repo_root/packages/signing-client/fixtures"
tmp_key="/tmp/primer-paso-test-signing.key.pem"
cert_path="$fixtures_dir/test-organisation-signing-cert.cert.pem"
p12_path="$fixtures_dir/test-organisation-signing-cert.p12"
passphrase_path="$fixtures_dir/test-organisation-signing-cert.passphrase.txt"
passphrase="test-password"

mkdir -p "$fixtures_dir"

cleanup() {
	rm -f "$tmp_key"
}

trap cleanup EXIT

openssl req -x509 \
	-newkey rsa:2048 \
	-keyout "$tmp_key" \
	-out "$cert_path" \
	-days 3650 \
	-nodes \
	-subj "/C=ES/O=Primer Paso Test Organisation/CN=Primer Paso Test Organisation Seal"

openssl pkcs12 -export \
	-inkey "$tmp_key" \
	-in "$cert_path" \
	-out "$p12_path" \
	-name "Primer Paso Test Organisation Seal" \
	-passin "pass:$passphrase" \
	-passout "pass:$passphrase"

cat > "$passphrase_path" <<EOF
$passphrase
EOF

chmod 0644 "$cert_path" "$p12_path" "$passphrase_path"

echo "Generated fake signing fixture:"
echo "  $cert_path"
echo "  $p12_path"
echo "  $passphrase_path"
