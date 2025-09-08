# TEDxNITK Surathkal Official Website
<p align="center"> <img src="assets/img/tedx-white.png" alt="TEDxNITKSurathkal Logo" width="500"/> </p> <p align="center"> <a href="https://github.com/tedxnitksurathkal/tedxnitksurathkal.github.io/stargazers"> <img src="https://img.shields.io/github/stars/tedxnitksurathkal/tedxnitksurathkal.github.io?style=for-the-badge" /> <img src="https://img.shields.io/github/contributors/tedxnitksurathkal/tedxnitksurathkal.github.io?style=for-the-badge" alt="Contributors"/></a> <a href="https://github.com/tedxnitksurathkal/tedxnitksurathkal.github.io/issues"> <img src="https://img.shields.io/github/issues/tedxnitksurathkal/tedxnitksurathkal.github.io?style=for-the-badge" /> </a> <a href="https://github.com/tedxnitksurathkal/tedxnitksurathkal.github.io/network/members"> <img src="https://img.shields.io/github/forks/tedxnitksurathkal/tedxnitksurathkal.github.io?style=for-the-badge" /> </a> </p>
<p align="center"> <!-- Tech stack --> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> </p>

## About

This repository hosts the official website for TEDxNITK Surathkal — a platform dedicated to spreading ideas and inspiration through independently organized TED events at NITK.

---

## Highlights:

- Core website pages: Home, About, Contact, Team, Partners, Themes  
- Assets: CSS, JS, images, theme files  
- Interactive features: mini-games, crossword, maze, past event archives  
- Microsites: experimental pages for events/games  

---

## Directory Structure
```bash

tedxnitksurathkal.github.io/
├── index.html              # Main landing page of the website
├── about.html              # Information about TEDxNITK Surathkal
├── contact.html            # Page for contact information and form
├── team.html               # Displays information about the team members
├── partners.html           # Lists partners and sponsors of the event
├── theme.html              # Page dedicated to the current year's theme
├── theme2023.html          # Page for the 2023 event theme
├── 404.html                # Custom error page displayed for broken links
│
├── assets/                 # Contains core assets like CSS, JavaScript, and images
│   ├── css/                # Stylesheets for various sections and overall design
│   ├── js/                 # JavaScript files for website interactivity and dynamic content
│   ├── img/                # Image assets including logos, speaker pictures, and theme visuals
│   ├── theme/              # Specific styling and scripts related to the current theme
│   └── hakunamatata/       # Microsite for a special event, potentially containing mini-games
│
├── past-editions-archive/  # Archives of previous TEDxNITK events
│   ├── 2020/               # Event pages and associated assets for the 2020 edition
│   ├── 2020-trailblazer/   # Themed microsite for 2020, including a custom maze game
│   ├── 2021/               # 2021 event theme and a crossword game
│   ├── 2021-attention/     # Interactive theme pages for the 2021 'Attention' theme
│   ├── 2021-data/          # Content related to the 2021 'Data-driven' theme
│   └── 2022-lost/          # Content for the 2022 'Lost & Found' theme
│
├── simba-home/             # Alternate microsite with a unique design and content
├── luck-game/              # Microsite for an interactive 'Luck' themed game
├── cursor/                 # Contains files for custom cursor designs
│
├── CONTRIBUTORS.md         # Markdown file listing all contributors to the project
├── package.json            # Lists project dependencies and scripts for build tools
├── gulpfile.js             # Configuration file for Gulp, used for task automation and asset building
└── README.md               # Project documentation and general information

```


---

## Installation

As the project tracks binary files through Git, over the years Git has stored references to many files no longer present (or even relevant). The initial repository clone takes around ~700 MiB, while the project size is less than 200 MiB.

```bash
# Using HTTP protocol
git clone --depth 1 https://github.com/tedxnitksurathkal/tedxnitksurathkal.github.io.git

# Using SSH protocol
git clone --depth 1 git@github.com:tedxnitksurathkal/tedxnitksurathkal.github.io.git
```

While you can use any web server to serve the site, I recommend using the ruby gem [serve](http://get-serve.com/).

```bash
gem install serve
cd $PROJECT_DIR
serve
```

## Contributing

We welcome contributions to improve the website. Follow these steps:

- Fork the repository

- Create a branch:
```bash
git checkout -b feature/<your-feature-name>
```

Make changes following coding conventions

- Push your branch:
```bash
git push origin feature/<your-feature-name>
```

- Open a Pull Request (PR) to merge into the main branch

Commit messages should be clear and descriptive, e.g., “Fix navigation responsiveness” or “Add past edition 2021 theme page.”

## Contributions

We would like to sincerely thank everyone who has contributed to this project. Your efforts help make the TEDxNITKSurathkal website better and more accessible to the community.
You can also check Insights → Contributors on GitHub for a full contribution history.
