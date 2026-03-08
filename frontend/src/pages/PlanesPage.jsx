import { useEffect, useContext } from "react";
import { PlanesContext } from "../store/planesStore"
import {obtenerPlanes} from "../api/planes"

function PlanesPage(){
    const { planes, setPlanes} = useContext(PlanesContext)

    useEffect(() => {
        obtenerPlanes().then(data => setPlanes(data))
    }, [])  

    return (
        <div>
            <h1> Planes </h1>
            {Array.isArray(planes) && planes.map(plan => (
                <div key={plan.id}>
                    <p>{plan.nombre}</p>
                </div>
            ))}
        </div>
    )
}

export default PlanesPage