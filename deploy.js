#!/usr/bin/env node

const {execFileSync} = require('child_process');

const cf = args => execFileSync('cf', args, {stdio: 'inherit'});

const api = 'api.run.pivotal.io';
const user = 'nguerette@pivotal.io';
const org = 'labs-playground';
const space = 'Nick Guerette';

const currentTarget = execFileSync('cf', ['target']);

if (
  !currentTarget.includes(api) ||
  !currentTarget.includes(user) ||
  !currentTarget.includes(org) ||
  !currentTarget.includes(space)
) {
  cf(['login', '-a', api, '-u', user, '-o', org, '-s', space]);
}

cf([
  'push', 'gimme-a-guid',
  '-b', 'nodejs_buildpack',
  '-i', '1',
  '-k', '256M',
  '-m', '64M',
  '-c', 'node -e "require(\'./scratch\').newApp(process.env.PORT)"'
]);
