import * as React from "react";
import { useDrop } from "@react-aria/dnd";

interface Props {
  children: React.ReactNode;
  onDrop(item: any): Awaited<void>;
}

export function Droppable(props: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const { dropProps } = useDrop({
    ref,
    async onDrop(e) {
      console.log({ e });

      const [item] = await Promise.all(
        e.items.map((item) => {
          if (item.kind === "text" && item.types.has("application/json")) {
            console.log({ item });

            return item.getText("application/json");
          }
        }),
      );

      if (!item) return;

      props.onDrop(JSON.parse(item));
    },
  });

  const [child, ...rest] = Array.isArray(props.children) ? props.children : [props.children];

  const copied = React.cloneElement(child as React.ReactElement, {
    ...dropProps,
    ref,
    tabIndex: 0,
  });

  return copied;
}
