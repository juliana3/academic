import { createContext } from "react"
import { useState } from "react"

export const PlanesContext = createContext()

export function PlanesProvider({children}){
    const [planes, setPlanes] = useState([])

    return (
        <PlanesContext.Provider value={{ planes, setPlanes }}>
            {children}
        </PlanesContext.Provider>
    )
}

