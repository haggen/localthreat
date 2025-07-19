import { Link } from "wouter";
import { fmt } from "~/lib/fmt";
import { useHistory } from "~/lib/history";

function formatContent(content: string[]) {
  if (content.length <= 2) {
    return content.join(", ");
  }
  return `${content.slice(0, 2).join(", ")} and ${content.length - 2} more`;
}

export function History() {
  const history = useHistory();

  const items = Object.values(history).sort((a, b) => {
    return new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime();
  });

  return (
    <div className="flex flex-col gap-12 p-6 overflow-y-auto">
      <ul className="list-[square] pl-6">
        {items.map((item) => (
          <li key={item.id} className="mb-3">
            <Link href={`/${item.id}`}>
              <h1 className="font-bold">{fmt.datetime(item.visitedAt)}</h1>
              <p className="text-sm">{formatContent(item.content)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
