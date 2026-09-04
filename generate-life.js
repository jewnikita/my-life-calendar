name: Generate Life Calendar Image

on:
  schedule:
    - cron: '0 20 * * *'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install puppeteer@22.12.1

      - name: Generate life calendar PNG
        run: node generate-life.js

      - name: Commit and push changes
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add life-calendar.png
          git commit -m "Update life calendar image" || true
          git push

