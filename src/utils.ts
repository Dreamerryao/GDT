import { GraphEdge } from "./contexts/DataProvider";

const findCircleInGraph = (arr:string[][]) => {
  const graphNodes: string[] = [];
  const graphEdges: GraphEdge[] = [];
  const list: Record<string, string[]> = {}; // 邻接表
  const queue: string[] = []; // 入度为0的节点集合
  const indegree: Record<string, number> = {};
  arr.map((x) => {
    [0, 1].map((i) => {
      if (graphNodes.findIndex((v: string) => v === x[i]) === -1) {
        graphNodes.push(x[i]);
      }
    });
    graphEdges.push({ source: x[0], target: x[1] });
    if (!list[x[0]]) list[x[0]] = [];
    if (!indegree[x[1]]) indegree[x[1]] = 0;
    list[x[0]].push(x[1]);
    indegree[x[1]] += 1;
  });
  const V = graphNodes.length;

  graphNodes.forEach((node) => {
    if (!indegree[node]) indegree[node] = 0;
    if (!list[node]) list[node] = [];
  });

  const ss = () => {
    Object.keys(indegree).forEach((id) => {
      if (indegree[id] === 0) {
        queue.push(id);
      }
    });
    let count = 0;
    while (queue.length) {
      ++count;
      const currentNode = queue.pop();
      const nodeTargets = list[currentNode!] || [];
      for (let i = 0; i < nodeTargets.length; i++) {
        const target = nodeTargets[i];
        indegree[target] -= 1;
        if (indegree[target] === 0) {
          queue.push(target);
        }
      }
    }
    // false 没有输出全部顶点，有向图中有回路
    return !(count < V);
  };
  console.log(ss());
  graphNodes.forEach((node) => {
    if (indegree[node] !== 0) console.log(node);
  });
};

export default findCircleInGraph;