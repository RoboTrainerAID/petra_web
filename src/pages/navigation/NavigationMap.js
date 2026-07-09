import {makeStyles} from "@material-ui/core";
import {useMapRelay} from "../../petra_central_control/useMapRelay";
import React, {useCallback, useEffect, useRef, useState} from "react";
import face from "../../assets/face_placeholder.png";
import {useRobotPosition} from "../../petra_central_control/useRobotPosition";
import {useRobotPath} from "../../petra_central_control/useRobotPath";
import {
    MAP_CONTINUOUS_ROTATION,
    MAP_FLIP_GRID,
    MAP_FLIP_PATH, MAP_FLIP_ROTATION, MAP_PATH_THICKNESS,
    MAP_ROTATION_OFFSET, MAP_ZOOM
} from "../../constants/MapViewConfig";

const useStyles = makeStyles(() => ({
    container: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        aspectRatio: 1.2,
    },
    map: {
        position: "absolute",
        zIndex: 0,
        transition: "all .2s linear"
    },
    path: {
        position: "absolute",
        zIndex: 0,
        transition: "all .2s linear"
    },
    petraMarker: {
        position: "absolute",
        width: "10%",
        left: "45%",
        top: "45%",
        borderStyle: "solid",
        borderColor: "#007bff",
        borderWidth: "6px",
        borderRadius: "4px"
    }
}));

export function NavigationMap({startTour}) {
    const styles = useStyles();
    const [ mapData, mapInfo ] = useMapRelay();
    const [ robotPosition, rposInfo ] = useRobotPosition();
    const [ robotPath, rpathInfo ] = useRobotPath();

    const resolvedPosition = Object.keys(robotPosition || {}).length <= 0 ? { x: 0, y: 0, angle: 0} : robotPosition;
    const rotationRef = useRef(0);
    useEffect(() => {
        rotationRef.current = 0;
    }, []); //reset rotation on reload
    useEffect(() => {
        const effectiveRotation = rotationRef.current % (2 * Math.PI) + (rotationRef.current % (2 * Math.PI) >= 0 ? 0 : 2 * Math.PI);  //actual modulus

        //calculate diff to make rotation shorter than 180deg
        const diff = resolvedPosition.angle - effectiveRotation;
        rotationRef.current = rotationRef.current + (Math.abs(diff) > Math.PI ? -Math.sign(diff) * (2 * Math.PI - Math.abs(diff)) : diff);

    }, [ resolvedPosition.angle ]);
    const resolvedRotation = (MAP_FLIP_ROTATION ? -1 : 1) * (MAP_CONTINUOUS_ROTATION ? rotationRef.current : resolvedPosition.angle);

    const resolvedPath = robotPath || [];

    const zoomFactor = MAP_ZOOM;

    //retrieve container element to be able
    const [ cWidth, setCWidth ] = useState(1);
    const [ cHeight, setCHeight ] = useState(1);
    const updateContainer = useCallback((container) => {
        setCWidth(container?.clientWidth || 1);
        setCHeight(container?.clientHeight || 1);
    }, []);

    return (
        <div className={styles.container} ref={updateContainer}>
            {/* View map scaled and positioned according to data from relays */}
            {mapInfo.isSuccess && <img
                alt={"map"}
                className={styles.map}
                style={{
                    aspectRatio: mapData.width / mapData.height,
                    width: `${zoomFactor * mapData.width * mapData.resolution * 16}px`,
                    height: `${zoomFactor * mapData.height * mapData.resolution * 16}px`,
                    top: `${zoomFactor * (mapData.origin_y - resolvedPosition.y) * 16 + cHeight / 2}px`,
                    left: `${zoomFactor * (mapData.origin_x - resolvedPosition.x) * 16 + cWidth / 2}px`,
                    transform: `rotate(${mapData.origin_angle - resolvedRotation + MAP_ROTATION_OFFSET}rad) scaleX(${MAP_FLIP_GRID ? -1 : 1})`,
                    transformOrigin: `${zoomFactor * (mapData.origin_x - resolvedPosition.x) * -16}px ${zoomFactor * (mapData.origin_y - resolvedPosition.y) * -16}px`
                }}
                src={mapData.image}
            />}
            {mapInfo.isSuccess && <svg xmlns="http://www.w3.org/2000/svg" className={styles.path} style={{
                width: `${zoomFactor * mapData.width * mapData.resolution * 16}px`,
                height: `${zoomFactor * mapData.height * mapData.resolution * 16}px`,
                top: `${zoomFactor * (mapData.origin_y - resolvedPosition.y) * 16 + cHeight / 2}px`,
                left: `${zoomFactor * (mapData.origin_x - resolvedPosition.x) * 16 + cWidth / 2}px`,
                transform: `rotate(${mapData.origin_angle - resolvedRotation  + MAP_ROTATION_OFFSET}rad) scaleX(${MAP_FLIP_PATH ? -1 : 1})`,
                transformOrigin: `${zoomFactor * (mapData.origin_x - resolvedPosition.x) * -16}px ${zoomFactor * (mapData.origin_y - resolvedPosition.y) * -16}px`
            }} viewBox={`${mapData.origin_x} ${mapData.origin_y} ${mapData.width * mapData.resolution} ${mapData.height * mapData.resolution}`}>
                <path
                    fill={"none"}
                    stroke={"#007bff"}
                    stroke-width={MAP_PATH_THICKNESS}
                    d={resolvedPath.map((p, i) => `${i <= 0 ? "M" : "L"}${p.x},${p.y}`).join("")}
                />
            </svg>}
            <img src={face} alt="PeTRA face" className={styles.petraMarker} onClick={startTour}/>
        </div>
    )
}
