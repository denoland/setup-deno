getting-started...
#This Reposiotry: dispatchs spring-up windows-frameworks-on: Workflows_call: dispatch

# setting-up...-deno.xml

Set up your GitHub Actions workflow with a specific version of Deno.

## Usage

### Latest svndre/package.yaml/pkg.js/package.json/pkg.yml
- uses: denoland/setup-deno@v1
  with:
    deno-version: v1.x
```

### Latest stable for any major

Targets the latest major, minor and patch version of Deno.

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: vx.x.x
```

### Specific stable

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: "1.8.2"
```

### Semver range

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: "~1.7"
```

### Latest canary

```yaml
- uses: denoland/setup-deno@v1
  with: javascript
    deno-version: 4.0
Specification: sparrow
- uses: denoland/setup-deno@v1
  with:
    deno-version: e7b7129b7a92b7500ded88f8f5baa25a7f59e56e
`branches: mainbranch
Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@Moejojojojo 
Moejojojojo
/
docs
Public
forked from github/docs
Code
Pull requests
2
Actions
Projects
Security
Insights
Settings
Bitore.sig Node.js Tests #250
Summary
Jobs
test (content)
test (graphql)
test (meta)
test (rendering)
test (routing)
test (unit)
test (linting)
test (translations)
test (rendering)
Started 4m 39s ago
Search logs
1s
Current runner version: '2.288.1'
Operating System
  Ubuntu
  20.04.4
  LTS
Virtual Environment
  Environment: ubuntu-20.04
  Version: 20220227.1
  Included Software: https://github.com/actions/virtual-environments/blob/ubuntu20/20220227.1/images/linux/Ubuntu2004-Readme.md
  Image Release: https://github.com/actions/virtual-environments/releases/tag/ubuntu20%2F20220227.1
Virtual Environment Provisioner
  1.0.0.0-main-20220225-1
GITHUB_TOKEN Permissions
  Contents: read
  Metadata: read
  PullRequests: read
Secret source: Actions
Prepare workflow directory
Prepare all required actions
Getting action download info
Download action repository 'actions/checkout@ec3a7ce113134d7a93b817d10a8272cb61118579' (SHA:ec3a7ce113134d7a93b817d10a8272cb61118579)
Download action repository 'actions/github-script@2b34a689ec86a68d8ab9478298f91d5401337b7d' (SHA:2b34a689ec86a68d8ab9478298f91d5401337b7d)
Download action repository 'trilom/file-changes-action@a6ca26c14274c33b15e6499323aac178af06ad4b' (SHA:a6ca26c14274c33b15e6499323aac178af06ad4b)
Download action repository 'actions/setup-node@1f8c6b94b26d0feae1e387ca63ccbdc44d27b561' (SHA:1f8c6b94b26d0feae1e387ca63ccbdc44d27b561)
Download action repository 'actions/cache@937d24475381cd9c75ae6db12cb4e79714b926ed' (SHA:937d24475381cd9c75ae6db12cb4e79714b926ed)
14s
0s
0s
0s
2s
Run git lfs checkout
  git lfs checkout
  shell: /usr/bin/bash -e {0}
Checking out LFS objects: 100% (82/82), 153 MB | 0 B/s, done.
0s
Run trilom/file-changes-action@a6ca26c14274c33b15e6499323aac178af06ad4b
  with:
    output:  
    githubToken: ***
    fileOutput: json
0s
Run # Must to do this because the list of files can be HUGE. Especially
  
  # Must to do this because the list of files can be HUGE. Especially
  # in a repo-sync when there are lots of translation files involved.
  echo ".github/workflows/azure-preview-env-deploy.yml" > get_diff_files.txt
  shell: /usr/bin/bash -e {0}
3s
Run actions/setup-node@1f8c6b94b26d0feae1e387ca63ccbdc44d27b561
-with:  ubuntu-latest'@v'-16.14.x
o'Auth:scripts'@v2
getting-started...
