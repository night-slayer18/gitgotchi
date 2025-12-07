# GitGotchi (The Contribution Pet) 🐉

**GitGotchi** is a GitHub Action that maintains a virtual pet in your profile README. This pet's life depends on your coding activity! It is a gamification layer for open-source contributions, designed to motivate developers to commit code daily.

![GitGotchi Example](gitgotchi.svg)

## 🎮 How it Works

Your pet lives on your GitHub Profile. It needs "fuel" (commits) to survive and grow.

*   **HP (Health)**: Decays every day. Recover it by committing code. If it hits 0, your pet becomes a Ghost! 👻
*   **XP (Experience)**: Earn XP to evolve your pet from an **Egg** 🥚 to a **Dragon** 🐉.
*   **Streak**: Keeps track of your daily coding streak. If you chain 3+ days, you get a **1.5x XP Multiplier**.

### Scoring System
| Action | Reward | Notes |
| :--- | :--- | :--- |
| **Commit** | +10 XP / +20 HP | Capped at 50 XP per run to prevent spam. |
| **Pull Request** | +50 XP | Must be merged. |
| **Issue Closed** | +20 XP | Must be closed by you. |

---

## 🚀 Quick Start

### 1. Create a Personal Access Token (PAT)
You need a token to fetch your contribution stats (including private repos!).
1.  Go to [Developer Settings -> Tokens (Classic)](https://github.com/settings/tokens).
2.  Generate a new token with **`repo`** and **`user`** scopes.
3.  Add it to your repository secrets as `USER_TOKEN`.

### 2. Create a Template
Create a file named `TEMPLATE.md` in your repository root. Add this placeholder where you want the pet to appear:

```markdown
# My Profile
{{ gitgotchi }}
```

### 3. Add the Workflow
Create `.github/workflows/gitgotchi.yml`:

```yaml
name: GitGotchi
on:
  schedule:
    - cron: '0 0 * * *' # Run daily at midnight
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  update-pet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run GitGotchi
        uses: night-slayer18/gitgotchi@v1
        with:
          token: ${{ secrets.USER_TOKEN }}
          pet_name: 'My Dragon'
          
      - name: Commit & Push
        run: |
          if [[ "$(git status --porcelain)" != "" ]]; then
            git config user.name github-actions[bot]
            git config user.email 41898282+github-actions[bot]@users.noreply.github.com
            git add README.md .github/gitgotchi
            git commit -m "Update GitGotchi Stats"
            git push
          fi
```

---

## ⚙️ Configuration

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | **Required.** GitHub Token (PAT recommended for private stats). | None |
| `pet_name` | Name of your pet displayed on the card. | `GitGotchi` |
| `template_file` | Source markdown file with `{{ gitgotchi }}`. | `TEMPLATE.md` |
| `out_file` | Output markdown file to generate. | `README.md` |
| `assets_dir` | Directory to store JSON state and Images. | `.github/gitgotchi` |

## 🌟 Features
*   **Vector Graphics**: High-quality, scalable SVG assets.
*   **Theme Aware**: Looks great in Dark Mode (Glassmorphism design).
*   **Smart Caching**: Auto-generates unique filenames to ensure the image updates instantly on GitHub.
*   **Abuse Protection**: XP caps ensure fair play.