# 🎭 LuchaMania Game Board 🎭

A high-energy, browser-based game board for livestreaming wrestling-themed trivia games. Built with HTML, CSS, and JavaScript. Integrated with Google Sheets for easy content management.

## Features

✨ **Interactive Gameplay**
- 2 Player/Team System with Score Tracking
- 4 Categories with 4 Questions Each
- Dynamic Point Values (1, 5, 7, 10)
- 30-Second Timer with Warning Alerts
- Turn Tracker

🎪 **Special Spaces**
- **Whammy**: Lose points and your turn
- **Daily Double**: Double your points!
- **Decision Time**: Choose your point value

🎬 **Visual & Audio**
- Wrestling-themed dark arena aesthetic
- Neon cyan and magenta accents
- Flashy animations and transitions
- Sound effects (Web Audio API + optional MP3s)
- OBS-optimized 1920x1080 resolution

📊 **Google Sheets Integration**
- Load questions directly from a shared Google Sheet
- Easy editing of categories, questions, and answers
- CSV format support

## Installation & Setup

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **+** icon in the top-right and select **New repository**
3. Name it: `LuchaMania-GameBoard`
4. Add description: "Wrestling-themed game board for livestreaming"
5. Select **Public** (required for GitHub Pages)
6. Click **Create repository**

### Step 2: Upload Files to GitHub

**Option A: Via GitHub Web Interface (Easiest)**

1. In your new repository, click **Add file** → **Create new file**
2. Name the file `index.html` and paste the contents
3. Click **Commit changes** and use the default message
4. Repeat for `css/style.css`, `js/main.js`, and `js/sounds.js`
   - For the CSS file, create the folder structure by naming it `css/style.css`

**Option B: Via Git Command Line**

```bash
# Clone your repository
git clone https://github.com/DonLucha/LuchaMania-GameBoard.git
cd LuchaMania-GameBoard

# Create file structure
mkdir -p css js assets/sounds

# Create all files (copy the content from above)
# ...

# Add and commit
git add .
git commit -m "Initial commit: LuchaMania Game Board"
git push origin main
