import { createContext, useState } from "react";

export const AlertasContext = createContext()

export function AlertasProvider({children}){
    const [alertas, setAlertas] = useState([])

    return (
        <AlertasContext.Provider value={{ alertas, setAlertas}}>
            {children}
        </AlertasContext.Provider>
    )
}