#!/bin/bash

echo "🔍 Căutăm conflicte în fișiere .proto..."

# Caută conflictele în fișierele .proto
for file in $(grep -rl '<<<<<<<' --include \*.proto); do
    echo "🛠️  Rezolvăm conflictul din: $file"

    # Scoate toate marcajele de conflict și păstrează versiunea locală (HEAD)
    awk '
    BEGIN { keep=1 }
    /^<<<<<<< /     { keep=1; next }
    /^=======/       { keep=0; next }
    /^>>>>>>> /     { keep=1; next }
    { if (keep) print }
    ' "$file" > "$file.resolved"

    mv "$file.resolved" "$file"
    echo "✅  Conflict eliminat în: $file"
done

echo "🎉 Gata! Toate conflictele .proto rezolvate cu versiunea ta locală!"
