# Official Website for TEDxNITKSurathkal

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
