# setup-deno

Set up your GitHub Actions workflow with a specific version of Deno.

## Usage

### Latest stable for a major

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: v2.x
```

### Latest stable for any major

Targets the latest major, minor and patch version of Deno.

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: vx.x.x
```

### Specific stable

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: "1.8.2"
```

### Semver range

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: "~1.7"
```

### Latest canary

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: canary
```

### Specific canary

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: e7b7129b7a92b7500ded88f8f5baa25a7f59e56e
```

### Latest release candidate

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: rc
```

### Specific release candidate

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: 2.0.0-rc.1
```

### Latest LTS

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: lts
```

### Version from file

The extension can also automatically read the version file from
[`.tool-versions`](https://asdf-vm.com/manage/configuration.html#tool-versions)

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version-file: .tool-versions
```

The extension can also automatically read the file from
[`dvm`](https://github.com/justjavac/dvm).

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version-file: .dvmrc
```

### Specifying binary name

This is useful when you want to install different versions of Deno side by side.

```yaml
- uses: denoland/setup-deno@v2
  with:
    deno-version: canary
    deno-binary-name: deno_canary
```

### Determining the release channel

You can determine the release channel reading back the `release-channel` output.

Valid values are `stable`, `canary` and `rc`.

```yaml
- uses: denoland/setup-deno@v2
  id: deno
  with:
    deno-version: canary

- run: echo "Deno release channel is ${{ steps.deno.outputs.release-channel }}"
```

### Determining the installed version

You can determine the installed version reading back the `deno-version` output.

For canary versions, the output will be in the form `0.0.0-GIT_HASH`.

For stable and rc versions, the output will be the regular semver version
number.

```yaml
- uses: denoland/setup-deno@v2
  id: deno
  with:
    deno-version: canary

- run: echo "Deno version is ${{ steps.deno.outputs.deno-version }}"
```

### Caching dependencies downloaded by Deno automatically

Dependencies installed by Deno can be cached automatically.

To enable the cache, use `cache: true`.

```yaml
- uses: denoland/setup-deno@v2
  with:
    cache: true
```

> [!WARNING]
> If an environment variable `DENO_DIR` is set for steps that run/download
> dependencies, then `DENO_DIR` must also be set for the `denoland/setup-deno`
> action, for the caching to work as intended.

By default, the cache is automatically keyed by:

- the github
  [job_id](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id)
- the runner os and architecture
- a hash of the deno.lock files in the project

It is possible to customize the default hash
(`${{ hashFiles('**/deno.lock') }}`) used as part of the cache key via the
`cache-hash` input.

```yaml
- uses: denoland/setup-deno@v2
  with:
    # setting `cache-hash` implies `cache: true`
    # and will replace the default cache-hash
    # of `${{ hashFiles('**/deno.lock') }}`
    cache-hash: ${{ hashFiles('/deno.json') }}
```
