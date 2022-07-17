import { useEffect, useRef } from "react";
import { useDataContext } from "./contexts/DataProvider";
import G6 from "@antv/g6";
import { Input } from "antd";

export default function Example() {
  const { data } = useDataContext();
  const hasRendered = useRef<boolean>(false);
  useEffect(() => {
    if (!hasRendered.current && data) {
      const container = document.getElementById("mountNode") as HTMLDivElement;
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 20,
        getContent(e) {
          const outDiv = document.createElement('div');
          outDiv.style.width = '180px';
          outDiv.innerHTML = `
            <h4>Name: ${(e?.item?.getModel().name as string)?.split("@")[0]}</h4>
            <h4>Version: ${(e?.item?.getModel().name as string)?.split("@")[1]??''}</h4>`
          return outDiv
        },
        itemTypes: ['node']
      });
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
            "drag-node",
            "activate-relations"
          ],
        },
        plugins: [tooltip],
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
            return 150;
          },
        },
      });

      graph.node(function (node:any) {
        return {
          label: node.name.split("@")[0],
          labelCfg: {
            offset: 10,
            position:
              node.children && node.children.length > 0 ? "left" : "right",
          },
        };
      });

      graph.on("node:mouseenter",e=>{
        console.log(e.item)
      })
      graph.on("node:mouseleave",e=>{
        console.log("leave",e.item)
      })

      graph.data(data);
      graph.render();
      graph.fitView();
      hasRendered.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRendered, data]);
  return <div id="mountNode" style={{width:"100%",height:"100%"}}>
    <div style={{zIndex:9999,position:"absolute",bottom:0,right:0,padding:'20px 30px 30px 20px',background:'white'}}>
      <h4>输入需要查找的依赖</h4>
      <div>依赖名称：</div><Input />
      <div>依赖版本：</div><Input />
      </div>
  </div>;
}
