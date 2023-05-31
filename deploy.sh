
#place .nojekyll to bypass Jekyll processing
echo > .nojekyll

git init
git checkou -B main
git add -A
git commit -m 'deploy'

#git push -f git@github.com:slothicorn/OrderForm-React.git main:gh-pages

cd -