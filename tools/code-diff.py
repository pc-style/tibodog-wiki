"""Diffs two builds of one minified chunk, ignoring renamed minified identifiers and chunk hashes.

Usage: python3 -I tools/code-diff.py <old.js> <new.js> [max hunks to print]
Prints the changed statements and a final "hunks: N" line.
"""
import difflib, re, sys

CHUNK = re.compile(r'[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(js|css|png)')
COMMIT = re.compile(r'`[0-9a-f]{40}`')
SHORT = re.compile(r'(?<![\w$.`])[A-Za-z_$][\w$]{0,2}(?![\w$])')


def statements(path):
    s = open(path).read()
    return [x.strip() for x in re.split(r'(?<=[;{}])', s) if x.strip()]


def canon(line):
    # import/export lists are pure name maps
    if re.match(r'^(import|export)\s*\{|^[\w$]+ as [\w$]+\s*[,}]', line):
        return ''
    line = CHUNK.sub('CHUNK', line).replace('...', '… ')
    line = COMMIT.sub('`COMMIT`', line)  # the build's own git commit id changes every build
    return SHORT.sub('_', line)


old, new = statements(sys.argv[1]), statements(sys.argv[2])
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 40
co, cn = [canon(x) for x in old], [canon(x) for x in new]
hunks = 0
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, co, cn, autojunk=False).get_opcodes():
    if tag == 'equal' or (co[i1:i2] == cn[j1:j2]):
        continue
    if not any(co[i1:i2]) and not any(cn[j1:j2]):
        continue
    hunks += 1
    if hunks > limit:
        continue
    print('==', tag)
    for x in old[i1:i2][:15]:
        print('<', x[:300])
    for x in new[j1:j2][:15]:
        print('>', x[:300])
print('hunks:', hunks)
