import { createId } from "./createId.ts";

export type SerializedReport = {
  id: string;
  createdAt: string;
  source: string;
};

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
    const transcriptExpr = new RegExp(
      "<url=showinfo:13..//.+?>(.+?)</url>",
      "g",
    );

    let names = Array.from(source.matchAll(transcriptExpr), ([, name]) => name);

    if (names.length > 0) {
      return names;
    }

    names = source.trim().split(/[\n\r]+/);

    // Character names must be between 3 and 37 characters long.
    // If a single name isn't to code, we discard the whole input.
    for (const name of names) {
      if (name.length < 3 || name.length > 37) {
        return [];
      }
    }

    return names;
  }

  serialize(): SerializedReport {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      source: this.content.join("\n"),
    };
  }

  append(content: string[]) {
    this.content = Array.from(new Set([...this.content, ...content]));
  }
}
