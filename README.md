# Before you begin

### Get access

First, set your secrets & environmentId in .flatfilerc. Those can be retrieved by signing up at https://dashboard.flatfile.com/account/sign-up. You'll see them on that home page.

run `npm install`

### Deploy

Then, prepend `npm run` to any of the scripts in package.json and run in terminal.

I suggest starting with the first one as each script builds upon the simplest example.

Once you deploy, head back to dashboard.flatfile.com and click Create Space. You'll see a dropdown menu to choose the SpaceConfig you've just deployed.

# Learn

### Listeners

When you deploy an Agent, that lives on the Environment level. You can use any new or already deployed SpaceConfig/Space to listen for Events.

Note: You'll want to change your environmentId in .flatfilerc if you're interacting with the listener package (/listener folder) since currently we only offer 1 Agent per Environment.

### Custom Actions

in progress

### Logging

Anything you console log will go to your Logs section in your dashboard.

---

#### Disclaimer

This example project is very much a work in progress. If you run into issues, email us: **devxp@flatfile.io**.

**Alex Hollenbeck**, Head of Growth Engineering, Flatfile

**Maire Sangster**, Staff Engineer, Flatfile

**Alex Rock**, Staff Engineer, Flatfile

**Ashley Mulligan**, Head of Developer Experience & Growth Product, Flatfile

**David Boskovic**, Founder & CEO, Flatfile
