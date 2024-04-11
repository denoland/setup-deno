# setup-deno

Set up your GitHub Actions workflow with a specific version of Deno.

## Usage

### Version from file

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version-file: .dvmrc
```

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version-file: .tool-versions
```

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
