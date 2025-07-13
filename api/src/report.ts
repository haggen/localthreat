import { createId } from "./createId";

export type SerializedReport = {
  id: string;
  createdAt: string;
  source: string;
};

const expr = new RegExp("<url=showinfo:13..//.+?>(.+?)</url>", "g");

export class Report {
  id = createId();
  createdAt = new Date();
  content: string[] = [];

  static unserialize(data: SerializedReport): Report {
    const report = new Report();
    report.id = data.id;
    report.createdAt = new Date(data.createdAt);
    report.content = data.source.split("\n");
    return report;
  }

  static parse(source: string) {
    const matches = source.match(expr);
    if (matches) {
      return matches.map(([, name]) => String(name));
    }
    const content = source.trim().split(/[\n\r]+/);
    for (const name of content) {
      // Character names must be between 3 and 37 characters long.
      if (name.length < 3 || name.length > 37) {
        return [];
      }
    }
    return content;
  }

  serialize(): SerializedReport {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      source: this.content.join("\n"),
    };
  }

  append(added: string[]) {
    this.content = Array.from(new Set([...this.content, ...added]));
  }
}
