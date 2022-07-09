import React, { useEffect, useRef, useState } from "react";
import { Tree, useDataContext } from "./contexts/DataProvider";
import G6, { GraphData } from "@antv/g6";

export default function Example() {
  const { data } = useDataContext();
  const hasRendered = useRef<boolean>(false);
  useEffect(() => {
    if (!hasRendered.current && data) {
      console.log("???");
      console.log(data);
      const container = document.getElementById("mountNode") as HTMLDivElement;
      const graph = new G6.TreeGraph({
        container: "mountNode",
        width: container.scrollWidth||1000,
        height: container.scrollHeight||600,
        modes: {
          default: [
            {
              type: "collapse-expand",
              onChange: function onChange(item: any, collapsed) {
                const data = item.getModel();
                data.collapsed = collapsed;
                return true;
              },
            },
            "drag-canvas",
            "zoom-canvas",
            "drag-node"
          ],
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: "cubic-horizontal",
        },
        layout: {
          type: "compactBox",
          direction: "LR",
          getId: function getId(d:any) {
            return d.id.toString();
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 10;
          },
          getHGap: function getHGap() {
            return 100;
          },
        },
      });

      graph.node(function (node:any) {
        return {
          label: node.name,
          labelCfg: {
            offset: 10,
            position:
              node.children && node.children.length > 0 ? "left" : "right",
          },
        };
      });

      graph.data(data);
      graph.render();
      graph.fitView();
      hasRendered.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRendered, data]);
  return <div id="mountNode" style={{width:"100%",height:"100%"}}></div>;
}
