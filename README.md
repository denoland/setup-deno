# setup-deno

Set up your GitHub Actions workflow with a specific version of Deno.

## Usage

### Latest stable

> Note: we highly recommend specifying the latest stable version you want to test on because Deno does not follow semver and introduces non-backwards compatible changes within minor version bumps.

```yaml
- uses: denoland/setup-deno@v1
  with:
    deno-version: v1.x
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
