inkscape --export-filename 256.png -w 256 -h 256 ../mcprism-desktop-icon.svg
inkscape --export-filename 64.png -w 64 -h 64 ../mcprism-desktop-icon.svg
inkscape --export-filename 48.png -w 48 -h 48 ../mcprism-desktop-icon.svg
inkscape --export-filename 32.png -w 32 -h 32 ../mcprism-desktop-icon.svg
inkscape --export-filename 24.png -w 24 -h 24 ../mcprism-desktop-icon.svg
inkscape --export-filename 16.png -w 16 -h 16 ../mcprism-desktop-icon.svg

magick convert 16.png 24.png 32.png 48.png 64.png 256.png mcprism.ico