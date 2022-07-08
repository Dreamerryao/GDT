import { useContext, useState, createContext } from "react";

interface Interface {
  data?: TreeNode,
  onChangeData:(newData?:TreeNode) => void;
}

export interface TreeNode {
    name: string;
    isExpanded?: boolean;
    children?: TreeNode[];
  }

export interface Event {
  eid: number;
  archieve: boolean;
  grade: number;
  name: string;
  score: string;
  semester: string;
  key: string;
}

const DataContext = createContext<Interface>(undefined!);

export function DataProvider({
  children = null,
}: {
  children: JSX.Element | null;
}) {
  const [data,setData] = useState<TreeNode|undefined>(undefined);

  const onChangeData = (newData?:TreeNode) => {
    setData(newData);
  }


  return (
    <DataContext.Provider
      value={{
        data,
        onChangeData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => {
  return useContext(DataContext);
};