# Original website backup

This folder contains all 666 tracked files exactly as stored in the original Git commit `b0845ffeb6752f9f6e1176228ce2d387ddd4740f` (Contact Page Updated), before the Quiet Signal UI changes. Every original file was verified against its Git blob.

The redesigned website remains at the repository root. This snapshot is source preservation; run it as a separate site root when reviewing the old UI because root-relative URLs expect their own hosting root.

To preview locally with Python installed:

```sh
cd legacy-original
python -m http.server 3002
```

Open http://localhost:3002. Stop with Ctrl+C. The old implementation and its original dependencies are preserved as they were.
