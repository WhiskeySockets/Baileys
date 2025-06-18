#!/bin/bash

echo "🔎 Scanez tot proiectul pentru conflicte..."

# Backup folder
mkdir -p .conflict_backups

# Găsește toate fișierele text cu marcaje Git
conflicted=$(grep -rl '<<<<<<<' --exclude-dir=.git)

if [ -z "$conflicted" ]; then
    echo "✅ Totul e curat. Niciun conflict detectat!"
    exit 0
fi

for file in $conflicted; do
    echo "🧹 Rezolv: $file"

    # Salvează backup în caz că vrei să revii
    cp "$file" ".conflict_backups/${file##*/}.$(date +%s).bak"

    # Șterge conflictele și păstrează versiunea ta (HEAD)
    awk '
    BEGIN { keep=1 }
    /^<<<<<<< / { keep=1; next }
    /^=======/   { keep=0; next }
    /^>>>>>>> /  { keep=1; next }
    { if (keep) print }
    ' "$file" > "$file.cleaned" && mv "$file.cleaned" "$file"

    echo "✅ Curățat: $file"
done

echo "🎯 Gata, toate conflictele rezolvate cu versiunea ta locală!"
echo "📦 Backup-urile sunt salvate în folderul .conflict_backups"
