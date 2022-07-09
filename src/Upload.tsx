import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import {
  Tree,
  useDataContext,
} from "./contexts/DataProvider";

const { Dragger } = Upload;



interface RouteNode {
  id: string;
  name: string;
  value: number;
  route?: number[];
}

const UploadPage = () => {
  const { onChangeData } = useDataContext();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "",
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          try {
            const text: string = reader.result as string;
            const arr = text
              .trim()
              .split("\n")
              .map((x) => x.trim().split(" "));
            if (!arr.every((x) => x.length === 2) || arr.length === 0) {
              throw Error("Invalid input");
            }
            let key = 0;
            const routeNodes: Record<string, RouteNode> = {};
            const repeatDependNodes: Record<string, Tree> = {};
            const roots: Record<string, Tree> = {};
            let root: Tree = {
              id: "-1",
              name: "",
              value: 0,
              collapsed:true
            };
            const insertTreeRoute = (tree: Tree, route: number[]) => {
              if (routeNodes[tree.name]) {
                routeNodes[tree.name].route = route;
                return;
              }
              routeNodes[tree.name] = {
                id: tree.id,
                name: tree.name,
                value: tree.value,
                route,
              };
              return;
            };

            const insertTree = (
              parentTree: Tree,
              keys: number[],
              newTree: Tree
            ): number[] => {
              if (keys.length === 0) {
                if (parentTree.children) {
                  parentTree.children.push(newTree);
                } else {
                  parentTree.children = [newTree];
                }
                parentTree.value++;
                return [parentTree.children.length - 1];
              }
              const theKey = keys[0];
              const theChild = parentTree.children
                ? parentTree.children[theKey]
                : null;
              if (theChild) {
                if (keys.length === 1) {
                  if (theChild.children) {
                    theChild.children.push(newTree);
                  } else {
                    theChild.children = [newTree];
                  }
                  theChild.value++;
                  return [theKey, theChild.children.length - 1];
                } else {
                  const lastKeys = insertTree(theChild, keys.slice(1), newTree);
                  return [theKey, ...lastKeys];
                }
              }
              return [];
            };

            const getNodeByKeys = (
              keys: number[],
              parentTrees: Tree[]
            ): Tree | null => {
              if (keys.length === 0) {
                return null;
              }
              if (keys[0] >= parentTrees.length) {
                return null;
              }
              const node = parentTrees[keys[0]];
              if (keys.length === 1) {
                return node;
              }
              if (!node.children) return null;
              return getNodeByKeys(keys.slice(1), node.children);
            };
            arr.map((x) => {
              if (!routeNodes[x[0]]) {
                const tmpTree :Tree= {
                  id: key.toString(),
                  name: x[0],
                  value: 1,
                  collapsed:true
                };
                let newRoot = roots[x[0]];
                if (newRoot) {
                  newRoot.value++;
                } else {
                  roots[x[0]] = tmpTree;
                  insertTreeRoute(tmpTree, []);
                }
                if (root.id === "-1") {
                  root.id = key.toString();
                  root.name = x[0];
                  root.value = 1;
                  insertTreeRoute(root, []);
                  key++;
                }
              }

              const routeNode1 = routeNodes[x[0]];
              const tmpTree:Tree = {
                id: key.toString(),
                name: x[1],
                value: 1,
                collapsed:true
              };
              const routeNode2 = routeNodes[x[1]];
              if (!routeNode2) {
                const routeKey = routeNodes[x[0]]?.route ?? [];
                const resKeys = insertTree(root, routeKey, tmpTree);
                insertTreeRoute(tmpTree, resKeys);
                key++;
              } else {
                tmpTree.id = routeNode2.id;
                const rootKeys = [0, ...(routeNode2.route ?? [])];
                const getNode = getNodeByKeys(rootKeys, [root]);
                let theParentNode: Tree | null = null;
                if (getNode) {
                  theParentNode = getNode;
                }
                if (!repeatDependNodes[routeNode2.name]) {
                  const newRepeatDependNode = {
                    id: tmpTree.id,
                    name: tmpTree.name,
                    value: tmpTree.value,
                    collapsed:true,
                    children: [
                      {
                        id: theParentNode!.id,
                        name: theParentNode!.name,
                        value: theParentNode!.value,
                        collapsed:true,
                      },
                      {
                        id: routeNode1.id,
                        name: routeNode1.name,
                        value: routeNode1.value,
                        collapsed:true,
                      },
                    ],
                  };
                  repeatDependNodes[tmpTree.name] = newRepeatDependNode;
                } else {
                    repeatDependNodes[routeNode2.name].children = [...repeatDependNodes[routeNode2.name].children!,{
                        name:routeNode1.name,
                        value:routeNode1.value,
                        id:routeNode1.id,
                        collapsed:true,
                    }]
                    repeatDependNodes[tmpTree.name] = repeatDependNodes[routeNode2.name];
                }
              }
            });
            // const nodes: TreeNode[] = [];
            // const map = new Map<string, string[]>();
            // const data: GraphShape = {
            //   nodes: [],
            //   edges: [],
            // };
            // arr.map((x) => {
            //     [0, 1].map((i) => {
            //       if (
            //         data.nodes.findIndex((v: GraphNode) => v.id === x[i]) === -1
            //       ) {
            //         data.nodes.push({ id: x[i] });
            //       }
            //     });
            //     data.edges.push({ source: x[0], target: x[1] });

            //   //   if (map.has(x[0])) {
            //   //     map.get(x[0])!.push(x[1]);
            //   //   } else {
            //   //     map.set(x[0], [x[1]]);
            //   //   }
            // });

            // map.forEach((value, key) => {
            //   nodes.push({
            //     id: key,
            //     children: [],
            //   });
            // });
            // map.forEach((value, key) => {
            //   value.map((x) => {
            //     nodes
            //       .find((y) => y.id === key)!
            //       .children!.push(
            //         nodes.find((y) => y.id === x) ?? {
            //           id: x,
            //           children: [],
            //         }
            //       );
            //   });
            // });
            // onChangeData(nodes.find((x) => x.id === arr[0][0]));
            onChangeData(root);
            message.success("Upload success");
          } catch (e) {
            message.error(
              "Invalid file format, please upload a valid module graph file." +
                e
            );
          }
          reject("");
        };
      });
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
};

export default UploadPage;
