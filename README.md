![Logo](assets/images/logo.png)

---

**Analyze your SEO.**

LetMeSEO analyze the url content, and assign you a score that indicate the quality of SEO applied to the specific page.

## How to

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/git-yuritancredi/LetMeSEO
# Go into the repository
cd LetMeSEO
# Install dependencies
npm install
# Run the app in development mode
npm run dev
```

#### Portable app (All platforms)

You can find all exported app (after building process) on 'build' folder

```bash
# Clone this repository
git clone https://github.com/git-yuritancredi/LetMeSeo
# Go into the repository
cd LetMeSeo
# Install dependencies
npm install
# Pack app
npm run pack
```

#### Emulate production

```bash
# Clone this repository
git clone https://github.com/git-yuritancredi/LetMeSeo
# Go into the repository
cd LetMeSeo
# Install dependencies
npm install
# Build app
npm run build
# Pack app
npm run prod
```

#### Build or rebuild app
```bash
# To build app without clean
npm run build

# To build app with clean
npm run rebuild
```

#### Todo's
- [ ] Add language support
- [ ] Add Rich Snippet support
- [ ] Add site text content analyzer

The portable app is available only on x64 systems, if you want to export for different architectures you can edit the `package.json` file and add more architectires.
