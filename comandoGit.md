# Git Commands Cheat Sheet

This document provides a quick reference for commonly used Git commands. Use these commands to manage your repositories effectively.

## Cloning a Repository

Clone a repository to your local machine:

```bash
git clone <repository-url>
```

## Connecting with GitHub

- **Pull**: Fetch and merge changes from the remote repository:
  ```bash
  git pull origin <branch>
  ```
- **Push**: Upload your changes to the remote repository:
  ```bash
  git push origin <branch>
  ```

## Checking Repository Status

Check the status of your working directory and staging area:

```bash
git status
```

## Working with Branches

- **Create a branch**: Create a new branch:
  ```bash
  git branch <branch-name>
  ```
- **View branches**: List all branches:
  ```bash
  git branch
  ```
- **Switch branches**: Move to a different branch:
  ```bash
  git checkout <branch-name>
  ```
- **Create and switch**: Create and switch to a new branch:
  ```bash
  git checkout -b <branch-name>
  ```

## Making Changes and Commits

- **Stage changes**: Add files to the staging area:
  ```bash
  git add <file-or-folder>
  ```
- **Commit changes**: Save changes to the repository:
  ```bash
  git commit -m "commit message"
  ```
- **Amend commit**: Modify the last commit (use with caution):
  ```bash
  git commit --amend
  ```

## Merging Changes

Merge changes from one branch into another:

```bash
git merge <branch-name>
```

## Undoing Changes

- **Unstage a file**: Remove a file from the staging area:
  ```bash
  git reset <file>
  ```
- **Discard changes**: Revert changes in a file:
  ```bash
  git checkout -- <file>
  ```

## Viewing History

- **View commit history**: Show the commit history:
  ```bash
  git log
  ```
- **Compact log**: Display a compact log:
  ```bash
  git log --oneline
  ```

## Deleting Branches

- **Delete a local branch**:
  ```bash
  git branch -d <branch-name>
  ```
- **Delete a remote branch**:
  ```bash
  git push origin --delete <branch-name>
  ```

## Stashing Changes

Temporarily save changes without committing:

```bash
git stash
```

Apply stashed changes:

```bash
git stash apply
```

## Additional Tips

- **Check remote URLs**:
  ```bash
  git remote -v
  ```
- **Set upstream branch**:
  ```bash
  git branch --set-upstream-to=origin/<branch-name>
  ```

This cheat sheet covers essential Git commands to help you manage your projects efficiently. For more advanced usage, refer to the [Git documentation](https://git-scm.com/doc).
