echo 'building extension'

rm -rf dist
rm -rf build

mkdir -p dist

export INLINE_RUNTIME_CHUNK=false
export GENERATE_SOURCEMAP=false

react-scripts build

mv build dist/extension

cp public/chrome/content.js dist/content.js
cp public/chrome/background.js dist/background.js

#SCRIPT_BUILD="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=${PWD}/dist/extension"
#eval $SCRIPT_BUILD

zip -r dist/extension.zip dist/extension
