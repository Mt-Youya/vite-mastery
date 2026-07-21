import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()

const EXTENSIONS = new Set([".mdx"])

const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"])

function walk(dir: string): string[] {
  const files: string[] = []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        files.push(...walk(fullPath))
      }
      continue
    }

    if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function fixMdx(content: string): {
  changed: boolean
  content: string
} {
  let changed = false

  const result = content.replace(
    /(<[A-Z][^>]*>)\n((?:\s*-\s+.+\n?)+)(<\/[A-Z][^>]*>)/g,
    (_, open: string, body: string, close: string) => {
      changed = true

      const list = body
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trim()

      return `${open}\n\n${list}\n\n${close}`
    }
  )

  return {
    changed,
    content: result,
  }
}

function main() {
  const files = walk(ROOT)

  let count = 0

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8")

    const result = fixMdx(source)

    if (result.changed) {
      fs.writeFileSync(file, result.content, "utf8")

      console.log(`fixed: ${file}`)
      count++
    }
  }

  console.log(`\nDone. Fixed ${count} files.`)
}

main()
