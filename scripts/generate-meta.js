import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, '..', 'public', 'posts');
const LOCALES = ['zh_cn', 'en_us'];
function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match)
        return { meta: {}, body: raw };
    const yaml = match[1];
    const body = match[2] || '';
    const meta = {};
    let currentArrayKey = null;
    for (const line of yaml.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        // Array item
        if (trimmed.startsWith('- ') && currentArrayKey) {
            if (!Array.isArray(meta[currentArrayKey]))
                meta[currentArrayKey] = [];
            meta[currentArrayKey].push(trimmed.slice(2).trim());
            continue;
        }
        // Key-value
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1)
            continue;
        const key = trimmed.slice(0, colonIdx).trim();
        let value = trimmed.slice(colonIdx + 1).trim();
        if (value === 'true')
            value = true;
        else if (value === 'false')
            value = false;
        else if (value === '') {
            currentArrayKey = key;
            continue;
        }
        currentArrayKey = null;
        meta[key] = value;
    }
    return { meta, body };
}
function countWords(text) {
    const stripped = text.replace(/<[^>]+>/g, '').trim();
    if (!stripped)
        return 0;
    const chineseChars = (stripped.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = stripped
        .replace(/[\u4e00-\u9fff]/g, '')
        .split(/\s+/)
        .filter(Boolean).length;
    return chineseChars + englishWords;
}
function calcReadingTime(wordCount) {
    return Math.max(1, Math.ceil(wordCount / 200));
}
for (const locale of LOCALES) {
    const dir = join(POSTS_DIR, locale);
    if (!existsSync(dir))
        continue;
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    const posts = [];
    for (const file of files) {
        const filePath = join(dir, file);
        const raw = readFileSync(filePath, 'utf-8');
        const { meta, body } = parseFrontmatter(raw);
        if (meta.draft === true)
            continue;
        const slug = basename(file, '.md');
        const wordCount = countWords(body);
        const readingTime = calcReadingTime(wordCount);
        posts.push({
            slug,
            title: meta.title || slug,
            date: meta.date || '',
            updated: meta.updated || undefined,
            description: meta.description || '',
            tags: meta.tags || [],
            pinned: meta.pinned === true,
            cover: meta.cover || undefined,
            wordCount,
            readingTime,
        });
    }
    posts.sort((a, b) => {
        if (a.pinned !== b.pinned)
            return a.pinned ? -1 : 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    const index = {
        generated: new Date().toISOString(),
        posts,
    };
    writeFileSync(join(dir, 'meta.json'), JSON.stringify(index, null, 2), 'utf-8');
    console.log(`[${locale}] Generated meta.json with ${posts.length} posts`);
}
console.log('Done.');
