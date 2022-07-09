import { useContext, useState, createContext } from "react";

interface Interface {
  data?: Tree;
  onChangeData: (newData?: Tree) => void;
}

export interface Tree {
  id: string;
  name: string;
  value: number;
  children?: Tree[];
}
export interface TreeNode {
  id: string;
  children?: TreeNode[];
}

export interface GraphShape {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  x?:number;
  y?:number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

const DataContext = createContext<Interface>(undefined!);

export function DataProvider({
  children = null,
}: {
  children: JSX.Element | null;
}) {
  const [data, setData] = useState<Tree | undefined>(undefined);

  const onChangeData = (newData?: Tree) => {
    setData(newData);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        onChangeData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  return useContext(DataContext);
};
