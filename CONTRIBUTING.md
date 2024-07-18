# Contributing

## Questions

If you have questions about implementation details, help or support contact me in discord @pandakas

## Suggesting new features or reporting bug

If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our [GitHub Repository](https://github.com/comimafun/catalog-ui/issues/new)

## Commit message contentions

`innercatalog` uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. This allows us to automatically generate a changelog and follow a consistent commit message format.

### Commit Message Format

Format that includes a **type** and a **subject**:

```text
<type>: <subject>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Subject

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Examples

- `feat: add new endpoint`
- `fix: resolve issue with endpoint`
- `docs: update README.md`
- `chore: add new make command`

## Pull Request

Maintainers merge pull requests by squashing all commits and editing the commit message if necessary using the GitHub user interface.

Use an appropriate commit type. Be especially careful with breaking changes.
