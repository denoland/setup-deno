# setup-deno

Set up your GitHub Actions workflow with a specific version of Deno.

## Usage

### Latest stable for a major

```yaml
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
  with:
    deno-version: canary
```

### Specific canary

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: e7b7129b7a92b7500ded88f8f5baa25a7f59e56e
```

### Release candidate

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: rc
```

### Version from file

The extension can also automatically read the version file from
[`.tool-versions`](https://asdf-vm.com/manage/configuration.html#tool-versions)

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version-file: .tool-versions
```

The extension can also automatically read the file from
[`dvm`](https://github.com/justjavac/dvm).

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version-file: .dvmrc
```

### Specifying binary name

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-binary-name: deno_latest
```
