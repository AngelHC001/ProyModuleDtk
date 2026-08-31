import React from "react";
import { createContext, useContext } from "react";

export const ViewContext = createContext(null);
export function useView(){
    const ctx = useContext(viewContext);
    if(!ctx) throw new Error('El componente useView debe estar en MainSection');
    return ctx;
} 