// @ts-nocheck
"use client";

import * as React from "react";

import { TableOfContents } from "@/lib/toc";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

interface TocProps {
  toc: TableOfContents;
}

export function TOC({ toc }: TocProps) {
  const itemIds = React.useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => {
              const temp = id?.split("#")[1];
              return `user-content-${temp}`;
            })
        : [],
    [toc]
  );
  const activeHeading = useActiveItem(itemIds);
  const mounted = useMounted();

  if (!toc?.items || !mounted) {
    return null;
  }

  return (
    <div className="w-full space-y-2 flex justify-center">
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}

interface TreeProps {
  tree: TableOfContents;
  level?: number;
  activeItem?: string;
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 5 ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={`#user-content-${item.url?.replaceAll("#", "")}`}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                `user-content-${item.url?.replaceAll("#", "")}` ===
                  `${activeItem}`
                  ? "font-medium text-foreground"
                  : "text-primary"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree
                tree={item}
                level={level + 1}
                activeItem={`${activeItem}`}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
