#!/usr/bin/env bash

export NODE_ENV=development
export GATSBY_AIRTABLE_API_KEY="$AT_API_KEY"
git config --global user.email "autodeployer@pcto.co"
git config --global user.name "autodeployer"
git clone –-depth 1 https://karllhughes:$GITHUB_API_KEY@github.com/cfpland/frontend
cd frontend
npm install
npm run deploy
