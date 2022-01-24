export function splitAtFrontmatter(content) {
    let pointer = 0;
    let fences = 0;
    let buf = [];
    for (let i = 0; i < content.length; i++) {
        pointer++;
        const char = content[i];
        if (char === '-') {
            buf.push('-');
            if (buf.length === 3) {
                buf.length = 0;
                fences++;
                if (fences === 2) {
                    break;
                }
            }
        }
    }
    return [content.slice(0, pointer), content.slice(pointer)];
}
